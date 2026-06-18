import { requireSupabaseClient } from '../../lib/supabaseClient'
import type { Announcement } from '../../types/announcement'
import type { AuditLog, Registration } from '../../types/registration'
import { getCurrentEventId, setCurrentEventId } from '../../utils/storage'
import {
  areAllRequiredCheckpointsApproved,
  ensureCheckpointProgress,
} from '../../utils/checkpoints'
import { getAnnouncementSummary } from '../../utils/announcements'
import type { RepositoryClient } from './types'
import {
  announcementInputToRow,
  auditLogToRow,
  checkpointProgressToRow,
  mapAnnouncementRow,
  mapEventRow,
  mapRegistrationRow,
  memberToRow,
  registrationToRow,
  type SupabaseAnnouncementRow,
  type SupabaseEventRow,
  type SupabaseRegistrationRow,
} from './supabaseTransforms'

function notImplemented(methodName: string): never {
  throw new Error(`该模块的云端版本将在后续阶段接入：${methodName}`)
}

function createAuditLog(
  action: string,
  operator: string,
  reason?: string,
): AuditLog {
  return {
    id: crypto.randomUUID(),
    action,
    operator,
    reason,
    createdAt: new Date().toISOString(),
  }
}

async function getCurrentUserId() {
  const client = requireSupabaseClient()
  const { data, error } = await client.auth.getUser()

  if (error) {
    throw new Error(`读取当前用户失败：${error.message}`)
  }

  if (!data.user) {
    throw new Error('请先登录后再操作云端数据。')
  }

  return data.user.id
}

async function readEvents() {
  const client = requireSupabaseClient()
  const { data, error } = await client
    .from('events')
    .select('*, event_projects(*), event_checkpoints(*)')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`读取赛事失败：${error.message}`)
  }

  return (data as SupabaseEventRow[]).map(mapEventRow)
}

async function readRegistrations(eventId?: string): Promise<Registration[]> {
  const client = requireSupabaseClient()
  let query = client
    .from('registrations')
    .select('*, registration_members(*), audit_logs(*), checkpoint_progress(*)')
    .order('updated_at', { ascending: false })

  if (eventId) {
    query = query.eq('event_id', eventId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`读取报名失败：${error.message}`)
  }

  return (data as SupabaseRegistrationRow[]).map(mapRegistrationRow)
}

async function readRegistration(registrationId: string): Promise<Registration | undefined> {
  const registrations = await readRegistrations()

  return registrations.find((registration) => registration.id === registrationId)
}

async function replaceMembers(registration: Registration) {
  const client = requireSupabaseClient()
  const { error: deleteError } = await client
    .from('registration_members')
    .delete()
    .eq('registration_id', registration.id)

  if (deleteError) {
    throw new Error(`更新成员前清理旧成员失败：${deleteError.message}`)
  }

  if (registration.members.length === 0) {
    return
  }

  const { error } = await client
    .from('registration_members')
    .insert(registration.members.map((member) => memberToRow(member, registration.id)))

  if (error) {
    throw new Error(`保存成员失败：${error.message}`)
  }
}

async function insertAuditLog(registrationId: string, auditLog: AuditLog) {
  const client = requireSupabaseClient()
  const { error } = await client.from('audit_logs').insert(auditLogToRow(auditLog, registrationId))

  if (error) {
    throw new Error(`写入操作日志失败：${error.message}`)
  }
}

async function saveRegistration(registration: Registration) {
  const client = requireSupabaseClient()
  const userId = await getCurrentUserId()
  const { error } = await client
    .from('registrations')
    .upsert(registrationToRow(registration, userId))

  if (error) {
    throw new Error(`保存报名失败：${error.message}`)
  }

  await replaceMembers(registration)

  return readRegistrations()
}

async function updateRegistrationStatus(
  registrationId: string,
  status: Registration['status'],
  auditLog: AuditLog,
) {
  const client = requireSupabaseClient()
  const { error } = await client
    .from('registrations')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', registrationId)

  if (error) {
    throw new Error(`更新报名状态失败：${error.message}`)
  }

  await insertAuditLog(registrationId, auditLog)

  return readRegistrations()
}

