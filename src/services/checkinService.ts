import type { Registration } from '../types/registration'
import {
  findRegistrationByCheckinCode as findByCode,
  getCheckinCode,
  getCheckinEligibleRegistrations as filterCheckinEligibleRegistrations,
  getCheckinSummaryByEvent,
} from '../utils/checkin'
import { serviceClient } from './serviceClient'

export { getCheckinCode }

export function findRegistrationByCheckinCode(
  code: string,
  registrations: Registration[],
) {
  return findByCode(code, registrations)
}

export async function getCheckinEligibleRegistrations(eventId: string) {
  const registrations = await serviceClient.registrations.getRegistrations()

  return filterCheckinEligibleRegistrations(registrations, eventId)
}

export async function checkInRegistration(registrationId: string) {
  return serviceClient.checkin.checkInRegistration(registrationId)
}

export async function markRegistrationDeparted(registrationId: string) {
  return serviceClient.checkin.markRegistrationDeparted(registrationId)
}

export async function getCheckinSummary(eventId: string) {
  const registrations = await serviceClient.registrations.getRegistrations()

  return getCheckinSummaryByEvent(registrations, eventId)
}
