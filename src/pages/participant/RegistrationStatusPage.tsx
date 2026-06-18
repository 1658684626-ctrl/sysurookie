import { CircleCheckBig, Clock3 } from 'lucide-react'
import { CodeCard } from '../../components/common/CodeCard'
import { EventPassCard } from '../../components/common/EventPassCard'
import { InfoRow } from '../../components/common/InfoRow'
import { PixelCopilot } from '../../components/common/PixelCopilot'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import { RequirementList } from '../../components/common/RequirementList'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import type { EventConfig } from '../../types/event'
import type { Registration } from '../../types/registration'
import { getCheckinCode } from '../../utils/checkin'
import {
  canSubmitForReview,
  getCheckinStatusLabel,
  getExecutionStatusLabel,
  getMissingRequirements,
  getRegistrationStatusLabel,
} from '../../utils/statusFlow'

interface RegistrationStatusPageProps {
  eventConfig: EventConfig
  registration: Registration
  unconfirmedAnnouncementCount: number
  onEnterCheckpoints: () => void
  onEditMembers: () => void
  onOpenAnnouncements: () => void
  onSubmitReview: () => void
}

export function RegistrationStatusPage({
  eventConfig,
  registration,
  unconfirmedAnnouncementCount,
  onEnterCheckpoints,
  onEditMembers,
  onOpenAnnouncements,
  onSubmitReview,
}: RegistrationStatusPageProps) {
  const project = eventConfig.projects.find((item) => item.id === registration.projectId)
  const missingRequirements = getMissingRequirements(registration, eventConfig)
  const canSubmit = canSubmitForReview(registration, eventConfig)
  const isPendingReview = registration.status === 'pending_review'
  const latestRejectReason = registration.auditLogs.find(
    (log) => log.action === 'rejected' && log.reason,
  )?.reason
  const hasRegisteredAuditLog = registration.auditLogs.some(
    (log) => log.action === 'registered',
  )
  const canEnterCheckpoints =
    registration.status === 'registered' &&
    registration.checkinStatus === 'departed' &&
    ['in_progress', 'attention_needed'].includes(registration.executionStatus)

  return (
    <div className="space-y-5">
      <EventPassCard
        checkinStatus={getCheckinStatusLabel(registration.checkinStatus)}
        code={registration.status === 'registered' ? getCheckinCode(registration) : undefined}
        eventName={eventConfig.name}
        nextAction={
          canEnterCheckpoints
            ? '进入点位任务'
            : canSubmit
              ? '提交审核'
              : missingRequirements.length > 0
                ? '补齐资料任务'
                : '查看状态'
        }
        onAiHelper={onEditMembers}
        projectName={project?.name ?? '未选择项目'}
        registrationName={registration.teamName || registration.captainName || '个人报名'}
        registrationStatus={getRegistrationStatusLabel(registration.status)}
        unreadNoticeCount={unconfirmedAnnouncementCount}
      />

      <PixelCopilot
        compact
        message="我可以帮你检查还差什么资料、当前审核状态、签到状态和下一步任务。真实 AI 服务将在后续版本接入。"
        promptChips={['我还差什么资料？', '什么时候能签到？', '下一步做什么？']}
      />

      <div className="relative overflow-hidden rounded-3xl border border-[var(--ee-line)] bg-[#F8F6EF]/86 p-5 text-[var(--ee-text)] ee-card-shadow">
        <div className="absolute inset-0 ee-grid-overlay opacity-30" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="relative">
            <p className="font-mono-ui text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ee-muted)]">
              当前报名
            </p>
            <h3 className="font-editorial mt-2 text-3xl font-semibold tracking-[-0.05em] text-[var(--ee-text)]">
              {registration.teamName || registration.captainName || '个人报名'}
            </h3>
            <p className="mt-2 text-sm text-[var(--ee-muted)]">
              {project?.name ?? '未选择项目'}，{registration.members.length} 人
            </p>
          </div>
          <StatusBadge
            label={getRegistrationStatusLabel(registration.status)}
            tone={isPendingReview ? 'warning' : canSubmit ? 'success' : 'info'}
          />
        </div>
      </div>

      {isPendingReview && (
        <div className="flex items-start gap-3 rounded-2xl border border-cyan-200/40 bg-cyan-400/12 p-4 text-sm text-cyan-100 shadow-sm backdrop-blur">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">已提交审核</p>
            <p className="mt-1">请等待赛事工作人员审核。当前状态：待审核。</p>
          </div>
        </div>
      )}

      {registration.status === 'registered' && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/60 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm">
          <CircleCheckBig className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">报名成功</p>
            <p className="mt-1">该报名已进入正式名单，可继续进行检录和现场流程。</p>
          </div>
        </div>
      )}

      <SectionCard variant="glow" title="签到码 / 检录信息">
        {registration.status === 'registered' ? (
          <div className="space-y-4">
            <CodeCard code={getCheckinCode(registration)} />
            <div className="rounded-2xl border border-white/65 bg-white/86 p-4 shadow-sm backdrop-blur">
              <InfoRow label="报名编号" value={registration.id} />
              <InfoRow label="赛事名称" value={eventConfig.name} />
              <InfoRow label="项目 / 路线" value={project?.name ?? '未选择项目'} />
              <InfoRow
                label={registration.mode === 'team' ? '队伍名称' : '个人姓名'}
                value={registration.teamName || registration.captainName}
              />
              <InfoRow
                label="签到状态"
                value={getCheckinStatusLabel(registration.checkinStatus)}
              />
              <InfoRow
                label="赛中状态"
                value={getExecutionStatusLabel(registration.executionStatus)}
              />
            </div>
            {hasRegisteredAuditLog && (
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                已进入正式报名名单。
              </p>
            )}
            {registration.checkinStatus === 'checked_in' && (
              <p className="rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
                已完成现场检录，请等待工作人员发令出发。
              </p>
            )}
            {registration.checkinStatus === 'departed' && (
              <p className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-800">
                队伍已出发，后续可进入点位打卡流程。
              </p>
            )}
            {registration.executionStatus === 'finished' && (
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                已完赛，所有必需点位已完成。
              </p>
            )}
            <div>
              <PrimaryButton
                variant="neon"
                disabled={!canEnterCheckpoints}
                onClick={onEnterCheckpoints}
              >
                进入点位打卡
              </PrimaryButton>
              {!canEnterCheckpoints && registration.executionStatus !== 'finished' && (
                <p className="mt-2 text-sm text-slate-500">
                  报名成功并完成签到、由工作人员标记出发后可进入点位打卡。
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            报名成功后将生成签到码，请等待审核或确认报名。
          </p>
        )}
      </SectionCard>

      {registration.status === 'approved' && (
        <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CircleCheckBig className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">审核通过</p>
            <p className="mt-1">赛事工作人员已通过资料审核，等待确认为正式报名。</p>
          </div>
        </div>
      )}

      {registration.status === 'rejected' && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <p className="font-semibold">审核驳回</p>
          <p className="mt-1">请根据驳回原因补充资料后重新提交审核。</p>
          {latestRejectReason && (
            <p className="mt-2">最近驳回原因：{latestRejectReason}</p>
          )}
        </div>
      )}

      <RequirementList missingRequirements={missingRequirements} />

      <SectionCard title="通知公告">
        {unconfirmedAnnouncementCount > 0 ? (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-800 shadow-sm">
            你有 {unconfirmedAnnouncementCount} 条通知待确认。
          </p>
        ) : (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            暂无待确认通知，也可以进入通知公告查看历史通知。
          </p>
        )}
        <PrimaryButton className="mt-3" variant="secondary" onClick={onOpenAnnouncements}>
          通知公告
        </PrimaryButton>
      </SectionCard>

      <section className="rounded-3xl border border-white/65 bg-white/86 p-4 shadow-sm backdrop-blur">
        <h4 className="font-semibold text-slate-950">成员与材料概览</h4>
        <div className="mt-3 space-y-3">
          {registration.members.map((member) => (
            <div key={member.id} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-slate-900">
                  {member.name || '未填写姓名'} · {member.roleType}
                </p>
                <span className="text-slate-500">{member.phone || '未填写手机号'}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {member.materials.length === 0 ? (
                  <span className="text-xs text-slate-500">无材料记录</span>
                ) : (
                  member.materials.map((material) => (
                    <StatusBadge
                      key={material.ruleId}
                      label={`${material.ruleId}: ${material.status}`}
                      tone={material.status === 'missing' ? 'warning' : 'neutral'}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <PrimaryButton variant="secondary" onClick={onEditMembers}>
          返回编辑资料
        </PrimaryButton>
        <PrimaryButton disabled={!canSubmit || isPendingReview} onClick={onSubmitReview}>
          提交审核
        </PrimaryButton>
      </div>
    </div>
  )
}
