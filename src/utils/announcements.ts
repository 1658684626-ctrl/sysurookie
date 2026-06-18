import type { AnnouncementSeverity, EventConfig } from '../types/event'
import type { Announcement } from '../types/announcement'
import type { Registration } from '../types/registration'
import type { AnnouncementStatus } from '../types/status'

export interface AnnouncementSummary {
  targetTotal: number
  confirmedTotal: number
  unconfirmedTotal: number
  confirmRate: number
  status: AnnouncementStatus
}

export function getAnnouncementTypeLabel(
  eventConfig: EventConfig,
  typeId: string,
): string {
  return (
    eventConfig.announcementTypes.find((type) => type.id === typeId)?.name ?? '未知类型'
  )
}

export function getAnnouncementSeverityLabel(
  severity: AnnouncementSeverity,
): string {
  const labels: Record<AnnouncementSeverity, string> = {
    info: '普通通知',
    warning: '重要提醒',
    urgent: '紧急通知',
  }

  return labels[severity]
}

export function getAnnouncementStatusLabel(status: AnnouncementStatus): string {
  const labels: Record<AnnouncementStatus, string> = {
    draft: '草稿',
    published: '已发布',
    partially_confirmed: '部分确认',
    confirmed: '全部确认',
  }

  return labels[status]
}

export function getAnnouncementTargetScopeLabel(
  targetScope: Announcement['targetScope'],
): string {
  const labels: Record<Announcement['targetScope'], string> = {
    all: '全部报名',
    projects: '指定项目 / 路线',
    statuses: '指定报名状态',
  }

  return labels[targetScope]
}

export function getTargetRegistrations(
  announcement: Announcement,
  registrations: Registration[],
): Registration[] {
  return registrations.filter((registration) =>
    isAnnouncementRelevantToRegistration(announcement, registration),
  )
}

export function isAnnouncementRelevantToRegistration(
  announcement: Announcement,
  registration: Registration,
): boolean {
  if (registration.eventId !== announcement.eventId) {
    return false
  }

  if (announcement.targetScope === 'projects') {
    return Boolean(announcement.targetProjectIds?.includes(registration.projectId))
  }

  if (announcement.targetScope === 'statuses') {
    return Boolean(
      announcement.targetRegistrationStatuses?.includes(registration.status),
    )
  }

  return true
}

export function isAnnouncementConfirmedByRegistration(
  announcement: Announcement,
  registrationId: string,
): boolean {
  return announcement.confirmations.some(
    (confirmation) => confirmation.registrationId === registrationId,
  )
}

export function getAnnouncementSummary(
  announcement: Announcement,
  registrations: Registration[],
): AnnouncementSummary {
  const targetRegistrations = getTargetRegistrations(announcement, registrations)
  const targetIds = new Set(
    targetRegistrations.map((registration) => registration.id),
  )
  const confirmedTotal = announcement.confirmations.filter((confirmation) =>
    targetIds.has(confirmation.registrationId),
  ).length
  const targetTotal = targetRegistrations.length
  const status = getComputedAnnouncementStatus(
    announcement.status,
    targetTotal,
    confirmedTotal,
  )

  return {
    targetTotal,
    confirmedTotal,
    unconfirmedTotal: Math.max(0, targetTotal - confirmedTotal),
    confirmRate: targetTotal === 0 ? 0 : Math.round((confirmedTotal / targetTotal) * 100),
    status,
  }
}

export function getAnnouncementsForRegistration(
  announcements: Announcement[],
  registration: Registration,
): Announcement[] {
  return announcements
    .filter(
      (announcement) =>
        announcement.status !== 'draft' &&
        isAnnouncementRelevantToRegistration(announcement, registration),
    )
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? b.createdAt).getTime() -
        new Date(a.publishedAt ?? a.createdAt).getTime(),
    )
}

export function getUnconfirmedAnnouncementsForRegistration(
  announcements: Announcement[],
  registration: Registration,
): Announcement[] {
  return getAnnouncementsForRegistration(announcements, registration).filter(
    (announcement) =>
      !isAnnouncementConfirmedByRegistration(announcement, registration.id),
  )
}

export function getComputedAnnouncementStatus(
  currentStatus: AnnouncementStatus,
  targetTotal: number,
  confirmedTotal: number,
): AnnouncementStatus {
  if (currentStatus === 'draft') {
    return 'draft'
  }

  if (targetTotal === 0 || confirmedTotal === 0) {
    return 'published'
  }

  if (confirmedTotal < targetTotal) {
    return 'partially_confirmed'
  }

  return 'confirmed'
}
