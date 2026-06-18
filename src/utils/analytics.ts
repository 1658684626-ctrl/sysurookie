import type { Announcement } from '../types/announcement'
import type { EventConfig } from '../types/event'
import type { Registration } from '../types/registration'
import type {
  AnnouncementReviewSummary,
  CheckpointReviewSummary,
  EventReviewSummary,
  OperationInsight,
  PendingCheckpointTaskSummary,
  ProjectReviewSummary,
  ReviewFunnelStep,
} from '../types/analytics'
import { getAnnouncementSummary } from './announcements'
import {
  ensureCheckpointProgress,
  getProjectCheckpoints,
} from './checkpoints'

export function safePercent(numerator: number, denominator: number): number {
  if (denominator === 0) {
    return 0
  }

  return Math.round((numerator / denominator) * 1000) / 10
}

export function getEventReviewSummary(
  eventConfig: EventConfig,
  registrations: Registration[],
): EventReviewSummary {
  const eventRegistrations = getEventRegistrations(eventConfig, registrations)
  const totalRegistrations = eventRegistrations.length
  const draftCount = countBy(eventRegistrations, (item) => item.status === 'draft')
  const incompleteCount = countBy(eventRegistrations, (item) => item.status === 'incomplete')
  const pendingReviewCount = countBy(
    eventRegistrations,
    (item) => item.status === 'pending_review',
  )
  const rejectedCount = countBy(eventRegistrations, (item) => item.status === 'rejected')
  const approvedCount = countBy(eventRegistrations, (item) => item.status === 'approved')
  const registeredCount = countBy(eventRegistrations, (item) => item.status === 'registered')
  const checkedInCount = countBy(eventRegistrations, (item) =>
    ['checked_in', 'departed'].includes(item.checkinStatus),
  )
  const departedCount = countBy(eventRegistrations, (item) => item.checkinStatus === 'departed')
  const inProgressCount = countBy(
    eventRegistrations,
    (item) => item.executionStatus === 'in_progress',
  )
  const attentionNeededCount = countBy(
    eventRegistrations,
    (item) => item.executionStatus === 'attention_needed',
  )
  const finishedCount = countBy(
    eventRegistrations,
    (item) => item.executionStatus === 'finished',
  )
  const reviewedCount =
    pendingReviewCount + approvedCount + registeredCount + rejectedCount

  return {
    eventId: eventConfig.id,
    totalRegistrations,
    draftCount,
    incompleteCount,
    pendingReviewCount,
    rejectedCount,
    approvedCount,
    registeredCount,
    checkedInCount,
    departedCount,
    inProgressCount,
    attentionNeededCount,
    finishedCount,
    registrationSuccessRate: safePercent(registeredCount, totalRegistrations),
    reviewPassRate: safePercent(approvedCount + registeredCount, reviewedCount),
    checkinRate: safePercent(checkedInCount, registeredCount),
    departureRate: safePercent(departedCount, registeredCount),
    finishRate: safePercent(finishedCount, registeredCount),
    attentionRate: safePercent(attentionNeededCount, registeredCount),
  }
}

export function getReviewFunnel(
  eventConfig: EventConfig,
  registrations: Registration[],
): ReviewFunnelStep[] {
  const summary = getEventReviewSummary(eventConfig, registrations)
  const steps: Array<Omit<ReviewFunnelStep, 'rateFromPrevious'>> = [
    { key: 'total', label: '总报名', value: summary.totalRegistrations },
    { key: 'pending_review', label: '待审核', value: summary.pendingReviewCount },
    {
      key: 'approved',
      label: '审核通过',
      value: summary.approvedCount + summary.registeredCount,
    },
    { key: 'registered', label: '正式报名', value: summary.registeredCount },
    { key: 'checked_in', label: '已签到', value: summary.checkedInCount },
    { key: 'departed', label: '已出发', value: summary.departedCount },
    { key: 'finished', label: '已完赛', value: summary.finishedCount },
  ]

  return steps.map((step, index) => {
    const previousValue = index === 0 ? step.value : steps[index - 1].value

    return {
      ...step,
      rateFromPrevious: index === 0 ? 100 : safePercent(step.value, previousValue),
    }
  })
}

