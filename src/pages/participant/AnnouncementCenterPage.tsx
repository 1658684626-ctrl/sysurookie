import { ArrowLeft } from 'lucide-react'
import { EmptyState } from '../../components/common/EmptyState'
import { InfoRow } from '../../components/common/InfoRow'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import type { EventConfig } from '../../types/event'
import type { Announcement } from '../../types/announcement'
import type { Registration } from '../../types/registration'
import {
  getAnnouncementSeverityLabel,
  getAnnouncementTypeLabel,
  getAnnouncementsForRegistration,
  isAnnouncementConfirmedByRegistration,
} from '../../utils/announcements'

interface AnnouncementCenterPageProps {
  announcements: Announcement[]
  eventConfig: EventConfig
  registration: Registration
  onBack: () => void
  onConfirm: (announcementId: string) => void
}

export function AnnouncementCenterPage({
  announcements,
  eventConfig,
  registration,
  onBack,
  onConfirm,
}: AnnouncementCenterPageProps) {
  const project = eventConfig.projects.find((item) => item.id === registration.projectId)
  const relevantAnnouncements = getAnnouncementsForRegistration(
    announcements,
    registration,
  ).sort((a, b) => {
    const aConfirmed = isAnnouncementConfirmedByRegistration(a, registration.id)
    const bConfirmed = isAnnouncementConfirmedByRegistration(b, registration.id)

    if (aConfirmed === bConfirmed) {
      return 0
    }

    return aConfirmed ? 1 : -1
  })

  return (
    <div className="space-y-5">
      <PrimaryButton tone="secondary" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
        返回报名状态
      </PrimaryButton>

      <SectionCard title="通知公告">
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow label="赛事名称" value={eventConfig.name} />
          <InfoRow label="项目 / 路线" value={project?.name ?? '未选择项目'} />
          <InfoRow
            label={registration.mode === 'team' ? '队伍名称' : '个人姓名'}
            value={registration.teamName || registration.captainName}
          />
          <InfoRow label="报名编号" value={registration.id} />
        </div>
      </SectionCard>

      {relevantAnnouncements.length === 0 ? (
        <EmptyState title="暂无与你相关的通知公告" description="已发布且匹配当前报名的通知会显示在这里。" />
      ) : (
        <div className="space-y-4">
          {relevantAnnouncements.map((announcement) => {
            const confirmation = announcement.confirmations.find(
              (item) => item.registrationId === registration.id,
            )
            const confirmed = Boolean(confirmation)

            return (
              <section
                key={announcement.id}
                className={`rounded-lg border bg-white p-4 shadow-sm ${
                  announcement.severity === 'urgent'
                    ? 'border-rose-300'
                    : announcement.severity === 'warning'
                      ? 'border-amber-300'
                      : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-950">{announcement.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {getAnnouncementTypeLabel(eventConfig, announcement.typeId)} ·{' '}
                      {announcement.publishedAt ?? announcement.createdAt}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge
                      label={getAnnouncementSeverityLabel(announcement.severity)}
                      tone={
                        announcement.severity === 'urgent'
                          ? 'danger'
                          : announcement.severity === 'warning'
                            ? 'warning'
                            : 'info'
                      }
                    />
                    <StatusBadge
                      label={confirmed ? '已确认' : '待确认'}
                      tone={confirmed ? 'success' : 'warning'}
                    />
                  </div>
                </div>
                <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                  {announcement.content}
                </p>
                <div className="mt-4">
                  {confirmed ? (
                    <p className="text-sm text-emerald-700">
                      已确认：{confirmation?.confirmedAt}
                    </p>
                  ) : (
                    <PrimaryButton onClick={() => onConfirm(announcement.id)}>
                      我已知悉
                    </PrimaryButton>
                  )}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
