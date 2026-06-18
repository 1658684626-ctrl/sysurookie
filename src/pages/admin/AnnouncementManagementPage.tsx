import { useMemo, useState } from 'react'
import { InfoRow } from '../../components/common/InfoRow'
import { MetricCard } from '../../components/common/MetricCard'
import { SectionCard } from '../../components/common/SectionCard'
import type { EventConfig } from '../../types/event'
import type { Announcement, AnnouncementDraftInput } from '../../types/announcement'
import type { Registration } from '../../types/registration'
import { getAnnouncementSummary } from '../../utils/announcements'
import { AnnouncementDetailPanel } from './AnnouncementDetailPanel'
import { AnnouncementEditor } from './AnnouncementEditor'
import { AnnouncementList } from './AnnouncementList'
import type { AnnouncementFilter } from './AnnouncementList'

interface AnnouncementManagementPageProps {
  announcements: Announcement[]
  eventConfig: EventConfig
  filter: AnnouncementFilter
  registrations: Registration[]
  searchKeyword: string
  onCreateDraft: (input: AnnouncementDraftInput) => void
  onDeleteDraft: (announcementId: string) => void
  onFilterChange: (filter: AnnouncementFilter) => void
  onPublish: (announcementId: string) => void
  onSearchChange: (keyword: string) => void
}

const modeLabels = {
  team: '队伍报名',
  individual: '个人报名',
}

export function AnnouncementManagementPage({
  announcements,
  eventConfig,
  filter,
  registrations,
  searchKeyword,
  onCreateDraft,
  onDeleteDraft,
  onFilterChange,
  onPublish,
  onSearchChange,
}: AnnouncementManagementPageProps) {
  const eventAnnouncements = useMemo(
    () => announcements.filter((announcement) => announcement.eventId === eventConfig.id),
    [announcements, eventConfig.id],
  )
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(
    () => eventAnnouncements[0]?.id ?? '',
  )
  const selectedAnnouncement =
    eventAnnouncements.find((announcement) => announcement.id === selectedAnnouncementId) ??
    eventAnnouncements[0]
  const eventRegistrations = registrations.filter(
    (registration) => registration.eventId === eventConfig.id,
  )
  const computedStatuses = eventAnnouncements.map(
    (announcement) => getAnnouncementSummary(announcement, eventRegistrations).status,
  )

  return (
    <div className="space-y-6">
      <SectionCard title="通知公告">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <InfoRow label="赛事名称" value={eventConfig.name} />
          <InfoRow label="报名模式" value={modeLabels[eventConfig.registrationMode]} />
          <InfoRow label="通知类型数量" value={eventConfig.announcementTypes.length} />
          <InfoRow label="当前通知数量" value={eventAnnouncements.length} />
        </div>
      </SectionCard>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="总通知" value={eventAnnouncements.length} />
        <MetricCard
          label="草稿"
          value={computedStatuses.filter((status) => status === 'draft').length}
        />
        <MetricCard
          label="已发布"
          value={computedStatuses.filter((status) => status === 'published').length}
        />
        <MetricCard
          label="部分确认"
          value={computedStatuses.filter((status) => status === 'partially_confirmed').length}
        />
        <MetricCard
          label="全部确认"
          value={computedStatuses.filter((status) => status === 'confirmed').length}
        />
        <MetricCard
          label="紧急通知"
          value={eventAnnouncements.filter((announcement) => announcement.severity === 'urgent').length}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <AnnouncementEditor eventConfig={eventConfig} onCreateDraft={onCreateDraft} />

        <SectionCard title="通知列表" description="按当前赛事过滤，可筛选状态和搜索内容。">
          <AnnouncementList
            announcements={eventAnnouncements}
            eventConfig={eventConfig}
            filter={filter}
            registrations={eventRegistrations}
            searchKeyword={searchKeyword}
            selectedAnnouncementId={selectedAnnouncement?.id}
            onFilterChange={onFilterChange}
            onSearchChange={onSearchChange}
            onSelectAnnouncement={setSelectedAnnouncementId}
          />
        </SectionCard>
      </div>

      <AnnouncementDetailPanel
        announcement={selectedAnnouncement}
        eventConfig={eventConfig}
        registrations={eventRegistrations}
        onDeleteDraft={() => {
          if (!selectedAnnouncement) {
            return
          }

          onDeleteDraft(selectedAnnouncement.id)
          setSelectedAnnouncementId(
            eventAnnouncements.find((announcement) => announcement.id !== selectedAnnouncement.id)
              ?.id ?? '',
          )
        }}
        onPublish={() => {
          if (!selectedAnnouncement) {
            return
          }

          onPublish(selectedAnnouncement.id)
        }}
      />
    </div>
  )
}
