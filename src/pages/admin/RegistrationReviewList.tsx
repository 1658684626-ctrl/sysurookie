import { Search } from 'lucide-react'
import { StatusBadge } from '../../components/common/StatusBadge'
import {
  StatusFilter,
  type RegistrationStatusFilter,
} from '../../components/common/StatusFilter'
import type { EventConfig } from '../../types/event'
import type { Registration } from '../../types/registration'
import {
  getCheckinStatusLabel,
  getRegistrationStatusLabel,
} from '../../utils/statusFlow'

interface RegistrationReviewListProps {
  eventConfig: EventConfig
  filter: RegistrationStatusFilter
  registrations: Registration[]
  searchKeyword: string
  selectedRegistrationId?: string
  onFilterChange: (filter: RegistrationStatusFilter) => void
  onSearchChange: (keyword: string) => void
  onSelectRegistration: (registrationId: string) => void
}

const filterOptions = [
  { label: '全部', value: 'all' },
  { label: '待审核', value: 'pending_review' },
  { label: '待完善', value: 'incomplete' },
  { label: '审核驳回', value: 'rejected' },
  { label: '审核通过', value: 'approved' },
  { label: '报名成功', value: 'registered' },
] satisfies Array<{ label: string; value: RegistrationStatusFilter }>

const modeLabels = {
  team: '队伍',
  individual: '个人',
}

export function RegistrationReviewList({
  eventConfig,
  filter,
  registrations,
  searchKeyword,
  selectedRegistrationId,
  onFilterChange,
  onSearchChange,
  onSelectRegistration,
}: RegistrationReviewListProps) {
  const filteredRegistrations = registrations.filter((registration) => {
    const statusMatched = filter === 'all' || registration.status === filter
    const keyword = searchKeyword.trim().toLowerCase()

    if (!statusMatched) {
      return false
    }

    if (!keyword) {
      return true
    }

    const searchableText = [
      registration.id,
      registration.teamName,
      registration.captainName,
      registration.captainPhone,
      ...registration.members.flatMap((member) => [member.name, member.phone]),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchableText.includes(keyword)
  })

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <StatusFilter
          value={filter}
          options={filterOptions}
          onChange={onFilterChange}
        />
        <label className="relative block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            value={searchKeyword}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="搜索队伍、队长、手机号、成员姓名"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white/90 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
        <div className="min-w-[720px]">
        <div className="grid grid-cols-[1.2fr_0.7fr_1fr_0.6fr_0.8fr] gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
          <span>报名信息</span>
          <span>模式</span>
          <span>项目 / 路线</span>
          <span>人数</span>
          <span>状态</span>
        </div>
        <div className="divide-y divide-slate-200 bg-white">
          {filteredRegistrations.map((registration) => {
            const project = eventConfig.projects.find(
              (item) => item.id === registration.projectId,
            )

            return (
              <button
                key={registration.id}
                type="button"
                onClick={() => onSelectRegistration(registration.id)}
                className={`grid w-full grid-cols-[1.2fr_0.7fr_1fr_0.6fr_0.8fr] gap-3 px-4 py-3 text-left text-sm transition ${
                  selectedRegistrationId === registration.id
                    ? 'bg-slate-950 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>
                  <span className="block font-medium">
                    {registration.teamName ||
                      registration.captainName ||
                      `${eventConfig.shortName}个人报名`}
                  </span>
                  <span
                    className={`mt-1 block text-xs ${
                      selectedRegistrationId === registration.id
                        ? 'text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {registration.id}
                  </span>
                </span>
                <span>{modeLabels[registration.mode]}</span>
                <span>{project?.name ?? '未选择项目'}</span>
                <span>{registration.members.length}</span>
                <span className="space-y-1">
                  <StatusBadge
                    label={getRegistrationStatusLabel(registration.status)}
                    tone={getStatusTone(registration.status)}
                  />
                  <span
                    className={`block text-xs ${
                      selectedRegistrationId === registration.id
                        ? 'text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {getCheckinStatusLabel(registration.checkinStatus)}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
        </div>
      </div>
    </div>
  )
}

function getStatusTone(status: Registration['status']) {
  if (status === 'registered' || status === 'approved') {
    return 'success'
  }

  if (status === 'pending_review') {
    return 'warning'
  }

  if (status === 'rejected') {
    return 'danger'
  }

  return 'neutral'
}
