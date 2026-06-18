import { useMemo, useState } from 'react'
import { InfoRow } from '../../components/common/InfoRow'
import { MetricCard } from '../../components/common/MetricCard'
import { SectionCard } from '../../components/common/SectionCard'
import type { EventConfig } from '../../types/event'
import type { Registration } from '../../types/registration'
import { getPendingCheckpointReviewCount } from '../../utils/checkpoints'
import { ExecutionDetailPanel } from './ExecutionDetailPanel'
import { ExecutionList } from './ExecutionList'
import type { ExecutionFilter } from './ExecutionList'

interface ExecutionManagementPageProps {
  eventConfig: EventConfig
  filter: ExecutionFilter
  registrations: Registration[]
  searchKeyword: string
  onApproveCheckpoint: (registrationId: string, checkpointId: string) => void
  onMarkAttention: (registrationId: string, reason: string) => void
  onClearAttention: (registrationId: string, reason: string) => void
  onMarkFinished: (registrationId: string) => void
  onFilterChange: (filter: ExecutionFilter) => void
  onSearchChange: (keyword: string) => void
}

const modeLabels = {
  team: '队伍报名',
  individual: '个人报名',
}

export function ExecutionManagementPage({
  eventConfig,
  filter,
  registrations,
  searchKeyword,
  onApproveCheckpoint,
  onMarkAttention,
  onClearAttention,
  onMarkFinished,
  onFilterChange,
  onSearchChange,
}: ExecutionManagementPageProps) {
  const executionRegistrations = useMemo(
    () =>
      registrations.filter(
        (registration) =>
          registration.eventId === eventConfig.id &&
          registration.status === 'registered' &&
          registration.checkinStatus === 'departed' &&
          ['in_progress', 'attention_needed', 'finished'].includes(
            registration.executionStatus,
          ),
      ),
    [eventConfig.id, registrations],
  )
  const [selectedRegistrationId, setSelectedRegistrationId] = useState(
    () => executionRegistrations[0]?.id,
  )
  const selectedRegistration =
    executionRegistrations.find(
      (registration) => registration.id === selectedRegistrationId,
    ) ?? executionRegistrations[0]
  const pendingReviewCount = executionRegistrations.filter(
    (registration) => getPendingCheckpointReviewCount(registration, eventConfig) > 0,
  ).length

  return (
    <div className="space-y-6">
      <SectionCard title="现场执行管理">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <InfoRow label="赛事名称" value={eventConfig.name} />
          <InfoRow label="报名模式" value={modeLabels[eventConfig.registrationMode]} />
          <InfoRow label="项目 / 路线数量" value={eventConfig.projects.length} />
          <InfoRow label="点位数量" value={eventConfig.checkpoints.length} />
        </div>
      </SectionCard>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="已出发" value={executionRegistrations.length} />
        <MetricCard
          label="进行中"
          value={
            executionRegistrations.filter(
              (registration) => registration.executionStatus === 'in_progress',
            ).length
          }
        />
        <MetricCard
          label="异常关注"
          value={
            executionRegistrations.filter(
              (registration) => registration.executionStatus === 'attention_needed',
            ).length
          }
        />
        <MetricCard
          label="已完赛"
          value={
            executionRegistrations.filter(
              (registration) => registration.executionStatus === 'finished',
            ).length
          }
        />
        <MetricCard label="待审核任务" value={pendingReviewCount} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_520px]">
        <SectionCard title="执行列表" description="仅展示当前赛事已出发后的报名。">
          <ExecutionList
            eventConfig={eventConfig}
            filter={filter}
            registrations={executionRegistrations}
            searchKeyword={searchKeyword}
            selectedRegistrationId={selectedRegistration?.id}
            onFilterChange={onFilterChange}
            onSearchChange={onSearchChange}
            onSelectRegistration={setSelectedRegistrationId}
          />
        </SectionCard>

        <ExecutionDetailPanel
          eventConfig={eventConfig}
          registration={selectedRegistration}
          onApproveCheckpoint={(checkpointId) => {
            if (!selectedRegistration) {
              return
            }

            onApproveCheckpoint(selectedRegistration.id, checkpointId)
          }}
          onMarkAttention={(reason) => {
            if (!selectedRegistration) {
              return
            }

            onMarkAttention(selectedRegistration.id, reason)
          }}
          onClearAttention={(reason) => {
            if (!selectedRegistration) {
              return
            }

            onClearAttention(selectedRegistration.id, reason)
          }}
          onMarkFinished={() => {
            if (!selectedRegistration) {
              return
            }

            onMarkFinished(selectedRegistration.id)
          }}
        />
      </div>
    </div>
  )
}
