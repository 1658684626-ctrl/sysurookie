import type { RegistrationMode } from './event'
import type {
  CheckinStatus,
  CheckpointStatus,
  EventExecutionStatus,
  RegistrationStatus,
} from './status'

export interface Registration {
  id: string
  eventId: string
  projectId: string
  mode: RegistrationMode
  teamName?: string
  captainName?: string
  captainPhone?: string
  members: Member[]
  status: RegistrationStatus
  checkinStatus: CheckinStatus
  executionStatus: EventExecutionStatus
  checkpointProgress: CheckpointProgress[]
  announcementsConfirmed: string[]
  auditLogs: AuditLog[]
  createdAt: string
  updatedAt: string
}

export interface Member {
  id: string
  name: string
  phone: string
  roleType: string
  formData: Record<string, unknown>
  materials: MemberMaterial[]
}

export interface MemberMaterial {
  ruleId: string
  fileName?: string
  status: 'missing' | 'uploaded' | 'approved' | 'rejected'
  rejectReason?: string
}

export interface AuditLog {
  id: string
  action: string
  reason?: string
  operator: string
  createdAt: string
}

export interface CheckpointProgress {
  checkpointId: string
  status: CheckpointStatus
  submittedAt?: string
  note?: string
  evidenceFileName?: string
}
