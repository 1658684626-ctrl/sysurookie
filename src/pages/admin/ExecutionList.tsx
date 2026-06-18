import { SearchInput } from '../../components/common/SearchInput'
import { StatusBadge } from '../../components/common/StatusBadge'
import type { EventConfig } from '../../types/event'
import type { Registration } from '../../types/registration'
import {
  getCheckpointProgressSummary,
  getPendingCheckpointReviewCount,
} from '../../utils/checkpoints'
import {
  getCheckinStatusLabel,
  getExecutionStatusLabel,
} from '../../utils/statusFlow'

export type ExecutionFilter =
  | 'all'
  | 'in_progress'
  | 'attention_needed'
  | 'finished'
  | 'pending_review'

interface ExecutionListProps {
  eventConfig: EventConfig
  filter: ExecutionFilter
  registrations: Registration[]
  searchKeyword: string
  selectedRegistrationId?: string
  onFilterChange: (filter: ExecutionFilter) => void
  onSearchChange: (keyword: string) => void
  onSelectRegistration: (registrationId: string) => void
}

const filterLabels: Record<ExecutionFilter, string> = {
  all: '全部',
  in_progress: '进行中',
  attention_needed: '异常关注',
  finished: '已完赛',
  pending_review: '有任务待审核',
}

export function ExecutionList({
  eventConfig,
  filter,
  registrations,
  searchKeyword,
  selectedRegistrationId,
  onFilterChange,
  onSearchChange,
  onSelectRegistration,
}: ExecutionListProps) {
  const normalizedKeyword = searchKeyword.trim().toLowerCase()
  const filteredRegistrations = registrations.filter((registration) => {
    const pendingReviewCount = getPendingCheckpointReviewCount(registration, eventConfig)
    const project = eventConfig.projects.find((item) => item.id === registration.projectId)
    const searchableText = [
      registration.id,
      registration.teamName,
      registration.captainName,
      project?.name,
      ...registration.members.map((member) => member.name),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'pending_review'
          ? pendingReviewCount > 0
          : registration.executionStatus === filter

    return matchesFilter && searchableText.includes(normalizedKeyword)
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {(Object.keys(filterLabels) as ExecutionFilter[]).map((item) => (
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
          placeholder="搜索报名编号、队伍、队长或成员"
          onChange={onSearchChange}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
        <div className="min-w-[940px]">
        <div className="hidden grid-cols-[1.2fr_1fr_0.7fr_0.85fr_0.8fr_0.7fr_0.8fr] gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500 xl:grid">
          <span>报名对象</span>
          <span>项目 / 路线</span>
          <span>人数</span>
          <span>签到状态</span>
          <span>赛中状态</span>
          <span>点位进度</span>
          <span>待审核</span>
        </div>
        {filteredRegistrations.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">暂无符合条件的执行记录。</p>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredRegistrations.map((registration) => {
              const project = eventConfig.projects.find(
                (item) => item.id === registration.projectId,
              )
              const summary = getCheckpointProgressSummary(registration, eventConfig)
              const pendingReviewCount = getPendingCheckpointReviewCount(
                registration,
                eventConfig,
              )

              return (
                <button
                  key={registration.id}
                  type="button"
                  onClick={() => onSelectRegistration(registration.id)}
                  className={`grid w-full gap-3 px-4 py-4 text-left transition xl:grid-cols-[1.2fr_1fr_0.7fr_0.85fr_0.8fr_0.7fr_0.8fr] ${
                    selectedRegistrationId === registration.id
                      ? 'bg-slate-950 text-white'
                      : 'bg-white text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>
                    <span className="block font-medium">
                      {registration.teamName || registration.captainName || '个人报名'}
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
                  <span className="text-sm">{project?.name ?? '未选择项目'}</span>
                  <span className="text-sm">{registration.members.length} 人</span>
                  <span>
                    <StatusBadge
                      label={getCheckinStatusLabel(registration.checkinStatus)}
                      tone="neutral"
                    />
                  </span>
                  <span>
                    <StatusBadge
                      label={getExecutionStatusLabel(registration.executionStatus)}
                      tone={registration.executionStatus === 'finished' ? 'success' : 'info'}
                    />
                  </span>
                  <span className="text-sm">
                    {summary.approved}/{summary.total}
                  </span>
                  <span className="text-sm">{pendingReviewCount} 项</span>
                </button>
              )
            })}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