async function updateRegistrationPatch(
  registrationId: string,
  patch: Partial<Pick<Registration, 'checkinStatus' | 'executionStatus' | 'status'>>,
  auditLog?: AuditLog,
) {
  const client = requireSupabaseClient()
  const rowPatch: Record<string, string> = {
    updated_at: new Date().toISOString(),
  }

  if (patch.status) rowPatch.status = patch.status
  if (patch.checkinStatus) rowPatch.checkin_status = patch.checkinStatus
  if (patch.executionStatus) rowPatch.execution_status = patch.executionStatus

  const { error } = await client.from('registrations').update(rowPatch).eq('id', registrationId)

  if (error) {
    throw new Error(`更新报名状态失败：${error.message}`)
  }

  if (auditLog) {
    await insertAuditLog(registrationId, auditLog)
  }

  return readRegistrations()
}

async function writeCheckpointProgress(
  registrationId: string,
  progress: Parameters<typeof checkpointProgressToRow>[1],
  auditLog: AuditLog,
) {
  const client = requireSupabaseClient()
  const { error } = await client
    .from('checkpoint_progress')
    .upsert(checkpointProgressToRow(registrationId, progress), {
      onConflict: 'registration_id,checkpoint_id',
    })

  if (error) {
    throw new Error(`保存点位进度失败：${error.message}`)
  }

  await insertAuditLog(registrationId, auditLog)

  return readRegistrations()
}

async function readAnnouncements(eventId?: string): Promise<Announcement[]> {
  const client = requireSupabaseClient()
  let query = client
    .from('announcements')
    .select('*, announcement_confirmations(*)')
    .order('updated_at', { ascending: false })

  if (eventId) {
    query = query.eq('event_id', eventId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`读取通知失败：${error.message}`)
  }

  return (data as SupabaseAnnouncementRow[]).map(mapAnnouncementRow)
}

