import type { AnnouncementSeverity } from './event'
import type { AnnouncementStatus, RegistrationStatus } from './status'

export type AnnouncementTargetScope = 'all' | 'projects' | 'statuses'

export interface Announcement {
  id: string
  eventId: string
  typeId: string
  title: string
  content: string
  severity: AnnouncementSeverity
  targetScope: AnnouncementTargetScope
  targetProjectIds?: string[]
  targetRegistrationStatuses?: RegistrationStatus[]
  status: AnnouncementStatus
  confirmations: AnnouncementConfirmation[]
  createdBy: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface AnnouncementConfirmation {
  registrationId: string
  confirmedAt: string
  confirmedBy: string
  note?: string
}

export interface AnnouncementDraftInput {
  eventId: string
  typeId: string
  title: string
  content: string
  severity: AnnouncementSeverity
  targetScope: AnnouncementTargetScope
  targetProjectIds?: string[]
  targetRegistrationStatuses?: RegistrationStatus[]
}
