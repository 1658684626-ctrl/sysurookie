import { useCallback, useEffect, useMemo, useState } from 'react'
import { BarChart3, Bell, Bot, ClipboardCheck, QrCode, RadioTower, RotateCcw } from 'lucide-react'
import { AnimatedPage } from '../../components/common/AnimatedPage'
import { AiTerminalPanel } from '../../components/common/AiTerminalPanel'
import { EmptyState } from '../../components/common/EmptyState'
import { ModuleNav } from '../../components/common/ModuleNav'
import { PageHeader } from '../../components/common/PageHeader'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import { SectionCard } from '../../components/common/SectionCard'
import { SoftCommandCard } from '../../components/common/SoftCommandCard'
import type { RegistrationStatusFilter } from '../../components/common/StatusFilter'
import { eventTemplates } from '../../data/eventTemplates'
import type { Announcement } from '../../types/announcement'
import type { EventConfig } from '../../types/event'
import type { Registration } from '../../types/registration'
import {
  announcementService,
  checkinService,
  checkpointService,
  eventService,
  registrationService,
  reviewService,
} from '../../services'
import { getActiveAdapterName, isDevToolsEnabled } from '../../services/serviceClient'
import { AdminDashboard } from './AdminDashboard'
import { AnnouncementManagementPage } from './AnnouncementManagementPage'
import type { AnnouncementFilter } from './AnnouncementList'
import { CheckinManagementPage } from './CheckinManagementPage'
import type { CheckinFilter } from './CheckinList'
import { ExecutionManagementPage } from './ExecutionManagementPage'
import type { ExecutionFilter } from './ExecutionList'
import { ReviewDashboardPage } from './ReviewDashboardPage'
import { RegistrationReviewDetail } from './RegistrationReviewDetail'
import { RegistrationReviewList } from './RegistrationReviewList'

interface AdminHomeProps {
  selectedEventId: string
  onDataChange?: () => void
  onSelectEvent: (eventId: string) => void
}

type AdminSection = 'review' | 'checkin' | 'execution' | 'announcements' | 'analytics'

const adminNavItems: { id: AdminSection; label: string }[] = [
  { id: 'review', label: '报名审核' },
  { id: 'checkin', label: '签到检录' },
  { id: 'execution', label: '现场执行' },
  { id: 'announcements', label: '通知公告' },
  { id: 'analytics', label: '数据复盘' },
]

