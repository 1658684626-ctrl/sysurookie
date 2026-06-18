import { useMemo, useState } from 'react'
import { ArrowLeft, MapPin, Send } from 'lucide-react'
import { CheckpointTimeline, type CheckpointTimelineItem } from '../../components/common/CheckpointTimeline'
import { HealthSignalStatStrip } from '../../components/common/HealthSignalPreview'
import { InfoRow } from '../../components/common/InfoRow'
import { MotionStatCard } from '../../components/common/MotionStatCard'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import { ProgressBar } from '../../components/common/ProgressBar'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import type { CheckpointConfig, EventConfig } from '../../types/event'
import type { Registration } from '../../types/registration'
import {
  canAccessCheckpoint,
  canSubmitCheckpointTask,
  ensureCheckpointProgress,
  getCheckpointProgressItem,
  getCheckpointProgressSummary,
  getCurrentCheckpoint,
  getProjectCheckpoints,
} from '../../utils/checkpoints'
import {
  getCheckpointStatusLabel,
  getExecutionStatusLabel,
} from '../../utils/statusFlow'

interface CheckpointTaskPageProps {
  eventConfig: EventConfig
  registration: Registration
  onBack: () => void
  onMarkArrived: (checkpointId: string) => void
  onSubmitTask: (
    checkpointId: string,
    payload: { note?: string; evidenceFileName?: string },
  ) => void
}

const taskTypeLabels: Record<CheckpointConfig['taskType'], string> = {
  scan: '扫码任务',
  photo: '照片文件名',
  text: '文本答案',
  manual: '人工确认',
}