export function getProjectReviewSummaries(
  eventConfig: EventConfig,
  registrations: Registration[],
): ProjectReviewSummary[] {
  const eventRegistrations = getEventRegistrations(eventConfig, registrations)

  return eventConfig.projects.map((project) => {
    const projectRegistrations = eventRegistrations.filter(
      (registration) => registration.projectId === project.id,
    )
    const registeredCount = countBy(
      projectRegistrations,
      (registration) => registration.status === 'registered',
    )
    const checkedInCount = countBy(projectRegistrations, (registration) =>
      ['checked_in', 'departed'].includes(registration.checkinStatus),
    )
    const departedCount = countBy(
      projectRegistrations,
      (registration) => registration.checkinStatus === 'departed',
    )
    const finishedCount = countBy(
      projectRegistrations,
      (registration) => registration.executionStatus === 'finished',
    )
    const attentionNeededCount = countBy(
      projectRegistrations,
      (registration) => registration.executionStatus === 'attention_needed',
    )

    return {
      projectId: project.id,
      projectName: project.name,
      totalRegistrations: projectRegistrations.length,
      registeredCount,
      checkedInCount,
      departedCount,
      finishedCount,
      attentionNeededCount,
      checkinRate: safePercent(checkedInCount, registeredCount),
      finishRate: safePercent(finishedCount, registeredCount),
    }
  })
}

export function getCheckpointReviewSummaries(
  eventConfig: EventConfig,
  registrations: Registration[],
): CheckpointReviewSummary[] {
  const eventRegistrations = getEventRegistrations(eventConfig, registrations)

  return eventConfig.checkpoints.map((checkpoint) => {
    const projectIds = eventConfig.projects
      .filter((project) =>
        project.checkpoints?.length ? project.checkpoints.includes(checkpoint.id) : true,
      )
      .map((project) => project.id)
    const progressItems = eventRegistrations.flatMap((registration) => {
      const appliesToRegistration = getProjectCheckpoints(eventConfig, registration).some(
        (item) => item.id === checkpoint.id,
      )

      if (!appliesToRegistration) {
        return []
      }

      return ensureCheckpointProgress(registration, eventConfig).filter(
        (progress) => progress.checkpointId === checkpoint.id,
      )
    })
    const arrivedCount = countBy(progressItems, (item) =>
      ['arrived', 'submitted', 'approved'].includes(item.status),
    )
    const submittedCount = countBy(progressItems, (item) =>
      ['submitted', 'approved'].includes(item.status),
    )
    const approvedCount = countBy(progressItems, (item) => item.status === 'approved')
    const pendingReviewCount = countBy(progressItems, (item) => item.status === 'submitted')

    return {
      checkpointId: checkpoint.id,
      checkpointName: checkpoint.name,
      projectIds,
      arrivedCount,
      submittedCount,
      approvedCount,
      pendingReviewCount,
      approvalRate: safePercent(approvedCount, submittedCount),
    }
  })
}

export function getAnnouncementReviewSummaries(
  eventConfig: EventConfig,
  announcements: Announcement[],
  registrations: Registration[],
): AnnouncementReviewSummary[] {
  const eventRegistrations = getEventRegistrations(eventConfig, registrations)

  return announcements
    .filter((announcement) => announcement.eventId === eventConfig.id)
    .map((announcement) => {
      const summary = getAnnouncementSummary(announcement, eventRegistrations)

      return {
        announcementId: announcement.id,
        title: announcement.title,
        severity: announcement.severity,
        status: summary.status,
        targetTotal: summary.targetTotal,
        confirmedTotal: summary.confirmedTotal,
        unconfirmedTotal: summary.unconfirmedTotal,
        confirmRate: summary.confirmRate,
      }
    })
}