export function AdminHome({
  selectedEventId,
  onDataChange,
  onSelectEvent,
}: AdminHomeProps) {
  const activeAdapterName = getActiveAdapterName()
  const localFallbackEvents = activeAdapterName === 'supabase' ? [] : eventTemplates
  const [eventConfigs, setEventConfigs] = useState<EventConfig[]>(localFallbackEvents)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [adminSection, setAdminSection] = useState<AdminSection>('review')
  const [filter, setFilter] = useState<RegistrationStatusFilter>('all')
  const [checkinFilter, setCheckinFilter] = useState<CheckinFilter>('all')
  const [executionFilter, setExecutionFilter] = useState<ExecutionFilter>('all')
  const [announcementFilter, setAnnouncementFilter] = useState<AnnouncementFilter>('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [checkinSearchKeyword, setCheckinSearchKeyword] = useState('')
  const [executionSearchKeyword, setExecutionSearchKeyword] = useState('')
  const [announcementSearchKeyword, setAnnouncementSearchKeyword] = useState('')
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<string | undefined>()
  const devToolsEnabled = isDevToolsEnabled()

  const selectedEvent =
    eventConfigs.find((event) => event.id === selectedEventId) ??
    eventConfigs[0] ??
    localFallbackEvents[0]
  const eventRegistrations = useMemo(
    () =>
      selectedEvent
        ? registrations.filter(
            (registration) => registration.eventId === selectedEvent.id,
          )
        : [],
    [registrations, selectedEvent],
  )
  const selectedRegistration =
    eventRegistrations.find((registration) => registration.id === selectedRegistrationId) ??
    eventRegistrations[0]
  const adminMetrics = useMemo(
    () => ({
      attention: eventRegistrations.filter((registration) => registration.executionStatus === 'attention_needed').length,
      checkin: eventRegistrations.filter((registration) => registration.status === 'registered').length,
      execution: eventRegistrations.filter((registration) => ['in_progress', 'attention_needed'].includes(registration.executionStatus)).length,
      pendingReview: eventRegistrations.filter((registration) => registration.status === 'pending_review').length,
      registered: eventRegistrations.filter((registration) => registration.status === 'registered').length,
    }),
    [eventRegistrations],
  )

  const reloadAdminData = useCallback(async (eventId = selectedEvent?.id ?? '') => {
    const [nextEventConfigs, nextRegistrations, nextAnnouncements] = await Promise.all([
      eventService.getEventTemplates(),
      registrationService.getRegistrations(),
      announcementService.getAnnouncements(),
    ])
    const fallbackEvents = getActiveAdapterName() === 'supabase' ? [] : eventTemplates
    const usableEventConfigs = nextEventConfigs.length > 0 ? nextEventConfigs : fallbackEvents

    setEventConfigs(usableEventConfigs)
    setRegistrations(nextRegistrations)
    setAnnouncements(nextAnnouncements)
    setSelectedRegistrationId((currentId) => {
      if (
        currentId &&
        nextRegistrations.some(
          (registration) => registration.id === currentId && registration.eventId === eventId,
        )
      ) {
        return currentId
      }

      return (
        nextRegistrations.find(
          (registration) =>
            registration.eventId === eventId && registration.status === 'pending_review',
        )?.id ??
        nextRegistrations.find((registration) => registration.eventId === eventId)?.id
      )
    })
    onDataChange?.()
  }, [onDataChange, selectedEvent.id])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void reloadAdminData(selectedEventId)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [reloadAdminData, selectedEventId])

  const handleSelectEvent = (eventId: string) => {
    onSelectEvent(eventId)
    void eventService.setCurrentEventId(eventId)
    const nextRegistration = registrations.find(
      (registration) => registration.eventId === eventId,
    )
    setSelectedRegistrationId(nextRegistration?.id)
    setFilter('all')
    setCheckinFilter('all')
    setExecutionFilter('all')
    setAnnouncementFilter('all')
    setSearchKeyword('')
    setCheckinSearchKeyword('')
    setExecutionSearchKeyword('')
    setAnnouncementSearchKeyword('')
  }

  const refreshRegistrations = async (nextRegistrations?: Registration[]) => {
    setRegistrations(nextRegistrations ?? (await registrationService.getRegistrations()))
    onDataChange?.()
  }

  const handleResetDemoData = () => {
    if (!selectedEvent) {
      return
    }

    void registrationService.resetRegistrations().then(() => reloadAdminData(selectedEvent.id))
  }

  return (
    <AnimatedPage className="space-y-6">
      <SectionCard variant="command" className="ee-grid-overlay">
        <PageHeader
          tone="dark"
          eyebrow="管理端"
          title="赛事运营工作台"
          description="用一个移动端友好的工作台串联报名审核、签到检录、现场执行、通知公告和数据复盘。"
          action={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-200 sm:w-80">
              当前赛事
              <select
                value={selectedEvent?.id ?? ''}
                onChange={(event) => handleSelectEvent(event.target.value)}
                className="h-11 rounded-2xl border border-cyan-200/25 bg-slate-950/70 px-3 text-sm text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
              >
                {eventConfigs.map((eventConfig) => (
                  <option key={eventConfig.id} value={eventConfig.id}>
                    {eventConfig.name}
                  </option>
                ))}
              </select>
            </label>
            {devToolsEnabled && (
              <PrimaryButton variant="ghost" onClick={handleResetDemoData}>
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                重置本地开发数据
              </PrimaryButton>
            )}
          </div>
          }
        />
      </SectionCard>

      {!selectedEvent ? (
        <EmptyState
          title="暂无可管理赛事"
          description="云端数据模式下需要先在 Supabase 中创建或 seed 赛事数据。"
        />
      ) : (
      <>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <SoftCommandCard
          active={adminSection === 'review'}
          description="规则校验、资料检查、通过或驳回。"
          icon={<ClipboardCheck className="h-5 w-5" aria-hidden="true" />}
          index="01"
          onClick={() => setAdminSection('review')}
          status="Review"
          title="审核工作台"
          value={adminMetrics.pendingReview}
        />
        <SoftCommandCard
          active={adminSection === 'checkin'}
          description="输入检录码，完成签到和出发。"
          icon={<QrCode className="h-5 w-5" aria-hidden="true" />}
          index="02"
          onClick={() => setAdminSection('checkin')}
          status="Check-in"
          title="签到检录"
          value={adminMetrics.checkin}
        />
        <SoftCommandCard
          active={adminSection === 'execution'}
          description="跟踪队伍进度、点位任务和异常关注。"
          icon={<RadioTower className="h-5 w-5" aria-hidden="true" />}
          index="03"
          onClick={() => setAdminSection('execution')}
          status="Live"
          title="现场执行"
          value={adminMetrics.execution}
        />
        <SoftCommandCard
          active={adminSection === 'announcements'}
          description="发布定向通知，查看确认网络。"
          icon={<Bell className="h-5 w-5" aria-hidden="true" />}
          index="04"
          onClick={() => setAdminSection('announcements')}
          status="Confirm"
          title="通知公告"
          value={announcements.filter((announcement) => announcement.eventId === selectedEvent.id).length}
        />
        <SoftCommandCard
          active={adminSection === 'analytics'}
          description="复盘报名、检录、点位和通知数据。"
          icon={<BarChart3 className="h-5 w-5" aria-hidden="true" />}
          index="05"
          onClick={() => setAdminSection('analytics')}
          status="Review"
          title="数据复盘"
          value={adminMetrics.registered}
        />
        <SoftCommandCard
          description="解释状态、生成通知草稿和总结赛事。"
          icon={<Bot className="h-5 w-5" aria-hidden="true" />}
          index="06"
          status="Alpha"
          title="AI 助手"
          value={adminMetrics.attention}
        />
      </div>

      <AiTerminalPanel />

      <ModuleNav
        activeId={adminSection}
        ariaLabel="管理端模块导航"
        items={adminNavItems}
        onChange={setAdminSection}
      />

      {adminSection === 'review' && (
        <>
          <AdminDashboard registrations={eventRegistrations} />

          <div className="grid gap-6 xl:grid-cols-[1fr_520px]">
            <SectionCard title="报名列表" description="按当前赛事过滤，可筛选状态和搜索报名。">
              <RegistrationReviewList
                eventConfig={selectedEvent}
                filter={filter}
                registrations={eventRegistrations}
                searchKeyword={searchKeyword}
                selectedRegistrationId={selectedRegistration?.id}
                onFilterChange={setFilter}
                onSearchChange={setSearchKeyword}
                onSelectRegistration={setSelectedRegistrationId}
              />
            </SectionCard>

            <RegistrationReviewDetail
              eventConfig={selectedEvent}
              registration={selectedRegistration}
              onApprove={() => {
                if (!selectedRegistration) {
                  return
                }
                void reviewService
                  .approveRegistration(selectedRegistration.id)
                  .then(refreshRegistrations)
              }}
              onReject={(reason) => {
                if (!selectedRegistration) {
                  return
                }
                void reviewService
                  .rejectRegistration(selectedRegistration.id, reason)
                  .then(refreshRegistrations)
              }}
              onMarkRegistered={() => {
                if (!selectedRegistration) {
                  return
                }
                void reviewService
                  .markRegistrationAsRegistered(selectedRegistration.id)
                  .then(refreshRegistrations)
              }}
            />
          </div>
        </>
      )}

      {adminSection === 'checkin' && (
        <CheckinManagementPage
          eventConfig={selectedEvent}
          filter={checkinFilter}
          registrations={registrations}
          searchKeyword={checkinSearchKeyword}
          onCheckIn={(registrationId) =>
            void checkinService.checkInRegistration(registrationId).then(refreshRegistrations)
          }
          onDepart={(registrationId) =>
            void checkinService
              .markRegistrationDeparted(registrationId)
              .then(refreshRegistrations)
          }
          onFilterChange={setCheckinFilter}
          onSearchChange={setCheckinSearchKeyword}
        />
      )}

      {adminSection === 'execution' && (
        <ExecutionManagementPage
          eventConfig={selectedEvent}
          filter={executionFilter}
          registrations={registrations}
          searchKeyword={executionSearchKeyword}
          onApproveCheckpoint={(registrationId, checkpointId) =>
            void checkpointService
              .approveCheckpointTask(registrationId, checkpointId)
              .then(refreshRegistrations)
          }
          onMarkAttention={(registrationId, reason) =>
            void checkpointService
              .markRegistrationAttentionNeeded(registrationId, reason)
              .then(refreshRegistrations)
          }
          onClearAttention={(registrationId, reason) =>
            void checkpointService
              .clearRegistrationAttention(registrationId, reason)
              .then(refreshRegistrations)
          }
          onMarkFinished={(registrationId) =>
            void checkpointService
              .markRegistrationFinished(registrationId)
              .then(refreshRegistrations)
          }
          onFilterChange={setExecutionFilter}
          onSearchChange={setExecutionSearchKeyword}
        />
      )}

      {adminSection === 'announcements' && (
        <AnnouncementManagementPage
          announcements={announcements}
          eventConfig={selectedEvent}
          filter={announcementFilter}
          registrations={registrations}
          searchKeyword={announcementSearchKeyword}
          onCreateDraft={(input) =>
            void announcementService.createAnnouncement(input).then(setAnnouncements)
          }
          onDeleteDraft={(announcementId) =>
            void announcementService
              .deleteDraftAnnouncement(announcementId)
              .then(setAnnouncements)
          }
          onFilterChange={setAnnouncementFilter}
          onPublish={(announcementId) =>
            void announcementService.publishAnnouncement(announcementId).then(setAnnouncements)
          }
          onSearchChange={setAnnouncementSearchKeyword}
        />
      )}

      {adminSection === 'analytics' && (
        <ReviewDashboardPage
          announcements={announcements}
          eventConfig={selectedEvent}
          registrations={registrations}
        />
      )}
      </>
      )}
    </AnimatedPage>
  )
}
