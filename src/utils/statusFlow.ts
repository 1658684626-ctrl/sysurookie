import type { EventConfig } from '../types/event'
import type { Registration } from '../types/registration'
import type {
  CheckinStatus,
  CheckpointStatus,
  EventExecutionStatus,
  RegistrationStatus,
} from '../types/status'
import {
  getMemberMissingFields,
  getRequiredMaterialRules,
  isRequiredValueFilled,
  isTeamSizeValid,
} from './validators'

export interface DashboardSummary {
  totalRegistrations: number
  incompleteCount: number
  pendingReviewCount: number
  registeredCount: number
  checkedInCount: number
  inProgressCount: number
  attentionNeededCount: number
  finishedCount: number
}

export interface CheckpointSummaryItem {
  checkpointId: string
  checkpointName: string
  arrivedCount: number
  submittedCount: number
  approvedCount: number
}

const registrationStatusLabels: Record<RegistrationStatus, string> = {
  draft: '草稿中',
  incomplete: '待完善',
  pending_review: '待审核',
  rejected: '审核驳回',
  approved: '审核通过',
  registered: '报名成功',
}

const checkinStatusLabels: Record<CheckinStatus, string> = {
  not_checked_in: '未签到',
  checked_in: '已签到',
  departed: '已出发',
}

const executionStatusLabels: Record<EventExecutionStatus, string> = {
  not_started: '未开始',
  in_progress: '进行中',
  attention_needed: '异常关注',
  finished: '已完赛',
}

const checkpointStatusLabels: Record<CheckpointStatus, string> = {
  not_arrived: '未到达',
  arrived: '已到达',
  submitted: '任务已提交',
  approved: '任务通过',
}

export function getRegistrationStatusLabel(status: RegistrationStatus): string {
  return registrationStatusLabels[status]
}

export function getCheckinStatusLabel(status: CheckinStatus): string {
  return checkinStatusLabels[status]
}

export function getExecutionStatusLabel(status: EventExecutionStatus): string {
  return executionStatusLabels[status]
}

export function getCheckpointStatusLabel(status: CheckpointStatus): string {
  return checkpointStatusLabels[status]
}

export function getMissingRequirements(
  registration: Registration,
  eventConfig: EventConfig,
): string[] {
  const missing: string[] = []
  const project = eventConfig.projects.find((item) => item.id === registration.projectId)

  if (!project) {
    return ['未选择有效项目']
  }

  if (!isTeamSizeValid(registration, project)) {
    missing.push(`队伍人数需为 ${project.minMembers}-${project.maxMembers} 人`)
  }

  if (registration.mode === 'team') {
    if (!isRequiredValueFilled(registration.teamName)) {
      missing.push('队伍名称未填写')
    }

    if (!isRequiredValueFilled(registration.captainName)) {
      missing.push('队长姓名未填写')
    }

    if (!isRequiredValueFilled(registration.captainPhone)) {
      missing.push('队长手机号未填写')
    }
  }

  registration.members.forEach((member, index) => {
    const memberLabel = member.name || `第 ${index + 1} 位成员`
    const missingFields = getMemberMissingFields(member, eventConfig)

    missingFields.forEach((field) => {
      missing.push(`${memberLabel}：${field}未填写`)
    })

    getRequiredMaterialRules(member, eventConfig).forEach((rule) => {
      const material = member.materials.find((item) => item.ruleId === rule.id)

      if (!material || material.status === 'missing' || material.status === 'rejected') {
        missing.push(`${memberLabel}：${rule.name}未上传或未通过`)
      }
    })
  })

  return missing
}

export function canSubmitForReview(
  registration: Registration,
  eventConfig: EventConfig,
): boolean {
  return getMissingRequirements(registration, eventConfig).length === 0
}

export function canApproveRegistration(
  registration: Registration,
  eventConfig: EventConfig,
): boolean {
  if (registration.status !== 'pending_review') {
    return false
  }

  if (!canSubmitForReview(registration, eventConfig)) {
    return false
  }

  return registration.members.every((member) =>
    getRequiredMaterialRules(member, eventConfig).every((rule) => {
      const material = member.materials.find((item) => item.ruleId === rule.id)

      return material?.status === 'uploaded' || material?.status === 'approved'
    }),
  )
}

export function getDashboardSummary(
  registrations: Registration[],
): DashboardSummary {
  return {
    totalRegistrations: registrations.length,
    incompleteCount: registrations.filter((item) => item.status === 'incomplete').length,
    pendingReviewCount: registrations.filter((item) => item.status === 'pending_review')
      .length,
    registeredCount: registrations.filter((item) => item.status === 'registered').length,
    checkedInCount: registrations.filter(
      (item) => item.checkinStatus === 'checked_in' || item.checkinStatus === 'departed',
    ).length,
    inProgressCount: registrations.filter((item) => item.executionStatus === 'in_progress')
      .length,
    attentionNeededCount: registrations.filter(
      (item) => item.executionStatus === 'attention_needed',
    ).length,
    finishedCount: registrations.filter((item) => item.executionStatus === 'finished').length,
  }
}

export function getCheckpointSummary(
  registrations: Registration[],
  eventConfig: EventConfig,
): CheckpointSummaryItem[] {
  const eventRegistrations = registrations.filter(
    (registration) => registration.eventId === eventConfig.id,
  )

  return eventConfig.checkpoints.map((checkpoint) => {
    const progress = eventRegistrations
      .map((registration) =>
        registration.checkpointProgress.find(
          (item) => item.checkpointId === checkpoint.id,
        ),
      )
      .filter((item) => item !== undefined)

    return {
      checkpointId: checkpoint.id,
      checkpointName: checkpoint.name,
      arrivedCount: progress.filter((item) =>
        ['arrived', 'submitted', 'approved'].includes(item.status),
      ).length,
      submittedCount: progress.filter((item) =>
        ['submitted', 'approved'].includes(item.status),
      ).length,
      approvedCount: progress.filter((item) => item.status === 'approved').length,
    }
  })
}
