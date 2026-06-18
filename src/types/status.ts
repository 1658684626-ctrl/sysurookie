export type RegistrationStatus =
  | 'draft'
  | 'incomplete'
  | 'pending_review'
  | 'rejected'
  | 'approved'
  | 'registered'

export type CheckinStatus = 'not_checked_in' | 'checked_in' | 'departed'

export type EventExecutionStatus =
  | 'not_started'
  | 'in_progress'
  | 'attention_needed'
  | 'finished'

export type CheckpointStatus =
  | 'not_arrived'
  | 'arrived'
  | 'submitted'
  | 'approved'

export type AnnouncementStatus =
  | 'draft'
  | 'published'
  | 'partially_confirmed'
  | 'confirmed'
