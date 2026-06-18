import { MetricCard } from '../../components/common/MetricCard'
import { SectionCard } from '../../components/common/SectionCard'
import type { EventConfig } from '../../types/event'
import type { Registration } from '../../types/registration'
import { getCheckinEligibleRegistrations, getCheckinSummaryByEvent } from '../../utils/checkin'
import { CheckinActionPanel } from './CheckinActionPanel'
import { CheckinList, type CheckinFilter } from './CheckinList'

interface CheckinManagementPageProps {
  eventConfig: EventConfig
  filter: CheckinFilter
  registrations: Registration[]
  searchKeyword: string
  onCheckIn: (registrationId: string) => void
  onDepart: (registrationId: string) => void
  onFilterChange: (filter: CheckinFilter) => void
  onSearchChange: (keyword: string) => void
}

const modeLabels = {
  team: '队伍报名',
  individual: '个人报名',
}

export function CheckinManagementPage({
  eventConfig,
  filter,
  registrations,
  searchKeyword,
  onCheckIn,
  onDepart,
  onFilterChange,
  onSearchChange,
}: CheckinManagementPageProps) {
  const summary = getCheckinSummaryByEvent(registrations, eventConfig.id)
  const eligibleRegistrations = getCheckinEligibleRegistrations(
    registrations,
    eventConfig.id,
  )
  const eventRegistrations = registrations.filter(
    (registration) => registration.eventId === eventConfig.id,
  )

  return (
    <div className="space-y-6">
      <SectionCard title="签到检录">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoTile label="赛事名称" value={eventConfig.name} />
          <InfoTile label="报名模式" value={modeLabels[eventConfig.registrationMode]} />
          <InfoTile label="签到模式" value={modeLabels[eventConfig.checkinMode]} />
          <InfoTile label="项目 / 路线数量" value={`${eventConfig.projects.length} 个`} />
        </div>
      </SectionCard>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="报名成功" value={summary.registeredCount} />
        <MetricCard label="未签到" value={summary.notCheckedInCount} />
        <MetricCard label="已签到" value={summary.checkedInCount} />
        <MetricCard label="已出发" value={summary.departedCount} />
        <MetricCard label="进行中" value={summary.inProgressCount} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <SectionCard title="检录码输入" description="支持输入完整签到码或报名编号。">
          <CheckinActionPanel
            registrations={eventRegistrations}
            onCheckIn={onCheckIn}
          />
          <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
            只有报名成功的记录可以签到；本阶段不接入真实扫码或二维码生成。
          </p>
        </SectionCard>

        <SectionCard title="可检录名单" description="只展示当前赛事下报名成功的记录。">
          <CheckinList
            eventConfig={eventConfig}
            filter={filter}
            registrations={eligibleRegistrations}
            searchKeyword={searchKeyword}
            onCheckIn={onCheckIn}
            onDepart={onDepart}
            onFilterChange={onFilterChange}
            onSearchChange={onSearchChange}
          />
        </SectionCard>
      </div>
    </div>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  )
}
