import { useState } from 'react'
import { AuditLogList } from '../../components/common/AuditLogList'
import { InfoRow } from '../../components/common/InfoRow'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import { ProgressBar } from '../../components/common/ProgressBar'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import type { EventConfig } from '../../types/event'
import type { Registration } from '../../types/registration'
import {
  areAllRequiredCheckpointsApproved,
  ensureCheckpointProgress,
  getCheckpointProgressSummary,
  getProjectCheckpoints,
} from '../../utils/checkpoints'
import {
  getCheckinStatusLabel,
  getCheckpointStatusLabel,
  getExecutionStatusLabel,
} from '../../utils/statusFlow'

interface ExecutionDetailPanelProps {
  eventConfig: EventConfig
  registration?: Registration
  onApproveCheckpoint: (checkpointId: string) => void
  onMarkAttention: (reason: string) => void
  onClearAttention: (reason: string) => void
  onMarkFinished: () => void
}

const taskTypeLabels = {
  scan: '扫码任务',
  photo: '照片任务',
  text: '文本任务',
  manual: '人工确认',
}

export function ExecutionDetailPanel({
  eventConfig,
  registration,
  onApproveCheckpoint,
  onMarkAttention,
  onClearAttention,
  onMarkFinished,
}: ExecutionDetailPanelProps) {
  const [attentionReason, setAttentionReason] = useState('')
  const [resolveReason, setResolveReason] = useState('')

  if (!registration) {
    return (
      <SectionCard title="执行详情">
        <p className="text-sm text-slate-500">请选择一条执行记录查看点位进度。</p>
      </SectionCard>
    )
  }

  const project = eventConfig.projects.find((item) => item.id === registration.projectId)
  const registrationWithProgress = {
    ...registration,
    checkpointProgress: ensureCheckpointProgress(registration, eventConfig),
  }
  const checkpoints = getProjectCheckpoints(eventConfig, registration)
  const summary = getCheckpointProgressSummary(registrationWithProgress, eventConfig)
  const canFinish = areAllRequiredCheckpointsApproved(
    registrationWithProgress,
    eventConfig,
  )
  const isFinished = registration.executionStatus === 'finished'

  return (
    <div className="space-y-5">
      <SectionCard title="报名基础信息">
        <div className="mb-4 flex flex-wrap gap-2">
          <StatusBadge
            label={getCheckinStatusLabel(registration.checkinStatus)}
            tone="neutral"
          />
          <StatusBadge
            label={getExecutionStatusLabel(registration.executionStatus)}
            tone={isFinished ? 'success' : 'info'}
          />
        </div>
        <InfoRow label="报名编号" value={registration.id} />
        <InfoRow
          label={registration.mode === 'team' ? '队伍名称' : '个人姓名'}
          value={registration.teamName || registration.captainName}
        />
        <InfoRow label="项目 / 路线" value={project?.name ?? '未选择项目'} />
        <InfoRow label="成员人数" value={`${registration.members.length} 人`} />
        <InfoRow label="更新时间" value={registration.updatedAt} />
      </SectionCard>

      <SectionCard title="点位进度">
        <ProgressBar
          label={`任务通过：${summary.approved}/${summary.total}`}
          value={summary.progressPercent}
        />
        <div className="mt-5 space-y-3">
          {checkpoints.map((checkpoint) => {
            const progress = registrationWithProgress.checkpointProgress.find(
              (item) => item.checkpointId === checkpoint.id,
            )
            const status = progress?.status ?? 'not_arrived'

            return (
              <div key={checkpoint.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">点位 {checkpoint.order}</p>
                    <h4 className="mt-1 font-semibold text-slate-950">{checkpoint.name}</h4>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {checkpoint.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge
                      label={getCheckpointStatusLabel(status)}
                      tone={status === 'approved' ? 'success' : 'info'}
                    />
                    <StatusBadge
                      label={checkpoint.required ? '必需' : '可选'}
                      tone="neutral"
                    />
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <InfoRow label="任务类型" value={taskTypeLabels[checkpoint.taskType]} />
                  <InfoRow label="提交时间" value={progress?.submittedAt} />
                  <InfoRow label="备注" value={progress?.note} />
                  <InfoRow label="文件名" value={progress?.evidenceFileName} />
                </div>
                {status === 'submitted' && !isFinished && (
                  <div className="mt-4">
                    <PrimaryButton onClick={() => onApproveCheckpoint(checkpoint.id)}>
                      审核通过
                    </PrimaryButton>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </SectionCard>

      <SectionCard title="现场操作">
        <div className="space-y-4">
          {registration.executionStatus === 'in_progress' && (
            <div className="rounded-lg border border-slate-200 p-4">
              <label className="block text-sm font-medium text-slate-700">
                异常关注原因
                <textarea
                  value={attentionReason}
                  onChange={(event) => setAttentionReason(event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                />
              </label>
              <PrimaryButton
                className="mt-3"
                disabled={!attentionReason.trim()}
                onClick={() => {
                  onMarkAttention(attentionReason.trim())
                  setAttentionReason('')
                }}
              >
                标记异常关注
              </PrimaryButton>
            </div>
          )}

          {registration.executionStatus === 'attention_needed' && (
            <div className="rounded-lg border border-slate-200 p-4">
              <label className="block text-sm font-medium text-slate-700">
                解除原因
                <textarea
                  value={resolveReason}
                  onChange={(event) => setResolveReason(event.target.value)}
                  rows={3}
                  placeholder="默认：异常关注已解除"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                />
              </label>
              <PrimaryButton
                className="mt-3"
                tone="secondary"
                onClick={() => {
                  onClearAttention(resolveReason.trim() || '异常关注已解除')
                  setResolveReason('')
                }}
              >
                解除异常关注
              </PrimaryButton>
            </div>
          )}

          <div className="rounded-lg border border-slate-200 p-4">
            <PrimaryButton disabled={!canFinish || isFinished} onClick={onMarkFinished}>
              标记完赛
            </PrimaryButton>
            {!canFinish && (
              <p className="mt-2 text-sm text-slate-500">仍有必需点位未通过。</p>
            )}
            {isFinished && <p className="mt-2 text-sm text-emerald-700">已完赛。</p>}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="审核与执行记录">
        <AuditLogList auditLogs={registration.auditLogs} />
      </SectionCard>
    </div>
  )
}