export function getTopPendingCheckpointTasks(
  eventConfig: EventConfig,
  registrations: Registration[],
  limit: number,
): PendingCheckpointTaskSummary[] {
  return getCheckpointReviewSummaries(eventConfig, registrations)
    .filter((checkpoint) => checkpoint.pendingReviewCount > 0)
    .sort((a, b) => b.pendingReviewCount - a.pendingReviewCount)
    .slice(0, limit)
    .map((checkpoint) => ({
      checkpointId: checkpoint.checkpointId,
      checkpointName: checkpoint.checkpointName,
      pendingReviewCount: checkpoint.pendingReviewCount,
    }))
}

export function getUnconfirmedUrgentAnnouncements(
  eventConfig: EventConfig,
  announcements: Announcement[],
  registrations: Registration[],
): AnnouncementReviewSummary[] {
  return getAnnouncementReviewSummaries(eventConfig, announcements, registrations).filter(
    (announcement) =>
      announcement.severity === 'urgent' && announcement.unconfirmedTotal > 0,
  )
}

export function getOperationInsights(
  eventConfig: EventConfig,
  registrations: Registration[],
  announcements: Announcement[],
): OperationInsight[] {
  const summary = getEventReviewSummary(eventConfig, registrations)
  const projectSummaries = getProjectReviewSummaries(eventConfig, registrations)
  const pendingCheckpoints = getTopPendingCheckpointTasks(eventConfig, registrations, 1)
  const urgentAnnouncements = getUnconfirmedUrgentAnnouncements(
    eventConfig,
    announcements,
    registrations,
  )
  const insights: OperationInsight[] = []

  insights.push({
    id: 'checkin-rate',
    title: summary.checkinRate >= 80 ? '现场检录转化较好' : '签到率仍有提升空间',
    description:
      summary.checkinRate >= 80
        ? `当前签到率为 ${summary.checkinRate}%，报名成功对象大多已完成现场检录。`
        : `当前签到率为 ${summary.checkinRate}%，可继续优化检录指引和现场入口动线。`,
    level: summary.checkinRate >= 80 ? 'positive' : 'warning',
  })

  if (summary.attentionNeededCount > 0) {
    insights.push({
      id: 'attention-needed',
      title: '仍有异常关注对象',
      description: `当前有 ${summary.attentionNeededCount} 条报名处于异常关注状态，建议工作人员优先跟进。`,
      level: 'warning',
    })
  }

  const lowFinishProject = projectSummaries
    .filter((project) => project.registeredCount > 0)
    .sort((a, b) => a.finishRate - b.finishRate)[0]

  if (lowFinishProject && lowFinishProject.finishRate < summary.finishRate) {
    insights.push({
      id: 'project-finish-rate',
      title: '部分项目完赛率偏低',
      description: `${lowFinishProject.projectName} 完赛率为 ${lowFinishProject.finishRate}%，低于当前赛事整体完赛率 ${summary.finishRate}%。`,
      level: 'warning',
    })
  }

  if (pendingCheckpoints[0]) {
    insights.push({
      id: 'checkpoint-pending',
      title: '存在待审核点位任务',
      description: `${pendingCheckpoints[0].checkpointName} 有 ${pendingCheckpoints[0].pendingReviewCount} 个任务等待工作人员确认。`,
      level: 'warning',
    })
  }

  if (urgentAnnouncements.length > 0) {
    insights.push({
      id: 'urgent-announcements',
      title: '紧急通知尚未全部确认',
      description: `当前有 ${urgentAnnouncements.length} 条紧急通知仍存在未确认对象，建议继续人工联系。`,
      level: 'warning',
    })
  }

  insights.push({
    id: 'data-closed-loop',
    title: '运营数据已形成闭环',
    description: '报名、审核、签到、点位和通知确认数据已沉淀在同一套系统，便于赛后复盘和下一届优化。',
    level: 'neutral',
  })

  return insights.slice(0, 6)
}

function getEventRegistrations(
  eventConfig: EventConfig,
  registrations: Registration[],
): Registration[] {
  return registrations.filter((registration) => registration.eventId === eventConfig.id)
}

function countBy<T>(items: T[], predicate: (item: T) => boolean): number {
  return items.filter(predicate).length
}
