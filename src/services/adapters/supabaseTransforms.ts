import type { Announcement, AnnouncementDraftInput } from '../../types/announcement'
import type { CheckpointConfig, EventConfig, ProjectConfig } from '../../types/event'
import type { AuditLog, CheckpointProgress, Member, Registration } from '../../types/registration'

export interface SupabaseEventRow {
  id: string
  name: string
  short_name?: string | null
  date?: string | null
  location?: string | null
  organizer?: string | null
  registration_mode: EventConfig['registrationMode']
  checkin_mode: EventConfig['checkinMode']
  status?: string | null
  config?: Record<string, unknown> | null
  event_projects?: SupabaseProjectRow[] | null
  event_checkpoints?: SupabaseCheckpointRow[] | null
}

export interface SupabaseProjectRow {
  id: string
  event_id: string
  name: string
  description?: string | null
  min_members?: number | null
  max_members?: number | null
  target_audience?: string | null
  config?: Record<string, unknown> | null
}

export interface SupabaseRegistrationRow {
  id: string
  event_id: string
  project_id: string
  mode: Registration['mode']
  team_name?: string | null
  captain_name?: string | null
  captain_phone?: string | null
  status: Registration['status']
  checkin_status: Registration['checkinStatus']
  execution_status: Registration['executionStatus']
  form_data?: Record<string, unknown> | null
  created_at?: string | null
  updated_at?: string | null
  registration_members?: SupabaseMemberRow[] | null
  audit_logs?: SupabaseAuditLogRow[] | null
  checkpoint_progress?: SupabaseCheckpointProgressRow[] | null
}

export interface SupabaseMemberRow {
  id: string
  registration_id: string
  name: string
  phone?: string | null
  role_type?: string | null
  form_data?: Record<string, unknown> | null
  created_at?: string | null
  updated_at?: string | null
}

export interface SupabaseAuditLogRow {
  id: string
  registration_id: string
  action: string
  operator?: string | null
  reason?: string | null
  metadata?: Record<string, unknown> | null
  created_at?: string | null
}

export interface SupabaseCheckpointRow {
  id: string
  event_id: string
  name: string
  description?: string | null
  display_order?: number | null
  task_type: CheckpointConfig['taskType']
  required?: boolean | null
  config?: Record<string, unknown> | null
}

export interface SupabaseCheckpointProgressRow {
  id?: string
  registration_id: string
  checkpoint_id: string
  status: CheckpointProgress['status']
  submitted_at?: string | null
  note?: string | null
  evidence_file_name?: string | null
}

export interface SupabaseAnnouncementRow {
  id: string
  event_id: string
  type_id: string
  title: string
  content: string
  severity: Announcement['severity']
  target_scope: Announcement['targetScope']
  target_filters?: {
    targetProjectIds?: string[]
    targetRegistrationStatuses?: Announcement['targetRegistrationStatuses']
  } | null
  status: Announcement['status']
  created_by?: string | null
  created_at?: string | null
  updated_at?: string | null
  published_at?: string | null
  announcement_confirmations?: SupabaseAnnouncementConfirmationRow[] | null
}

export interface SupabaseAnnouncementConfirmationRow {
  announcement_id: string
  registration_id: string
  confirmed_at: string
  confirmed_by?: string | null
  note?: string | null
}

function stringArray(value: unknown): string[] | undefined {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
    ? value
    : undefined
}

export function mapProjectRow(row: SupabaseProjectRow): ProjectConfig {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    minMembers: row.min_members ?? 1,
    maxMembers: row.max_members ?? 1,
    targetAudience: row.target_audience ?? '全部人群',
    checkpoints: stringArray(row.config?.checkpoints),
  }
}

export function mapCheckpointRow(row: SupabaseCheckpointRow): CheckpointConfig {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    order: row.display_order ?? 0,
    taskType: row.task_type,
    required: row.required ?? true,
  }
}

export function mapEventRow(row: SupabaseEventRow): EventConfig {
  const config = row.config ?? {}

  const relationalCheckpoints = (row.event_checkpoints ?? []).map(mapCheckpointRow)

  return {
    id: row.id,
    name: row.name,
    shortName: row.short_name ?? row.name,
    date: row.date ?? '',
    location: row.location ?? '',
    organizer: row.organizer ?? '',
    registrationMode: row.registration_mode,
    checkinMode: row.checkin_mode,
    projects: (row.event_projects ?? []).map(mapProjectRow),
    memberFields: Array.isArray(config.memberFields) ? config.memberFields : [],
    materialRules: Array.isArray(config.materialRules) ? config.materialRules : [],
    checkpoints: relationalCheckpoints.length > 0
      ? relationalCheckpoints
      : Array.isArray(config.checkpoints) ? config.checkpoints : [],
    announcementTypes: Array.isArray(config.announcementTypes)
      ? config.announcementTypes
      : [],
  } as EventConfig
}

