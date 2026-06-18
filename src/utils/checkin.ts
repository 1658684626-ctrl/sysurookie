import type { Registration } from '../types/registration'

export interface CheckinSummary {
  registeredCount: number
  notCheckedInCount: number
  checkedInCount: number
  departedCount: number
  inProgressCount: number
}

export function getCheckinCode(registration: Registration): string {
  return `EE-${registration.id}`
}

export function normalizeCheckinCode(code: string): string {
  return code.trim().toLowerCase()
}

export function findRegistrationByCheckinCode(
  code: string,
  registrations: Registration[],
): Registration | undefined {
  const normalizedCode = normalizeCheckinCode(code)

  if (!normalizedCode) {
    return undefined
  }

  return registrations.find((registration) => {
    const registrationId = registration.id.toLowerCase()
    const checkinCode = getCheckinCode(registration).toLowerCase()

    return normalizedCode === registrationId || normalizedCode === checkinCode
  })
}

export function getCheckinEligibleRegistrations(
  registrations: Registration[],
  eventId: string,
): Registration[] {
  return registrations.filter(
    (registration) =>
      registration.eventId === eventId && registration.status === 'registered',
  )
}

export function getCheckinSummaryByEvent(
  registrations: Registration[],
  eventId: string,
): CheckinSummary {
  const eligibleRegistrations = getCheckinEligibleRegistrations(registrations, eventId)

  return {
    registeredCount: eligibleRegistrations.length,
    notCheckedInCount: eligibleRegistrations.filter(
      (registration) => registration.checkinStatus === 'not_checked_in',
    ).length,
    checkedInCount: eligibleRegistrations.filter(
      (registration) => registration.checkinStatus === 'checked_in',
    ).length,
    departedCount: eligibleRegistrations.filter(
      (registration) => registration.checkinStatus === 'departed',
    ).length,
    inProgressCount: eligibleRegistrations.filter(
      (registration) => registration.executionStatus === 'in_progress',
    ).length,
  }
}
