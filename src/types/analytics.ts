import type { AnnouncementSeverity } from './event'
import type { AnnouncementStatus } from './status'

export interface EventReviewSummary {
  eventId: string
  totalRegistrations: number
  draftCount: number
  incompleteCount: number
  pendingReviewCount: number
  rejectedCount: number
  approvedCount: number
  registeredCount: number
  checkedInCount: number
  departedCount: number
  inProgressCount: number
  attentionNeededCount: number
  finishedCount: number
  registrationSuccessRate: number
  reviewPassRate: number
  checkinRate: number
  departureRate: number
  finishRate: number
  attentionRate: number
}

export interface ProjectReviewSummary {
  projectId: string
  projectName: string
  totalRegistrations: number
  registeredCount: number
  checkedInCount: number
  departedCount: number
  finishedCount: number
  attentionNeededCount: number
  checkinRate: number
  finishRate: number
}

export interface CheckpointReviewSummary {
  checkpointId: string
  checkpointName: string
  projectIds: string[]
  arrivedCount: number
  submittedCount: number
  approvedCount: number
  pendingReviewCount: number
  approvalRate: number
}

export interface AnnouncementReviewSummary {
  announcementId: string
  title: string
  severity: AnnouncementSeverity
  status: AnnouncementStatus
  targetTotal: number
  confirmedTotal: number
  unconfirmedTotal: number
  confirmRate: number
}

export interface ReviewFunnelStep {
  key: string
  label: string
  value: number
  rateFromPrevious?: number
}

export interface OperationInsight {
  id: string
  title: string
  description: string
  level: 'positive' | 'warning' | 'neutral'
}

export interface PendingCheckpointTaskSummary {
  checkpointId: string
  checkpointName: string
  pendingReviewCount: number
}
