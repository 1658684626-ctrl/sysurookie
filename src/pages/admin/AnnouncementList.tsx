import { SearchInput } from '../../components/common/SearchInput'
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
} from '../../utils/announcements'

export type AnnouncementFilter =
  | 'all'
  | 'draft'
  | 'published'
  | 'partially_confirmed'
  | 'confirmed'
  | 'urgent'

interface AnnouncementListProps {
  announcements: Announcement[]
  eventConfig: EventConfig
  filter: AnnouncementFilter
  registrations: Registration[]
  searchKeyword: string
  selectedAnnouncementId?: string
  onFilterChange: (filter: AnnouncementFilter) => void
  onSearchChange: (keyword: string) => void
  onSelectAnnouncement: (announcementId: string) => void
}

const filterLabels: Record<AnnouncementFilter, string> = {
  all: '全部',
  draft: '草稿',
  published: '已发布',
  partially_confirmed: '部分确认',
  confirmed: '全部确认',
  urgent: '紧急通知',
}

export function AnnouncementList({
  announcements,
  eventConfig,
  filter,
  registrations,
  searchKeyword,
  selectedAnnouncementId,
  onFilterChange,
  onSearchChange,
  onSelectAnnouncement,
}: AnnouncementListProps) {
  const normalizedKeyword = searchKeyword.trim().toLowerCase()
  const filteredAnnouncements = announcements.filter((announcement) => {
    const summary = getAnnouncementSummary(announcement, registrations)
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'urgent'
          ? announcement.severity === 'urgent'
          : summary.status === filter
    const searchableText = `${announcement.title} ${announcement.content}`.toLowerCase()

    return matchesFilter && searchableText.includes(normalizedKeyword)
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {(Object.keys(filterLabels) as AnnouncementFilter[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onFilterChange(item)}
              className={`min-h-9 shrink-0 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                filter === item
                  ? 'bg-gradient-to-r from-emerald-600 to-sky-600 text-white'
                  : 'bg-white/85 text-slate-600 hover:bg-emerald-50'
              }`}
            >
              {filterLabels[item]}
            </button>
          ))}
        </div>
        <SearchInput
          value={searchKeyword}
          placeholder="搜索标题或内容"
          onChange={onSearchChange}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
        {filteredAnnouncements.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">暂无符合条件的通知。</p>
        ) : (
          <div className="min-w-[900px] divide-y divide-slate-200">
            {filteredAnnouncements.map((announcement) => {
              const summary = getAnnouncementSummary(announcement, registrations)
              const selected = selectedAnnouncementId === announcement.id

              return (
                <button
                  key={announcement.id}
                  type="button"
                  onClick={() => onSelectAnnouncement(announcement.id)}
                  className={`grid w-full gap-3 px-4 py-4 text-left transition xl:grid-cols-[1.25fr_0.9fr_0.75fr_0.85fr_0.8fr_0.65fr] ${
                    selected
                      ? 'bg-slate-950 text-white'
                      : 'bg-white text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>
                    <span className="block font-medium">{announcement.title}</span>
                    <span className={`mt-1 block text-xs ${selected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {announcement.publishedAt ?? '未发布'}
                    </span>
                  </span>
                  <span className="text-sm">
                    {getAnnouncementTypeLabel(eventConfig, announcement.typeId)}
                  </span>
                  <span>
                    <StatusBadge
                      label={getAnnouncementSeverityLabel(announcement.severity)}
                      tone={announcement.severity === 'urgent' ? 'danger' : announcement.severity === 'warning' ? 'warning' : 'info'}
                    />
                  </span>
                  <span className="text-sm">
                    {getAnnouncementTargetScopeLabel(announcement.targetScope)}
                  </span>
                  <span>
                    <StatusBadge
                      label={getAnnouncementStatusLabel(summary.status)}
                      tone={summary.status === 'confirmed' ? 'success' : summary.status === 'draft' ? 'neutral' : 'info'}
                    />
                  </span>
                  <span className="text-sm">
                    {summary.confirmedTotal}/{summary.targetTotal} · {summary.confirmRate}%
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
