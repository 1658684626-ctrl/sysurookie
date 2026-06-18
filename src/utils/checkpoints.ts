import type { CheckpointConfig } from '../types/event'
import type { CheckpointProgress, Registration } from '../types/registration'
import type { EventConfig } from '../types/event'
import { getExecutionStatusLabel } from './statusFlow'

export interface CheckpointProgressSummary {
  total: number
  notArrived: number
  arrived: number
  submitted: number
  approved: number
  requiredTotal: number
  requiredApproved: number
  progressPercent: number
}

export function getProjectCheckpoints(
  eventConfig: EventConfig,
  registration: Registration,
): CheckpointConfig[] {
  const project = eventConfig.projects.find((item) => item.id === registration.projectId)
  const checkpointMap = new Map(
    eventConfig.checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]),
  )

  if (project?.checkpoints?.length) {
    return project.checkpoints
      .map((checkpointId) => checkpointMap.get(checkpointId))
      .filter((checkpoint): checkpoint is CheckpointConfig => checkpoint !== undefined)
  }

  return [...eventConfig.checkpoints].sort((a, b) => a.order - b.order)
}

export function ensureCheckpointProgress(
  registration: Registration,
  eventConfig: EventConfig,
): CheckpointProgress[] {
  const currentProgress = new Map(
    registration.checkpointProgress.map((item) => [item.checkpointId, item]),
  )

  return getProjectCheckpoints(eventConfig, registration).map((checkpoint) => {
    const existing = currentProgress.get(checkpoint.id)

    return existing ?? { checkpointId: checkpoint.id, status: 'not_arrived' }
  })
}

export function getCheckpointProgressItem(
  registration: Registration,
  checkpointId: string,
): CheckpointProgress | undefined {
  return registration.checkpointProgress.find(
    (item) => item.checkpointId === checkpointId,
  )
}

export function getCheckpointProgressSummary(
  registration: Registration,
  eventConfig: EventConfig,
): CheckpointProgressSummary {
  const checkpoints = getProjectCheckpoints(eventConfig, registration)
  const progress = ensureCheckpointProgress(registration, eventConfig)
  const requiredIds = new Set(
    checkpoints.filter((checkpoint) => checkpoint.required).map((checkpoint) => checkpoint.id),
  )
  const requiredProgress = progress.filter((item) => requiredIds.has(item.checkpointId))
  const approved = progress.filter((item) => item.status === 'approved').length

  return {
    total: progress.length,
    notArrived: progress.filter((item) => item.status === 'not_arrived').length,
    arrived: progress.filter((item) => item.status === 'arrived').length,
    submitted: progress.filter((item) => item.status === 'submitted').length,
    approved,
    requiredTotal: requiredProgress.length,
    requiredApproved: requiredProgress.filter((item) => item.status === 'approved').length,
    progressPercent: progress.length === 0 ? 0 : Math.round((approved / progress.length) * 100),
  }
}

export function canAccessCheckpoint(
  registration: Registration,
  checkpoint: CheckpointConfig,
  eventConfig: EventConfig,
): boolean {
  if (registration.status !== 'registered') {
    return false
  }

  if (registration.checkinStatus !== 'departed') {
    return false
  }

  if (!['in_progress', 'attention_needed'].includes(registration.executionStatus)) {
    return false
  }

  const checkpoints = getProjectCheckpoints(eventConfig, registration)
  const currentIndex = checkpoints.findIndex((item) => item.id === checkpoint.id)

  if (currentIndex < 0) {
    return false
  }

  return checkpoints.slice(0, currentIndex).every((previousCheckpoint) => {
    if (!previousCheckpoint.required) {
      return true
    }

    const progress = getCheckpointProgressItem(registration, previousCheckpoint.id)

    return progress?.status === 'submitted' || progress?.status === 'approved'
  })
}

export function canSubmitCheckpointTask(
  registration: Registration,
  checkpointId: string,
): boolean {
  return getCheckpointProgressItem(registration, checkpointId)?.status === 'arrived'
}

export function areAllRequiredCheckpointsApproved(
  registration: Registration,
  eventConfig: EventConfig,
): boolean {
  const requiredCheckpoints = getProjectCheckpoints(eventConfig, registration).filter(
    (checkpoint) => checkpoint.required,
  )

  if (requiredCheckpoints.length === 0) {
    return true
  }

  return requiredCheckpoints.every(
    (checkpoint) =>
      getCheckpointProgressItem(registration, checkpoint.id)?.status === 'approved',
  )
}

export function getCurrentCheckpoint(
  registration: Registration,
  eventConfig: EventConfig,
): CheckpointConfig | null {
  return (
    getProjectCheckpoints(eventConfig, registration).find((checkpoint) => {
      if (!checkpoint.required) {
        return false
      }

      return getCheckpointProgressItem(registration, checkpoint.id)?.status !== 'approved'
    }) ?? null
  )
}

export function getExecutionDisplayStatus(registration: Registration): string {
  return getExecutionStatusLabel(registration.executionStatus)
}

export function getPendingCheckpointReviewCount(
  registration: Registration,
  eventConfig: EventConfig,
): number {
  const checkpointIds = new Set(
    getProjectCheckpoints(eventConfig, registration).map((checkpoint) => checkpoint.id),
  )

  return registration.checkpointProgress.filter(
    (item) => checkpointIds.has(item.checkpointId) && item.status === 'submitted',
  ).length
}
