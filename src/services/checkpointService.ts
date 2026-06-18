export {
  getCheckpointProgressSummary,
  getProjectCheckpoints,
} from '../utils/checkpoints'
import type { CheckpointTaskPayload } from './adapters/types'
import { serviceClient } from './serviceClient'

export async function initializeCheckpointProgress(registrationId: string) {
  return serviceClient.checkpoints.initializeCheckpointProgress(registrationId)
}

export async function markCheckpointArrived(
  registrationId: string,
  checkpointId: string,
) {
  return serviceClient.checkpoints.markCheckpointArrived(registrationId, checkpointId)
}

export async function submitCheckpointTask(
  registrationId: string,
  checkpointId: string,
  payload: CheckpointTaskPayload,
) {
  return serviceClient.checkpoints.submitCheckpointTask(
    registrationId,
    checkpointId,
    payload,
  )
}

export async function approveCheckpointTask(
  registrationId: string,
  checkpointId: string,
) {
  return serviceClient.checkpoints.approveCheckpointTask(registrationId, checkpointId)
}

export async function markRegistrationAttentionNeeded(
  registrationId: string,
  reason: string,
) {
  return serviceClient.checkpoints.markRegistrationAttentionNeeded(registrationId, reason)
}

export async function clearRegistrationAttention(
  registrationId: string,
  reason?: string,
) {
  return serviceClient.checkpoints.clearRegistrationAttention(registrationId, reason)
}

export async function markRegistrationFinished(registrationId: string) {
  return serviceClient.checkpoints.markRegistrationFinished(registrationId)
}
