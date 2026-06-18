import { serviceClient } from './serviceClient'

export async function approveRegistration(registrationId: string) {
  return serviceClient.reviews.approveRegistration(registrationId)
}

export async function rejectRegistration(registrationId: string, reason: string) {
  return serviceClient.reviews.rejectRegistration(registrationId, reason)
}

export async function markRegistrationAsRegistered(registrationId: string) {
  return serviceClient.reviews.markRegistrationAsRegistered(registrationId)
}

export async function getReviewableRegistrations(eventId: string) {
  const registrations = await serviceClient.registrations.getRegistrationsByEventId(eventId)

  return registrations.filter((registration) =>
    ['pending_review', 'incomplete', 'rejected', 'approved', 'registered'].includes(
      registration.status,
    ),
  )
}
