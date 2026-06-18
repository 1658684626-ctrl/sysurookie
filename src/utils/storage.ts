import { defaultEventId, eventTemplates } from '../data/eventTemplates'
import { mockAnnouncements } from '../data/mockAnnouncements'
import { mockRegistrations } from '../data/mockRegistrations'
import type { Announcement, AnnouncementDraftInput } from '../types/announcement'
import type { AuditLog, CheckpointProgress, Registration } from '../types/registration'
import {
  getAnnouncementSummary,
  getComputedAnnouncementStatus,
} from './announcements'
import {
  areAllRequiredCheckpointsApproved,
  canAccessCheckpoint,
  canSubmitCheckpointTask,
  ensureCheckpointProgress,
  getProjectCheckpoints,
} from './checkpoints'
import { currentEventIdSchema } from './validators'

const registrationsKey = 'easyevent.registrations'
const announcementsKey = 'easyevent.announcements'
const currentEventKey = 'easyevent.currentEventId'

function canUseLocalStorage(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false
  }

  try {
    const testKey = 'easyevent.storage-test'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

export function getStoredRegistrations(): Registration[] {
  if (!canUseLocalStorage()) {
    return mockRegistrations
  }

  try {
    const raw = window.localStorage.getItem(registrationsKey)

    if (!raw) {
      return mockRegistrations
    }

    const parsed = JSON.parse(raw)

    return Array.isArray(parsed) ? (parsed as Registration[]) : mockRegistrations
  } catch {
    return mockRegistrations
  }
}

export function saveStoredRegistrations(registrations: Registration[]): void {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(registrationsKey, JSON.stringify(registrations))
}

export function getStoredAnnouncements(): Announcement[] {
  if (!canUseLocalStorage()) {
    return mockAnnouncements
  }

  try {
    const raw = window.localStorage.getItem(announcementsKey)

    if (!raw) {
      return mockAnnouncements
    }

    const parsed = JSON.parse(raw)

    return Array.isArray(parsed) ? (parsed as Announcement[]) : mockAnnouncements
  } catch {
    return mockAnnouncements
  }
}

export function saveStoredAnnouncements(announcements: Announcement[]): void {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(announcementsKey, JSON.stringify(announcements))
}

export function resetDemoData(): Registration[] {
  if (canUseLocalStorage()) {
    window.localStorage.setItem(registrationsKey, JSON.stringify(mockRegistrations))
    window.localStorage.setItem(announcementsKey, JSON.stringify(mockAnnouncements))
  }

  return mockRegistrations
}

export function resetDemoAnnouncements(): Announcement[] {
  if (canUseLocalStorage()) {
    window.localStorage.setItem(announcementsKey, JSON.stringify(mockAnnouncements))
  }

  return mockAnnouncements
}

export function getCurrentEventId(): string {
  if (!canUseLocalStorage()) {
    return defaultEventId
  }

  const raw = window.localStorage.getItem(currentEventKey)
  const parsed = currentEventIdSchema.safeParse(raw)

  return parsed.success ? parsed.data : defaultEventId
}

export function setCurrentEventId(eventId: string): void {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(currentEventKey, eventId)
}

export function getRegistrationsByEventId(eventId: string): Registration[] {
  return getStoredRegistrations().filter(
    (registration) => registration.eventId === eventId,
  )
}

export function getRegistrationById(registrationId: string): Registration | undefined {
  return getStoredRegistrations().find(
    (registration) => registration.id === registrationId,
  )
}

export function createRegistration(registration: Registration): Registration[] {
  const registrations = [registration, ...getStoredRegistrations()]
  saveStoredRegistrations(registrations)

  return registrations
}

export function updateRegistration(updatedRegistration: Registration): Registration[] {
  const registrations = getStoredRegistrations()
  const nextRegistrations = registrations.some(
    (registration) => registration.id === updatedRegistration.id,
  )
    ? registrations.map((registration) =>
        registration.id === updatedRegistration.id ? updatedRegistration : registration,
      )
    : [updatedRegistration, ...registrations]

  saveStoredRegistrations(nextRegistrations)

  return nextRegistrations
}

export function deleteRegistration(registrationId: string): Registration[] {
  const registrations = getStoredRegistrations().filter(
    (registration) => registration.id !== registrationId,
  )
  saveStoredRegistrations(registrations)

  return registrations
}

export function createAnnouncement(input: AnnouncementDraftInput): Announcement[] {
  const now = new Date().toISOString()
  const announcement: Announcement = {
    ...input,
    id: `ann-demo-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    status: 'draft',
    confirmations: [],
    createdBy: '管理员',
    createdAt: now,
    updatedAt: now,
  }
  const announcements = [announcement, ...getStoredAnnouncements()]
  saveStoredAnnouncements(announcements)

  return announcements
}

export function updateAnnouncement(
  announcementId: string,
  patch: Partial<AnnouncementDraftInput>,
): Announcement[] {
  const announcements = getStoredAnnouncements()
  const nextAnnouncements = announcements.map((announcement) => {
    if (announcement.id !== announcementId || announcement.status !== 'draft') {
      return announcement
    }

    return {
      ...announcement,
      ...patch,
      updatedAt: new Date().toISOString(),
    }
  })

  saveStoredAnnouncements(nextAnnouncements)

  return nextAnnouncements
}

export function publishAnnouncement(announcementId: string): Announcement[] {
  const announcements = getStoredAnnouncements()
  const registrations = getStoredRegistrations()
  const now = new Date().toISOString()
  const nextAnnouncements = announcements.map((announcement) => {
    if (announcement.id !== announcementId || announcement.status !== 'draft') {
      return announcement
    }

    const publishedAnnouncement: Announcement = {
      ...announcement,
      status: 'published',
      publishedAt: now,
      updatedAt: now,
    }
    const summary = getAnnouncementSummary(publishedAnnouncement, registrations)

    return {
      ...publishedAnnouncement,
      status: summary.status,
    }
  })

  saveStoredAnnouncements(nextAnnouncements)

  return nextAnnouncements
}

export function deleteDraftAnnouncement(announcementId: string): Announcement[] {
  const announcements = getStoredAnnouncements()
  const nextAnnouncements = announcements.filter(
    (announcement) =>
      announcement.id !== announcementId || announcement.status !== 'draft',
  )

  saveStoredAnnouncements(nextAnnouncements)

  return nextAnnouncements
}

export function confirmAnnouncementRead(
  announcementId: string,
  registrationId: string,
  confirmedBy = '参赛者',
): Announcement[] {
  const announcements = getStoredAnnouncements()
  const registrations = getStoredRegistrations()
  const nextAnnouncements = announcements.map((announcement) => {
    if (announcement.id !== announcementId || announcement.status === 'draft') {
      return announcement
    }

    if (
      announcement.confirmations.some(
        (confirmation) => confirmation.registrationId === registrationId,
      )
    ) {
      return announcement
    }

    const updatedAnnouncement: Announcement = {
      ...announcement,
      confirmations: [
        ...announcement.confirmations,
        {
          registrationId,
          confirmedAt: new Date().toISOString(),
          confirmedBy,
        },
      ],
      updatedAt: new Date().toISOString(),
    }
    const summary = getAnnouncementSummary(updatedAnnouncement, registrations)

    return {
      ...updatedAnnouncement,
      status: getComputedAnnouncementStatus(
        updatedAnnouncement.status,
        summary.targetTotal,
        summary.confirmedTotal,
      ),
    }
  })

  saveStoredAnnouncements(nextAnnouncements)

  return nextAnnouncements
}

export function getAnnouncementsByEventId(eventId: string): Announcement[] {
  return getStoredAnnouncements().filter(
    (announcement) => announcement.eventId === eventId,
  )
}

export function appendAuditLog(
  registrationId: string,
  auditLog: AuditLog,
): Registration[] {
  const registration = getRegistrationById(registrationId)

  if (!registration) {
    return getStoredRegistrations()
  }

  return updateRegistration({
    ...registration,
    auditLogs: [auditLog, ...registration.auditLogs],
    updatedAt: new Date().toISOString(),
  })
}

export function approveRegistration(registrationId: string): Registration[] {
  const registration = getRegistrationById(registrationId)

  if (!registration) {
    return getStoredRegistrations()
  }

  return updateRegistration({
    ...registration,
    status: 'approved',
    auditLogs: [
      createAuditLog('approved', '资料审核通过'),
      ...registration.auditLogs,
    ],
    updatedAt: new Date().toISOString(),
  })
}

export function rejectRegistration(
  registrationId: string,
  reason: string,
): Registration[] {
  const registration = getRegistrationById(registrationId)

  if (!registration) {
    return getStoredRegistrations()
  }

  return updateRegistration({
    ...registration,
    status: 'rejected',
    auditLogs: [createAuditLog('rejected', reason), ...registration.auditLogs],
    updatedAt: new Date().toISOString(),
  })
}

export function markRegistrationAsRegistered(registrationId: string): Registration[] {
  const registration = getRegistrationById(registrationId)

  if (!registration) {
    return getStoredRegistrations()
  }

  return updateRegistration({
    ...registration,
    status: 'registered',
    auditLogs: [
      createAuditLog('registered', '确认进入正式报名名单'),
      ...registration.auditLogs,
    ],
    updatedAt: new Date().toISOString(),
  })
}

export function checkInRegistration(registrationId: string): Registration[] {
  const registration = getRegistrationById(registrationId)

  if (!registration || registration.status !== 'registered') {
    return getStoredRegistrations()
  }

  if (registration.checkinStatus !== 'not_checked_in') {
    return getStoredRegistrations()
  }

  return updateRegistration({
    ...registration,
    checkinStatus: 'checked_in',
    executionStatus: 'not_started',
    auditLogs: [
      createAuditLog('checked_in', '现场签到完成', '检录员'),
      ...registration.auditLogs,
    ],
    updatedAt: new Date().toISOString(),
  })
}

export function markRegistrationDeparted(registrationId: string): Registration[] {
  const registration = getRegistrationById(registrationId)

  if (!registration || registration.status !== 'registered') {
    return getStoredRegistrations()
  }

  if (registration.checkinStatus !== 'checked_in') {
    return getStoredRegistrations()
  }

  return updateRegistration({
    ...registration,
    checkinStatus: 'departed',
    executionStatus: 'in_progress',
    auditLogs: [
      createAuditLog('departed', '队伍已出发', '检录员'),
      ...registration.auditLogs,
    ],
    updatedAt: new Date().toISOString(),
  })
}

export function initializeCheckpointProgress(registrationId: string): Registration[] {
  const registration = getRegistrationById(registrationId)
  const eventConfig = registration ? getEventConfigForRegistration(registration) : undefined

  if (!registration || !eventConfig) {
    return getStoredRegistrations()
  }

  return updateRegistration({
    ...registration,
    checkpointProgress: ensureCheckpointProgress(registration, eventConfig),
    updatedAt: new Date().toISOString(),
  })
}

export function markCheckpointArrived(
  registrationId: string,
  checkpointId: string,
): Registration[] {
  const registration = getRegistrationById(registrationId)
  const eventConfig = registration ? getEventConfigForRegistration(registration) : undefined

  if (!registration || !eventConfig || registration.executionStatus === 'finished') {
    return getStoredRegistrations()
  }

  const checkpoint = getProjectCheckpoints(eventConfig, registration).find(
    (item) => item.id === checkpointId,
  )
  const registrationWithProgress = {
    ...registration,
    checkpointProgress: ensureCheckpointProgress(registration, eventConfig),
  }

  if (!checkpoint || !canAccessCheckpoint(registrationWithProgress, checkpoint, eventConfig)) {
    return getStoredRegistrations()
  }

  const currentProgress = registrationWithProgress.checkpointProgress.find(
    (item) => item.checkpointId === checkpointId,
  )

  if (!currentProgress || currentProgress.status !== 'not_arrived') {
    return getStoredRegistrations()
  }

  return updateRegistration({
    ...registrationWithProgress,
    checkpointProgress: updateCheckpointProgressItem(
      registrationWithProgress.checkpointProgress,
      checkpointId,
      { status: 'arrived' },
    ),
    auditLogs: [
      createAuditLog('checkpoint_arrived', `到达点位：${checkpoint.name}`, '参赛者'),
      ...registration.auditLogs,
    ],
    updatedAt: new Date().toISOString(),
  })
}

export function submitCheckpointTask(
  registrationId: string,
  checkpointId: string,
  payload: { note?: string; evidenceFileName?: string },
): Registration[] {
  const registration = getRegistrationById(registrationId)
  const eventConfig = registration ? getEventConfigForRegistration(registration) : undefined

  if (!registration || !eventConfig || registration.executionStatus === 'finished') {
    return getStoredRegistrations()
  }

  const checkpoint = getProjectCheckpoints(eventConfig, registration).find(
    (item) => item.id === checkpointId,
  )
  const registrationWithProgress = {
    ...registration,
    checkpointProgress: ensureCheckpointProgress(registration, eventConfig),
  }

  if (!checkpoint || !canSubmitCheckpointTask(registrationWithProgress, checkpointId)) {
    return getStoredRegistrations()
  }

  return updateRegistration({
    ...registrationWithProgress,
    checkpointProgress: updateCheckpointProgressItem(
      registrationWithProgress.checkpointProgress,
      checkpointId,
      {
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        note: payload.note,
        evidenceFileName: payload.evidenceFileName,
      },
    ),
    auditLogs: [
      createAuditLog('checkpoint_submitted', `提交点位任务：${checkpoint.name}`, '参赛者'),
      ...registration.auditLogs,
    ],
    updatedAt: new Date().toISOString(),
  })
}

export function approveCheckpointTask(
  registrationId: string,
  checkpointId: string,
): Registration[] {
  const registration = getRegistrationById(registrationId)
  const eventConfig = registration ? getEventConfigForRegistration(registration) : undefined

  if (!registration || !eventConfig || registration.executionStatus === 'finished') {
    return getStoredRegistrations()
  }

  const checkpoint = getProjectCheckpoints(eventConfig, registration).find(
    (item) => item.id === checkpointId,
  )
  const progress = registration.checkpointProgress.find(
    (item) => item.checkpointId === checkpointId,
  )

  if (!checkpoint || progress?.status !== 'submitted') {
    return getStoredRegistrations()
  }

  return updateRegistration({
    ...registration,
    checkpointProgress: updateCheckpointProgressItem(
      ensureCheckpointProgress(registration, eventConfig),
      checkpointId,
      { status: 'approved' },
    ),
    auditLogs: [
      createAuditLog('checkpoint_approved', `点位任务审核通过：${checkpoint.name}`, '工作人员'),
      ...registration.auditLogs,
    ],
    updatedAt: new Date().toISOString(),
  })
}

export function markRegistrationAttentionNeeded(
  registrationId: string,
  reason: string,
): Registration[] {
  const registration = getRegistrationById(registrationId)

  if (!registration || registration.executionStatus === 'finished') {
    return getStoredRegistrations()
  }

  return updateRegistration({
    ...registration,
    executionStatus: 'attention_needed',
    auditLogs: [
      createAuditLog('attention_needed', reason, '工作人员'),
      ...registration.auditLogs,
    ],
    updatedAt: new Date().toISOString(),
  })
}

export function clearRegistrationAttention(
  registrationId: string,
  reason = '异常关注已解除',
): Registration[] {
  const registration = getRegistrationById(registrationId)

  if (!registration || registration.executionStatus !== 'attention_needed') {
    return getStoredRegistrations()
  }

  return updateRegistration({
    ...registration,
    executionStatus: 'in_progress',
    auditLogs: [
      createAuditLog('attention_resolved', reason, '工作人员'),
      ...registration.auditLogs,
    ],
    updatedAt: new Date().toISOString(),
  })
}

export function markRegistrationFinished(registrationId: string): Registration[] {
  const registration = getRegistrationById(registrationId)
  const eventConfig = registration ? getEventConfigForRegistration(registration) : undefined

  if (!registration || !eventConfig) {
    return getStoredRegistrations()
  }

  const registrationWithProgress = {
    ...registration,
    checkpointProgress: ensureCheckpointProgress(registration, eventConfig),
  }

  if (!areAllRequiredCheckpointsApproved(registrationWithProgress, eventConfig)) {
    return getStoredRegistrations()
  }

  return updateRegistration({
    ...registrationWithProgress,
    executionStatus: 'finished',
    auditLogs: [
      createAuditLog('finished', '所有必需点位已完成，标记完赛', '工作人员'),
      ...registration.auditLogs,
    ],
    updatedAt: new Date().toISOString(),
  })
}

function getEventConfigForRegistration(registration: Registration) {
  return eventTemplates.find((eventConfig) => eventConfig.id === registration.eventId)
}

function updateCheckpointProgressItem(
  checkpointProgress: CheckpointProgress[],
  checkpointId: string,
  nextProgress: Partial<CheckpointProgress>,
): CheckpointProgress[] {
  return checkpointProgress.map((item) =>
    item.checkpointId === checkpointId ? { ...item, ...nextProgress } : item,
  )
}

function createAuditLog(
  action: string,
  reason: string,
  operator = '管理员',
): AuditLog {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    action,
    reason,
    operator,
    createdAt: new Date().toISOString(),
  }
}
