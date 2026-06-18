import type { Announcement, AnnouncementDraftInput } from '../../types/announcement'
import type { AuditLog, Registration } from '../../types/registration'
import type { EventConfig } from '../../types/event'
import type { DemoScenarioSummary } from '../../utils/demo'

export interface CheckpointTaskPayload {
  note?: string
  evidenceFileName?: string
}

export interface EventRepository {
  getEventTemplates(): Promise<EventConfig[]>
  getCurrentEventId(): Promise<string>
  setCurrentEventId(eventId: string): Promise<void>
}

export interface RegistrationRepository {
  getRegistrations(): Promise<Registration[]>
  getRegistrationsByEventId(eventId: string): Promise<Registration[]>
  getRegistrationById(registrationId: string): Promise<Registration | undefined>
  createRegistration(input: Registration): Promise<Registration[]>
  updateRegistration(registration: Registration): Promise<Registration[]>
  deleteRegistration(registrationId: string): Promise<Registration[]>
  resetRegistrations(): Promise<Registration[]>
}

export interface ReviewRepository {
  approveRegistration(registrationId: string): Promise<Registration[]>
  rejectRegistration(registrationId: string, reason: string): Promise<Registration[]>
  markRegistrationAsRegistered(registrationId: string): Promise<Registration[]>
  appendAuditLog(registrationId: string, auditLog: AuditLog): Promise<Registration[]>
}

export interface CheckinRepository {
  checkInRegistration(registrationId: string): Promise<Registration[]>
  markRegistrationDeparted(registrationId: string): Promise<Registration[]>
}

export interface CheckpointRepository {
  initializeCheckpointProgress(registrationId: string): Promise<Registration[]>
  markCheckpointArrived(registrationId: string, checkpointId: string): Promise<Registration[]>
  submitCheckpointTask(
    registrationId: string,
    checkpointId: string,
    payload: CheckpointTaskPayload,
  ): Promise<Registration[]>
  approveCheckpointTask(registrationId: string, checkpointId: string): Promise<Registration[]>
  markRegistrationAttentionNeeded(registrationId: string, reason: string): Promise<Registration[]>
  clearRegistrationAttention(registrationId: string, reason?: string): Promise<Registration[]>
  markRegistrationFinished(registrationId: string): Promise<Registration[]>
}

export interface AnnouncementRepository {
  getAnnouncements(): Promise<Announcement[]>
  getAnnouncementsByEventId(eventId: string): Promise<Announcement[]>
  createAnnouncement(input: AnnouncementDraftInput): Promise<Announcement[]>
  updateAnnouncement(
    announcementId: string,
    patch: Partial<AnnouncementDraftInput>,
  ): Promise<Announcement[]>
  publishAnnouncement(announcementId: string): Promise<Announcement[]>
  deleteDraftAnnouncement(announcementId: string): Promise<Announcement[]>
  confirmAnnouncementRead(
    announcementId: string,
    registrationId: string,
    confirmedBy?: string,
  ): Promise<Announcement[]>
  resetAnnouncements(): Promise<Announcement[]>
}

export interface DemoRepository {
  resetAllDemoData(): Promise<DemoScenarioSummary>
  seedCompleteDemoScenario(): Promise<DemoScenarioSummary>
  getDemoScenarioSummary(): Promise<DemoScenarioSummary>
}

export interface RepositoryClient {
  events: EventRepository
  registrations: RegistrationRepository
  reviews: ReviewRepository
  checkin: CheckinRepository
  checkpoints: CheckpointRepository
  announcements: AnnouncementRepository
  demo: DemoRepository
}