export function mapMemberRow(row: SupabaseMemberRow): Member {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? '',
    roleType: row.role_type ?? '参赛者',
    formData: row.form_data ?? {},
    materials: [],
  }
}

export function mapAuditLogRow(row: SupabaseAuditLogRow): AuditLog {
  return {
    id: row.id,
    action: row.action,
    operator: row.operator ?? '系统',
    reason: row.reason ?? undefined,
    createdAt: row.created_at ?? new Date().toISOString(),
  }
}

export function mapCheckpointProgressRow(
  row: SupabaseCheckpointProgressRow,
): CheckpointProgress {
  return {
    checkpointId: row.checkpoint_id,
    status: row.status,
    submittedAt: row.submitted_at ?? undefined,
    note: row.note ?? undefined,
    evidenceFileName: row.evidence_file_name ?? undefined,
  }
}

export function mapRegistrationRow(row: SupabaseRegistrationRow): Registration {
  return {
    id: row.id,
    eventId: row.event_id,
    projectId: row.project_id,
    mode: row.mode,
    teamName: row.team_name ?? undefined,
    captainName: row.captain_name ?? undefined,
    captainPhone: row.captain_phone ?? undefined,
    members: (row.registration_members ?? []).map(mapMemberRow),
    status: row.status,
    checkinStatus: row.checkin_status,
    executionStatus: row.execution_status,
    checkpointProgress: (row.checkpoint_progress ?? []).map(mapCheckpointProgressRow),
    announcementsConfirmed: [],
    auditLogs: (row.audit_logs ?? []).map(mapAuditLogRow),
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? row.created_at ?? new Date().toISOString(),
  }
}

export function registrationToRow(registration: Registration, userId?: string) {
  return {
    id: registration.id,
    event_id: registration.eventId,
    project_id: registration.projectId,
    created_by: userId,
    mode: registration.mode,
    team_name: registration.teamName ?? null,
    captain_name: registration.captainName ?? null,
    captain_phone: registration.captainPhone ?? null,
    status: registration.status,
    checkin_status: registration.checkinStatus,
    execution_status: registration.executionStatus,
    form_data: {},
    updated_at: new Date().toISOString(),
  }
}

export function memberToRow(member: Member, registrationId: string) {
  return {
    id: member.id,
    registration_id: registrationId,
    name: member.name || '未填写姓名',
    phone: member.phone || null,
    role_type: member.roleType,
    form_data: member.formData,
    updated_at: new Date().toISOString(),
  }
}

export function auditLogToRow(auditLog: AuditLog, registrationId: string) {
  return {
    id: auditLog.id,
    registration_id: registrationId,
    action: auditLog.action,
    operator: auditLog.operator,
    reason: auditLog.reason ?? null,
    metadata: {},
    created_at: auditLog.createdAt,
  }
}

export function checkpointProgressToRow(
  registrationId: string,
  checkpoint: CheckpointProgress,
) {
  return {
    registration_id: registrationId,
    checkpoint_id: checkpoint.checkpointId,
    status: checkpoint.status,
    submitted_at: checkpoint.submittedAt ?? null,
    note: checkpoint.note ?? null,
    evidence_file_name: checkpoint.evidenceFileName ?? null,
    updated_at: new Date().toISOString(),
  }
}

export function mapAnnouncementRow(row: SupabaseAnnouncementRow): Announcement {
  return {
    id: row.id,
    eventId: row.event_id,
    typeId: row.type_id,
    title: row.title,
    content: row.content,
    severity: row.severity,
    targetScope: row.target_scope,
    targetProjectIds: row.target_filters?.targetProjectIds,
    targetRegistrationStatuses: row.target_filters?.targetRegistrationStatuses,
    status: row.status,
    confirmations: (row.announcement_confirmations ?? []).map((confirmation) => ({
      registrationId: confirmation.registration_id,
      confirmedAt: confirmation.confirmed_at,
      confirmedBy: confirmation.confirmed_by ?? '参赛者',
      note: confirmation.note ?? undefined,
    })),
    createdBy: row.created_by ?? '系统',
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? row.created_at ?? new Date().toISOString(),
    publishedAt: row.published_at ?? undefined,
  }
}

export function announcementInputToRow(
  input: AnnouncementDraftInput,
  userId?: string,
) {
  return {
    event_id: input.eventId,
    type_id: input.typeId,
    title: input.title,
    content: input.content,
    severity: input.severity,
    target_scope: input.targetScope,
    target_filters: {
      targetProjectIds: input.targetProjectIds,
      targetRegistrationStatuses: input.targetRegistrationStatuses,
    },
    status: 'draft',
    created_by: userId ?? null,
    updated_at: new Date().toISOString(),
  }
}