export function CheckpointTaskPage({
  eventConfig,
  registration,
  onBack,
  onMarkArrived,
  onSubmitTask,
}: CheckpointTaskPageProps) {
  const [notesByCheckpoint, setNotesByCheckpoint] = useState<Record<string, string>>({})
  const [filesByCheckpoint, setFilesByCheckpoint] = useState<Record<string, string>>({})
  const project = eventConfig.projects.find((item) => item.id === registration.projectId)
  const checkpoints = getProjectCheckpoints(eventConfig, registration)
  const registrationWithProgress = useMemo(
    () => ({
      ...registration,
      checkpointProgress: ensureCheckpointProgress(registration, eventConfig),
    }),
    [eventConfig, registration],
  )
  const summary = getCheckpointProgressSummary(registrationWithProgress, eventConfig)
  const currentCheckpoint = getCurrentCheckpoint(registrationWithProgress, eventConfig)
  const canEnterTasks =
    registration.status === 'registered' &&
    registration.checkinStatus === 'departed' &&
    ['in_progress', 'attention_needed', 'finished'].includes(registration.executionStatus)

  if (!canEnterTasks) {
    return (
      <div className="space-y-4">
        <PrimaryButton tone="secondary" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          返回报名状态
        </PrimaryButton>
        <SectionCard title="暂不能进入点位打卡">
          <p className="text-sm text-slate-600">
            报名成功并由工作人员完成签到、标记出发后，才可以进入点位打卡流程。
          </p>
        </SectionCard>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PrimaryButton tone="secondary" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          返回报名状态
        </PrimaryButton>
        <StatusBadge
          label={getExecutionStatusLabel(registration.executionStatus)}
          tone={registration.executionStatus === 'finished' ? 'success' : 'info'}
        />
      </div>

      <SectionCard variant="glow" title="点位打卡">
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow label="赛事名称" value={eventConfig.name} />
          <InfoRow label="项目 / 路线" value={project?.name ?? '未选择项目'} />
          <InfoRow
            label={registration.mode === 'team' ? '队伍名称' : '个人姓名'}
            value={registration.teamName || registration.captainName}
          />
          <InfoRow
            label="当前点位"
            value={
              registration.executionStatus === 'finished'
                ? '已完成全部必需点位'
                : currentCheckpoint?.name ?? '暂无待完成必需点位'
            }
          />
        </div>
        <div className="mt-5">
          <ProgressBar
            label={`点位进度：${summary.approved}/${summary.total}`}
            value={summary.progressPercent}
          />
        </div>
      </SectionCard>

      <div className="grid gap-3 sm:grid-cols-3">
        <MotionStatCard
          label="Approved"
          progress={summary.progressPercent}
          tone="acid"
          trend="任务通过点位"
          unit="cp"
          value={summary.approved}
        />
        <MotionStatCard
          label="Submitted"
          progress={summary.total ? (summary.submitted / summary.total) * 100 : 0}
          tone="yellow"
          trend="等待工作人员确认"
          unit="task"
          value={summary.submitted}
        />
        <MotionStatCard
          label="Route"
          progress={summary.progressPercent}
          tone="olive"
          trend="当前路线进度"
          unit="%"
          value={summary.progressPercent}
        />
      </div>

      <HealthSignalStatStrip />

      <CheckpointTimeline
        items={checkpoints.map((checkpoint): CheckpointTimelineItem => {
          const progress = getCheckpointProgressItem(
            registrationWithProgress,
            checkpoint.id,
          )
          const checkpointStatus = progress?.status ?? 'not_arrived'
          const canArrive =
            checkpointStatus === 'not_arrived' &&
            canAccessCheckpoint(registrationWithProgress, checkpoint, eventConfig)
          const canSubmit = canSubmitCheckpointTask(registrationWithProgress, checkpoint.id)

          return {
            action: (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <InfoRow label="任务类型" value={taskTypeLabels[checkpoint.taskType]} />
                  <InfoRow label="提交时间" value={progress?.submittedAt} />
                  <InfoRow label="提交文件" value={progress?.evidenceFileName} />
                </div>
                {canArrive && (
                  <PrimaryButton onClick={() => onMarkArrived(checkpoint.id)}>
                    <MapPin className="mr-2 h-4 w-4" aria-hidden="true" />
                    记录到达点位
                  </PrimaryButton>
                )}

                {checkpointStatus === 'not_arrived' && !canArrive && (
                  <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
                    请按路线顺序完成前序必需点位。
                  </p>
                )}

                {canSubmit && (
                  <CheckpointSubmitForm
                    checkpoint={checkpoint}
                    note={notesByCheckpoint[checkpoint.id] ?? ''}
                    evidenceFileName={filesByCheckpoint[checkpoint.id] ?? ''}
                    onNoteChange={(value) =>
                      setNotesByCheckpoint((current) => ({
                        ...current,
                        [checkpoint.id]: value,
                      }))
                    }
                    onEvidenceFileNameChange={(value) =>
                      setFilesByCheckpoint((current) => ({
                        ...current,
                        [checkpoint.id]: value,
                      }))
                    }
                    onSubmit={() =>
                      onSubmitTask(checkpoint.id, {
                        note: notesByCheckpoint[checkpoint.id],
                        evidenceFileName: filesByCheckpoint[checkpoint.id],
                      })
                    }
                  />
                )}

                {checkpointStatus === 'submitted' && (
                  <p className="rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
                    已提交，等待工作人员确认。
                  </p>
                )}

                {checkpointStatus === 'approved' && (
                  <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                    任务已通过。
                  </p>
                )}
              </div>
            ),
            description: checkpoint.description,
            evidenceFileName: progress?.evidenceFileName,
            id: checkpoint.id,
            isCurrent: currentCheckpoint?.id === checkpoint.id,
            name: checkpoint.name,
            order: checkpoint.order,
            required: checkpoint.required,
            statusLabel: getCheckpointStatusLabel(checkpointStatus),
            submittedAt: progress?.submittedAt,
            submittedNote: progress?.note,
          }
        })}
      />
    </div>
  )
}

function CheckpointSubmitForm({
  checkpoint,
  note,
  evidenceFileName,
  onNoteChange,
  onEvidenceFileNameChange,
  onSubmit,
}: {
  checkpoint: CheckpointConfig
  note: string
  evidenceFileName: string
  onNoteChange: (value: string) => void
  onEvidenceFileNameChange: (value: string) => void
  onSubmit: () => void
}) {
  if (checkpoint.taskType === 'scan') {
    return (
      <PrimaryButton onClick={onSubmit}>
        <Send className="mr-2 h-4 w-4" aria-hidden="true" />
        确认扫码任务
      </PrimaryButton>
    )
  }

  return (
    <div className="space-y-3">
      {checkpoint.taskType === 'photo' && (
        <label className="block text-sm font-medium text-slate-700">
          照片文件名
          <input
            value={evidenceFileName}
            onChange={(event) => onEvidenceFileNameChange(event.target.value)}
            placeholder="例如 team-photo.jpg"
            className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
          />
        </label>
      )}
      <label className="block text-sm font-medium text-slate-700">
        {checkpoint.taskType === 'text' ? '任务答案 / 备注' : '备注，等待工作人员确认'}
        <textarea
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          rows={3}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
        />
      </label>
      <PrimaryButton onClick={onSubmit}>
        <Send className="mr-2 h-4 w-4" aria-hidden="true" />
        提交任务
      </PrimaryButton>
    </div>
  )
}