async function updateAnnouncementComputedStatus(announcementId: string) {
  const client = requireSupabaseClient()
  const announcements = await readAnnouncements()
  const announcement = announcements.find((item) => item.id === announcementId)

  if (!announcement || announcement.status === 'draft') {
    return
  }

  const registrations = await readRegistrations(announcement.eventId)
  const summary = getAnnouncementSummary(announcement, registrations)
  const { error } = await client
    .from('announcements')
    .update({
      status: summary.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', announcementId)

  if (error) {
    throw new Error(`更新通知确认状态失败：${error.message}`)
  }
}

export const supabaseAdapter: RepositoryClient = {
  events: {
    getEventTemplates: readEvents,
    getCurrentEventId: async () => getCurrentEventId(),
    setCurrentEventId: async (eventId) => setCurrentEventId(eventId),
  },
  registrations: {
    getRegistrations: () => readRegistrations(),
    getRegistrationsByEventId: (eventId) => readRegistrations(eventId),
    getRegistrationById: readRegistration,
    createRegistration: saveRegistration,
    updateRegistration: saveRegistration,
    deleteRegistration: async (registrationId) => {
      const client = requireSupabaseClient()
      const { error } = await client.from('registrations').delete().eq('id', registrationId)

      if (error) {
        throw new Error(`删除报名失败：${error.message}`)
      }

      return readRegistrations()
    },
    resetRegistrations: async () => notImplemented('resetRegistrations'),
  },
  reviews: {
    approveRegistration: async (registrationId) =>
      updateRegistrationStatus(
        registrationId,
        'approved',
        createAuditLog('approved', '审核员', '资料审核通过'),
      ),
    rejectRegistration: async (registrationId, reason) =>
      updateRegistrationStatus(
        registrationId,
        'rejected',
        createAuditLog('rejected', '审核员', reason),
      ),
    markRegistrationAsRegistered: async (registrationId) =>
      updateRegistrationStatus(
        registrationId,
        'registered',
        createAuditLog('registered', '审核员', '确认进入正式报名名单'),
      ),
    appendAuditLog: async (registrationId, auditLog) => {
      await insertAuditLog(registrationId, auditLog)

      return readRegistrations()
    },
  },
  checkin: {
    checkInRegistration: async (registrationId) => {
      const registration = await readRegistration(registrationId)

      if (!registration) throw new Error('未找到报名记录。')
      if (registration.status !== 'registered') throw new Error('该报名尚未进入正式名单，不能签到。')
      if (registration.checkinStatus === 'departed') throw new Error('该报名已出发。')
      if (registration.checkinStatus === 'checked_in') throw new Error('该报名已完成签到。')

      return updateRegistrationPatch(
        registrationId,
        { checkinStatus: 'checked_in', executionStatus: 'not_started' },
        createAuditLog('checked_in', '检录员', '现场签到完成'),
      )
    },
    markRegistrationDeparted: async (registrationId) => {
      const registration = await readRegistration(registrationId)

      if (!registration) throw new Error('未找到报名记录。')
      if (registration.status !== 'registered') throw new Error('该报名尚未进入正式名单，不能出发。')
      if (registration.checkinStatus === 'departed') throw new Error('该报名已出发。')
      if (registration.checkinStatus !== 'checked_in') throw new Error('请先完成签到检录。')

      return updateRegistrationPatch(
        registrationId,
        { checkinStatus: 'departed', executionStatus: 'in_progress' },
        createAuditLog('departed', '检录员', '队伍已出发'),
      )
    },
  },
  checkpoints: {
    initializeCheckpointProgress: async (registrationId) => {
      const registration = await readRegistration(registrationId)
      const events = await readEvents()
      const eventConfig = events.find((event) => event.id === registration?.eventId)

      if (!registration || !eventConfig) throw new Error('无法初始化点位进度。')

      const progress = ensureCheckpointProgress(registration, eventConfig)
      const client = requireSupabaseClient()
      const { error } = await client
        .from('checkpoint_progress')
        .upsert(
          progress.map((item) => checkpointProgressToRow(registrationId, item)),
          { onConflict: 'registration_id,checkpoint_id' },
        )

      if (error) {
        throw new Error(`初始化点位进度失败：${error.message}`)
      }

      return readRegistrations()
    },
    markCheckpointArrived: async (registrationId, checkpointId) => {
      const registration = await readRegistration(registrationId)
      const currentProgress = registration?.checkpointProgress.find(
        (item) => item.checkpointId === checkpointId,
      )

      if (!registration) throw new Error('未找到报名记录。')
      if (registration.status !== 'registered' || registration.checkinStatus !== 'departed') {
        throw new Error('出发后才能进行点位打卡。')
      }
      if (currentProgress?.status === 'submitted' || currentProgress?.status === 'approved') {
        throw new Error('该点位已提交或已通过，不能回退为已到达。')
      }

      return writeCheckpointProgress(
        registrationId,
        { checkpointId, status: 'arrived' },
        createAuditLog('checkpoint_arrived', '参赛者', `到达点位：${checkpointId}`),
      )
    },
    submitCheckpointTask: async (registrationId, checkpointId, payload) => {
      const registration = await readRegistration(registrationId)
      const currentProgress = registration?.checkpointProgress.find(
        (item) => item.checkpointId === checkpointId,
      )

      if (!registration) throw new Error('未找到报名记录。')
      if (currentProgress?.status !== 'arrived') {
        throw new Error('请先到达点位，再提交任务。')
      }

      return writeCheckpointProgress(
        registrationId,
        {
          checkpointId,
          evidenceFileName: payload.evidenceFileName,
          note: payload.note,
          status: 'submitted',
          submittedAt: new Date().toISOString(),
        },
        createAuditLog('checkpoint_submitted', '参赛者', `提交点位任务：${checkpointId}`),
      )
    },
    approveCheckpointTask: async (registrationId, checkpointId) => {
      const registration = await readRegistration(registrationId)
      const currentProgress = registration?.checkpointProgress.find(
        (item) => item.checkpointId === checkpointId,
      )

      if (!registration) throw new Error('未找到报名记录。')
      if (currentProgress?.status !== 'submitted') {
        throw new Error('只有已提交的点位任务可以审核通过。')
      }

      return writeCheckpointProgress(
        registrationId,
        { checkpointId, status: 'approved' },
        createAuditLog('checkpoint_approved', '工作人员', `点位任务审核通过：${checkpointId}`),
      )
    },
    markRegistrationAttentionNeeded: async (registrationId, reason) =>
      updateRegistrationPatch(
        registrationId,
        { executionStatus: 'attention_needed' },
        createAuditLog('attention_needed', '工作人员', reason),
      ),
    clearRegistrationAttention: async (registrationId, reason = '异常关注已解除') =>
      updateRegistrationPatch(
        registrationId,
        { executionStatus: 'in_progress' },
        createAuditLog('attention_resolved', '工作人员', reason),
      ),
    markRegistrationFinished: async (registrationId) => {
      const registration = await readRegistration(registrationId)
      const events = await readEvents()
      const eventConfig = events.find((event) => event.id === registration?.eventId)

      if (!registration || !eventConfig) throw new Error('无法标记完赛。')
      if (!areAllRequiredCheckpointsApproved(registration, eventConfig)) {
        throw new Error('仍有必需点位未通过。')
      }

      return updateRegistrationPatch(
        registrationId,
        { executionStatus: 'finished' },
        createAuditLog('finished', '工作人员', '所有必需点位已完成，标记完赛'),
      )
    },
  },
  announcements: {
    getAnnouncements: () => readAnnouncements(),
    getAnnouncementsByEventId: (eventId) => readAnnouncements(eventId),
    createAnnouncement: async (input) => {
      const client = requireSupabaseClient()
      const userId = await getCurrentUserId()
      const { error } = await client.from('announcements').insert(announcementInputToRow(input, userId))

      if (error) throw new Error(`创建通知失败：${error.message}`)

      return readAnnouncements()
    },
    updateAnnouncement: async (announcementId, patch) => {
      const client = requireSupabaseClient()
      const rowPatch: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }

      if (patch.typeId) rowPatch.type_id = patch.typeId
      if (patch.title) rowPatch.title = patch.title
      if (patch.content) rowPatch.content = patch.content
      if (patch.severity) rowPatch.severity = patch.severity
      if (patch.targetScope) rowPatch.target_scope = patch.targetScope
      if (patch.targetProjectIds || patch.targetRegistrationStatuses) {
        rowPatch.target_filters = {
          targetProjectIds: patch.targetProjectIds,
          targetRegistrationStatuses: patch.targetRegistrationStatuses,
        }
      }

      const { error } = await client
        .from('announcements')
        .update(rowPatch)
        .eq('id', announcementId)
        .eq('status', 'draft')

      if (error) throw new Error(`更新通知失败：${error.message}`)

      return readAnnouncements()
    },
    publishAnnouncement: async (announcementId) => {
      const client = requireSupabaseClient()
      const { error } = await client
        .from('announcements')
        .update({
          published_at: new Date().toISOString(),
          status: 'published',
          updated_at: new Date().toISOString(),
        })
        .eq('id', announcementId)
        .eq('status', 'draft')

      if (error) throw new Error(`发布通知失败：${error.message}`)

      await updateAnnouncementComputedStatus(announcementId)

      return readAnnouncements()
    },
    deleteDraftAnnouncement: async (announcementId) => {
      const client = requireSupabaseClient()
      const { error } = await client
        .from('announcements')
        .delete()
        .eq('id', announcementId)
        .eq('status', 'draft')

      if (error) throw new Error(`删除草稿失败：${error.message}`)

      return readAnnouncements()
    },
    confirmAnnouncementRead: async (announcementId, registrationId, confirmedBy = '参赛者') => {
      const client = requireSupabaseClient()
      const { error } = await client.from('announcement_confirmations').upsert(
        {
          announcement_id: announcementId,
          confirmed_at: new Date().toISOString(),
          confirmed_by: confirmedBy,
          registration_id: registrationId,
        },
        { onConflict: 'announcement_id,registration_id' },
      )

      if (error) throw new Error(`确认通知失败：${error.message}`)

      await updateAnnouncementComputedStatus(announcementId)

      return readAnnouncements()
    },
    resetAnnouncements: async () => notImplemented('resetAnnouncements'),
  },
  demo: {
    resetAllDemoData: async () => notImplemented('resetAllDemoData'),
    seedCompleteDemoScenario: async () => notImplemented('seedCompleteDemoScenario'),
    getDemoScenarioSummary: async () => notImplemented('getDemoScenarioSummary'),
  },
}
