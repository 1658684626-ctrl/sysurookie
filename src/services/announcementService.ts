import type { Announcement, AnnouncementDraftInput } from '../types/announcement'
import type { Registration } from '../types/registration'
import {
  getAnnouncementSummary,
  getAnnouncementsForRegistration as filterAnnouncementsForRegistration,
} from '../utils/announcements'
import { serviceClient } from './serviceClient'

export async function getAnnouncements() {
  return serviceClient.announcements.getAnnouncements()
}

export async function getAnnouncementsByEventId(eventId: string) {
  return serviceClient.announcements.getAnnouncementsByEventId(eventId)
}

export async function createAnnouncement(input: AnnouncementDraftInput) {
  return serviceClient.announcements.createAnnouncement(input)
}

export async function publishAnnouncement(announcementId: string) {
  return serviceClient.announcements.publishAnnouncement(announcementId)
}

export async function deleteDraftAnnouncement(announcementId: string) {
  return serviceClient.announcements.deleteDraftAnnouncement(announcementId)
}

export async function confirmAnnouncementRead(
  announcementId: string,
  registrationId: string,
  confirmedBy?: string,
) {
  return serviceClient.announcements.confirmAnnouncementRead(
    announcementId,
    registrationId,
    confirmedBy,
  )
}

export async function getAnnouncementsForRegistration(registration: Registration) {
  const announcements = await getAnnouncements()

  return filterAnnouncementsForRegistration(announcements, registration)
}

export function getAnnouncementsForRegistrationFromList(
  announcements: Announcement[],
  registration: Registration,
) {
  return filterAnnouncementsForRegistration(announcements, registration)
}

export { getAnnouncementSummary }
