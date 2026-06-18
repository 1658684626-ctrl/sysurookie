import type { Registration } from '../types/registration'
import { canSubmitForReview } from '../utils/statusFlow'
import { serviceClient } from './serviceClient'
import { getEventById } from './eventService'

export async function getRegistrations() {
  return serviceClient.registrations.getRegistrations()
}

export async function getRegistrationsByEventId(eventId: string) {
  return serviceClient.registrations.getRegistrationsByEventId(eventId)
}

export async function getRegistrationById(registrationId: string) {
  return serviceClient.registrations.getRegistrationById(registrationId)
}

export async function createRegistration(input: Registration) {
  return serviceClient.registrations.createRegistration(input)
}

export async function updateRegistration(registration: Registration) {
  return serviceClient.registrations.updateRegistration(registration)
}

export async function deleteRegistration(registrationId: string) {
  return serviceClient.registrations.deleteRegistration(registrationId)
}

export async function resetRegistrations() {
  return serviceClient.registrations.resetRegistrations()
}

export async function submitRegistrationForReview(registrationId: string) {
  const registration = await getRegistrationById(registrationId)

  if (!registration) {
    return getRegistrations()
  }

  const eventConfig = await getEventById(registration.eventId)
  const nextStatus =
    eventConfig && canSubmitForReview(registration, eventConfig)
      ? 'pending_review'
      : 'incomplete'
  const updatedRegistration: Registration = {
    ...registration,
    status: nextStatus,
    auditLogs:
      nextStatus === 'pending_review'
        ? [
            {
              id: `audit-${Date.now()}`,
              action: '提交审核',
              operator: '参赛者',
              createdAt: new Date().toISOString(),
            },
            ...registration.auditLogs,
          ]
        : registration.auditLogs,
    updatedAt: new Date().toISOString(),
  }

  return updateRegistration(updatedRegistration)
}
