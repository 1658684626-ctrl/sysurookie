import { EmptyState } from '../../components/common/EmptyState'
import { InfoRow } from '../../components/common/InfoRow'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import { ProgressBar } from '../../components/common/ProgressBar'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import type { EventConfig } from '../../types/event'
import type { Announcement } from '../../types/announcement'
import type { Registration } from '../../types/registration'
import {
  getAnnouncementSeverityLabel,
  getAnnouncementStatusLabel,
  getAnnouncementSummary,
  getAnnouncementTargetScopeLabel,
  getAnnouncementTypeLabel,
  getTargetRegistrations,
} from '../../utils/announcements'
import {
  getCheckinStatusLabel,
  getExecutionStatusLabel,
  getRegistrationStatusLabel,
} from '../../utils/statusFlow'

interface AnnouncementDetailPanelProps {
  announcement?: Announcement
  eventConfig: EventConfig
  registrations: Registration[]
  onDeleteDraft: () => void
  onPublish: () => void
}

export function AnnouncementDetailPanel({
  announcement,
  eventConfig,
  registrations,
  onDeleteDraft,
  onPublish,
}: AnnouncementDetailPanelProps) {
  if (!announcement) {
    return (
      <SectionCard title="通知详情">
        <EmptyState title="请选择通知" description="从左侧列表选择一条通知查看确认情况。" />
      </SectionCard>
    )
  }

  const summary = getAnnouncementSummary(announcement, registrations)
  const targetRegistrations = getTargetRegistrations(announcement, registrations)
  const confirmationMap = new Map(
    announcement.confirmations.map((confirmation) => [
      confirmation.registrationId,
      confirmation,
    ]),
  )
  const confirmedRegistrations = targetRegistrations.filter((registration) =>
    confirmationMap.has(registration.id),
  )
  const unconfirmedRegistrations = targetRegistrations.filter(
    (registration) => !confirmationMap.has(registration.id),
  )

  return (
    <div className="space-y-5">
      <SectionCard title="通知基础信息">
        <div className="mb-4 flex flex-wrap gap-2">
          <StatusBadge
            label={getAnnouncementStatusLabel(summary.status)}
            tone={summary.status === 'confirmed' ? 'success' : summary.status === 'draft' ? 'neutral' : 'info'}
          />
          <StatusBadge
            label={getAnnouncementSeverityLabel(announcement.severity)}
            tone={announcement.severity === 'urgent' ? 'danger' : announcement.severity === 'warning' ? 'warning' : 'info'}
          />
        </div>
        <InfoRow label="标题" value={announcement.title} />
        <InfoRow
          label="类型"
          value={getAnnouncementTypeLabel(eventConfig, announcement.typeId)}
        />
        <InfoRow
          label="目标范围"
          value={getAnnouncementTargetScopeLabel(announcement.targetScope)}
        />
        <InfoRow label="创建时间" value={announcement.createdAt} />
        <InfoRow label="发布时间" value={announcement.publishedAt ?? '未发布'} />
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
          {announcement.content}
        </p>
      </SectionCard>

      <SectionCard title="确认统计">
        <div className="grid gap-3 sm:grid-cols-3">
          <InfoRow label="应确认数量" value={summary.targetTotal} />
          <InfoRow label="已确认数量" value={summary.confirmedTotal} />
          <InfoRow label="未确认数量" value={summary.unconfirmedTotal} />
        </div>
        <div className="mt-4">
          <ProgressBar label="确认率" value={summary.confirmRate} />
        </div>
      </SectionCard>

      {announcement.status === 'draft' && (
        <SectionCard title="草稿操作">
          <div className="flex flex-wrap gap-3">
            <PrimaryButton onClick={onPublish}>发布通知</PrimaryButton>
            <PrimaryButton tone="danger" onClick={onDeleteDraft}>
              删除草稿
            </PrimaryButton>
          </div>
        </SectionCard>
      )}

      {announcement.status !== 'draft' && (
        <>
          <SectionCard title="已确认名单">
            <RegistrationConfirmationList
              eventConfig={eventConfig}
              registrations={confirmedRegistrations}
              confirmationMap={confirmationMap}
              mode="confirmed"
            />
          </SectionCard>

          <SectionCard title="未确认名单">
            <RegistrationConfirmationList
              eventConfig={eventConfig}
              registrations={unconfirmedRegistrations}
              confirmationMap={confirmationMap}
              mode="unconfirmed"
            />
          </SectionCard>
        </>
      )}
    </div>
  )
}

function RegistrationConfirmationList({
  eventConfig,
  registrations,
  confirmationMap,
  mode,
}: {
  eventConfig: EventConfig
  registrations: Registration[]
  confirmationMap: Map<string, Announcement['confirmations'][number]>
  mode: 'confirmed' | 'unconfirmed'
}) {
  if (registrations.length === 0) {
    return (
      <EmptyState
        title={mode === 'confirmed' ? '暂无已确认对象' : '暂无未确认对象'}
        description="确认数据会随参赛者操作自动更新。"
      />
    )
  }

  return (
    <div className="space-y-3">
      {registrations.map((registration) => {
        const project = eventConfig.projects.find(
          (item) => item.id === registration.projectId,
        )
        const confirmation = confirmationMap.get(registration.id)

        return (
          <div key={registration.id} className="rounded-lg border border-slate-200 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-slate-950">
                  {registration.teamName || registration.captainName || '个人报名'}
                </p>
                <p className="mt-1 text-xs text-slate-500">{registration.id}</p>
              </div>
              <StatusBadge
                label={getRegistrationStatusLabel(registration.status)}
                tone="neutral"
              />
            </div>
            <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              <span>项目 / 路线：{project?.name ?? '未选择项目'}</span>
              {mode === 'confirmed' ? (
                <span>确认人：{confirmation?.confirmedBy ?? '参赛者'}</span>
              ) : (
                <span>签到：{getCheckinStatusLabel(registration.checkinStatus)}</span>
              )}
              {mode === 'confirmed' ? (
                <span>确认时间：{confirmation?.confirmedAt ?? '未记录'}</span>
              ) : (
                <span>赛中：{getExecutionStatusLabel(registration.executionStatus)}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
