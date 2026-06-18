import { PrimaryButton } from '../../components/common/PrimaryButton'
import { SearchInput } from '../../components/common/SearchInput'
import { StatusBadge } from '../../components/common/StatusBadge'
import type { EventConfig } from '../../types/event'
import type { Registration } from '../../types/registration'
import type { CheckinStatus } from '../../types/status'
import { getCheckinCode } from '../../utils/checkin'
import {
  getCheckinStatusLabel,
  getExecutionStatusLabel,
  getRegistrationStatusLabel,
} from '../../utils/statusFlow'

type CheckinFilter = 'all' | CheckinStatus

interface CheckinListProps {
  eventConfig: EventConfig
  filter: CheckinFilter
  registrations: Registration[]
  searchKeyword: string
  onCheckIn: (registrationId: string) => void
  onDepart: (registrationId: string) => void
  onFilterChange: (filter: CheckinFilter) => void
  onSearchChange: (keyword: string) => void
}

const filterOptions: Array<{ label: string; value: CheckinFilter }> = [
  { label: '全部', value: 'all' },
  { label: '未签到', value: 'not_checked_in' },
  { label: '已签到', value: 'checked_in' },
  { label: '已出发', value: 'departed' },
]

export function CheckinList({
  eventConfig,
  filter,
  registrations,
  searchKeyword,
  onCheckIn,
  onDepart,
  onFilterChange,
  onSearchChange,
}: CheckinListProps) {
  const filteredRegistrations = registrations.filter((registration) => {
    const statusMatched = filter === 'all' || registration.checkinStatus === filter
    const keyword = searchKeyword.trim().toLowerCase()

    if (!statusMatched) {
      return false
    }

    if (!keyword) {
      return true
    }

    const searchableText = [
      registration.id,
      getCheckinCode(registration),
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
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onFilterChange(option.value)}
            className={`min-h-9 shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
              filter === option.value
                ? 'border-emerald-500 bg-gradient-to-r from-emerald-600 to-sky-600 text-white'
                : 'border-slate-200 bg-white/85 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <SearchInput
        value={searchKeyword}
        onChange={onSearchChange}
        placeholder="搜索报名编号、检录码、队伍、成员"
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
        <div className="min-w-[980px]">
        <div className="grid grid-cols-[1.1fr_1.1fr_1fr_0.5fr_0.8fr_0.8fr_0.8fr] gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
          <span>报名信息</span>
          <span>检录码</span>
          <span>项目 / 路线</span>
          <span>人数</span>
          <span>报名状态</span>
          <span>检录状态</span>
          <span>操作</span>
        </div>
        <div className="divide-y divide-slate-200 bg-white">
          {filteredRegistrations.map((registration) => {
            const project = eventConfig.projects.find(
              (item) => item.id === registration.projectId,
            )

            return (
              <div
                key={registration.id}
                className="grid grid-cols-[1.1fr_1.1fr_1fr_0.5fr_0.8fr_0.8fr_0.8fr] gap-3 px-4 py-3 text-sm text-slate-700"
              >
                <span>
                  <span className="block font-medium text-slate-950">
                    {registration.teamName ||
                      registration.captainName ||
                      `${eventConfig.shortName}个人报名`}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {registration.id}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    更新：{registration.updatedAt}
                  </span>
                </span>
                <span className="break-all font-mono text-xs text-slate-600">
                  {getCheckinCode(registration)}
                </span>
                <span>{project?.name ?? '未选择项目'}</span>
                <span>{registration.members.length}</span>
                <span>
                  <StatusBadge
                    label={getRegistrationStatusLabel(registration.status)}
                    tone="success"
                  />
                </span>
                <span className="space-y-1">
                  <StatusBadge
                    label={getCheckinStatusLabel(registration.checkinStatus)}
                    tone={registration.checkinStatus === 'departed' ? 'success' : 'info'}
                  />
                  <span className="block text-xs text-slate-500">
                    {getExecutionStatusLabel(registration.executionStatus)}
                  </span>
                </span>
                <span>
                  {registration.checkinStatus === 'not_checked_in' && (
                    <PrimaryButton onClick={() => onCheckIn(registration.id)}>
                      签到
                    </PrimaryButton>
                  )}
                  {registration.checkinStatus === 'checked_in' && (
                    <PrimaryButton onClick={() => onDepart(registration.id)}>
                      标记出发
                    </PrimaryButton>
                  )}
                  {registration.checkinStatus === 'departed' && (
                    <PrimaryButton disabled>已出发</PrimaryButton>
                  )}
                </span>
              </div>
            )
          })}
        </div>
        </div>
      </div>
    </div>
  )
}

export type { CheckinFilter }
