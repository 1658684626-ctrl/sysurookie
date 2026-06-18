import type { EventConfig } from '../types/event'
import {
  getAnnouncementReviewSummaries as buildAnnouncementReviewSummaries,
  getCheckpointReviewSummaries as buildCheckpointReviewSummaries,
  getEventReviewSummary as buildEventReviewSummary,
  getOperationInsights as buildOperationInsights,
  getProjectReviewSummaries as buildProjectReviewSummaries,
  getReviewFunnel as buildReviewFunnel,
} from '../utils/analytics'
import { serviceClient } from './serviceClient'

export async function getEventReviewSummary(eventConfig: EventConfig) {
  const registrations = await serviceClient.registrations.getRegistrations()

  return buildEventReviewSummary(eventConfig, registrations)
}

export async function getReviewFunnel(eventConfig: EventConfig) {
  const registrations = await serviceClient.registrations.getRegistrations()

  return buildReviewFunnel(eventConfig, registrations)
}

export async function getProjectReviewSummaries(eventConfig: EventConfig) {
  const registrations = await serviceClient.registrations.getRegistrations()

  return buildProjectReviewSummaries(eventConfig, registrations)
}

export async function getCheckpointReviewSummaries(eventConfig: EventConfig) {
  const registrations = await serviceClient.registrations.getRegistrations()

  return buildCheckpointReviewSummaries(eventConfig, registrations)
}

export async function getAnnouncementReviewSummaries(eventConfig: EventConfig) {
  const [announcements, registrations] = await Promise.all([
    serviceClient.announcements.getAnnouncements(),
    serviceClient.registrations.getRegistrations(),
  ])

  return buildAnnouncementReviewSummaries(eventConfig, announcements, registrations)
}

export async function getOperationInsights(eventConfig: EventConfig) {
  const [announcements, registrations] = await Promise.all([
    serviceClient.announcements.getAnnouncements(),
    serviceClient.registrations.getRegistrations(),
  ])

  return buildOperationInsights(eventConfig, registrations, announcements)
}
