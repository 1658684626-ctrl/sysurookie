import { useCallback, useEffect, useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { AnimatedPage } from '../../components/common/AnimatedPage'
import { BottomAppNav } from '../../components/common/BottomAppNav'
import { EmptyState } from '../../components/common/EmptyState'
import { EventPassCard } from '../../components/common/EventPassCard'
import { HealthSignalPreview } from '../../components/common/HealthSignalPreview'
import { MotionStatCard } from '../../components/common/MotionStatCard'
import { PageHeader } from '../../components/common/PageHeader'
import { PixelCopilot } from '../../components/common/PixelCopilot'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import { RequirementList } from '../../components/common/RequirementList'
import { SectionCard } from '../../components/common/SectionCard'
import { StepIndicator } from '../../components/common/StepIndicator'
import { StatusBadge } from '../../components/common/StatusBadge'
import { eventTemplates } from '../../data/eventTemplates'
import type { EventConfig } from '../../types/event'
import type { Announcement } from '../../types/announcement'
import type { Member, Registration } from '../../types/registration'
import { getUnconfirmedAnnouncementsForRegistration } from '../../utils/announcements'
import { getCheckinCode } from '../../utils/checkin'
import {
  getCheckinStatusLabel,
  getMissingRequirements,
  getRegistrationStatusLabel,
} from '../../utils/statusFlow'
import {
  announcementService,
  checkpointService,
  eventService,
  registrationService,
} from '../../services'
import { getActiveAdapterName, isDevToolsEnabled } from '../../services/serviceClient'
import { getEventRoleTypeOptions } from '../../utils/validators'
import { AnnouncementCenterPage } from './AnnouncementCenterPage'
import { CheckpointTaskPage } from './CheckpointTaskPage'
import { EventDetailPage } from './EventDetailPage'
import { MemberEditorPage } from './MemberEditorPage'
import { RegistrationStartPage } from './RegistrationStartPage'
import { RegistrationStatusPage } from './RegistrationStatusPage'

type ParticipantStep =
  | 'events'
  | 'detail'
  | 'start'
  | 'members'
  | 'status'
  | 'checkpoints'
  | 'announcements'

const participantSteps = [
  { id: 'events', label: '选择赛事' },
  { id: 'detail', label: '赛事详情' },
  { id: 'start', label: '创建报名' },
  { id: 'members', label: '成员资料' },
  { id: 'status', label: '报名状态' },
  { id: 'checkpoints', label: '点位打卡' },
  { id: 'announcements', label: '通知公告' },
]

const modeLabels = {
  team: '队伍报名',
  individual: '个人报名',
}

export function ParticipantHome() {
  const activeAdapterName = getActiveAdapterName()
  const localFallbackEvents = activeAdapterName === 'supabase' ? [] : eventTemplates
  const [eventConfigs, setEventConfigs] = useState<EventConfig[]>(localFallbackEvents)
  const [selectedEventId, setSelectedEventId] = useState(eventTemplates[0].id)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [step, setStep] = useState<ParticipantStep>('events')
  const [selectedProjectId, setSelectedProjectId] = useState(
    () =>
      eventTemplates[0].projects[0].id,
  )
  const [currentRegistrationId, setCurrentRegistrationId] = useState<string | null>(null)
  const devToolsEnabled = isDevToolsEnabled()

  const selectedEvent =
    eventConfigs.find((event) => event.id === selectedEventId) ??
    eventConfigs[0] ??
    localFallbackEvents[0]
  const currentRegistration = currentRegistrationId
    ? registrations.find((registration) => registration.id === currentRegistrationId)
    : undefined
  const eventRegistrations = useMemo(
    () =>
      selectedEvent
        ? registrations.filter(
            (registration) => registration.eventId === selectedEvent.id,
          )
        : [],
    [registrations, selectedEvent],
  )
  const featuredRegistration = currentRegistration ?? eventRegistrations[0]
  const featuredProject = featuredRegistration
    ? selectedEvent?.projects.find((project) => project.id === featuredRegistration.projectId)
    : undefined
  const featuredUnreadCount = featuredRegistration
    ? getUnconfirmedAnnouncementsForRegistration(announcements, featuredRegistration).length
    : 0

  const reloadParticipantData = useCallback(async () => {
    const [
      nextEventConfigs,
      currentEventId,
      nextRegistrations,
      nextAnnouncements,
    ] = await Promise.all([
      eventService.getEventTemplates(),
      eventService.getCurrentEventId(),
      registrationService.getRegistrations(),
      announcementService.getAnnouncements(),
    ])
    const fallbackEvents = getActiveAdapterName() === 'supabase' ? [] : eventTemplates
    const usableEventConfigs = nextEventConfigs.length > 0 ? nextEventConfigs : fallbackEvents
    const currentEvent =
      usableEventConfigs.find((event) => event.id === currentEventId) ??
      usableEventConfigs[0]

    if (!currentEvent) {
      setEventConfigs([])
      setSelectedEventId('')
      setRegistrations(nextRegistrations)
      setAnnouncements(nextAnnouncements)
      return
    }

    setEventConfigs(usableEventConfigs)
    setSelectedEventId(currentEvent.id)
    setSelectedProjectId((currentProjectId) =>
      currentEvent.projects.some((project) => project.id === currentProjectId)
        ? currentProjectId
        : currentEvent.projects[0]?.id ?? '',
    )
    setRegistrations(nextRegistrations)
    setAnnouncements(nextAnnouncements)
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void reloadParticipantData()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [reloadParticipantData])

  const handleSelectEvent = (eventConfig: EventConfig) => {
    setSelectedEventId(eventConfig.id)
    void eventService.setCurrentEventId(eventConfig.id)
    setSelectedProjectId(eventConfig.projects[0]?.id ?? '')
    setCurrentRegistrationId(null)
    setStep('detail')
  }

  const handleSaveRegistration = async (registration: Registration) => {
    setRegistrations(await registrationService.updateRegistration(registration))
    setCurrentRegistrationId(registration.id)
  }

  const handleCreateRegistration = (
    registrationDraft: Pick<
      Registration,
      'teamName' | 'captainName' | 'captainPhone'
    >,
  ) => {
    if (!selectedEvent) {
      return
    }
    const roleType = getEventRoleTypeOptions(selectedEvent)[0]
    const now = new Date().toISOString()
    const initialMember =
      selectedEvent.registrationMode === 'team'
        ? createMemberFromCaptain(roleType, selectedEvent, registrationDraft)
        : createBlankMember(roleType, selectedEvent)
    const registration: Registration = {
      id: crypto.randomUUID(),
      eventId: selectedEvent.id,
      projectId: selectedProjectId,
      mode: selectedEvent.registrationMode,
      teamName: registrationDraft.teamName,
      captainName: registrationDraft.captainName,
      captainPhone: registrationDraft.captainPhone,
      members: [initialMember],
      status: 'draft',
      checkinStatus: 'not_checked_in',
      executionStatus: 'not_started',
      checkpointProgress: [],
      announcementsConfirmed: [],
      auditLogs: [],
      createdAt: now,
      updatedAt: now,
    }

    void registrationService.createRegistration(registration).then(setRegistrations)
    setCurrentRegistrationId(registration.id)
    setStep('members')
  }

  const handleSubmitReview = () => {
    if (!currentRegistration) {
      return
    }

    void registrationService
      .submitRegistrationForReview(currentRegistration.id)
      .then((nextRegistrations) => {
        setRegistrations(nextRegistrations)
        setStep('status')
      })
  }

  const handleResetDemoData = () => {
    void registrationService.resetRegistrations().then(() => reloadParticipantData())
    setCurrentRegistrationId(null)
    setStep('events')
  }

  const refreshRegistrations = async (nextRegistrations?: Registration[]) => {
    setRegistrations(nextRegistrations ?? (await registrationService.getRegistrations()))
  }

  const refreshAnnouncements = async (nextAnnouncements?: Announcement[]) => {
    setAnnouncements(nextAnnouncements ?? (await announcementService.getAnnouncements()))
  }

  const handleEnterCheckpoints = () => {
    if (!currentRegistration) {
      return
    }

    void checkpointService
      .initializeCheckpointProgress(currentRegistration.id)
      .then(refreshRegistrations)
    setStep('checkpoints')
  }

  return (
    <AnimatedPage className="space-y-6">
      <SectionCard variant="glow" className="ee-grid-overlay">
        <PageHeader
          tone="light"
          eyebrow="我的赛事"
          title="今天要完成什么？"
          description="查看报名、签到、通知和点位任务，下一步行动会在这里聚合。"
          action={
            devToolsEnabled ? (
              <PrimaryButton tone="secondary" onClick={handleResetDemoData}>
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                重置本机数据
              </PrimaryButton>
            ) : undefined
          }
        />
      </SectionCard>

      {selectedEvent && featuredRegistration && (
        <EventPassCard
          checkinStatus={getCheckinStatusLabel(featuredRegistration.checkinStatus)}
          code={featuredRegistration.status === 'registered' ? getCheckinCode(featuredRegistration) : undefined}
          eventName={selectedEvent.name}
          nextAction={getParticipantNextAction(featuredRegistration)}
          onAiHelper={() => setStep('status')}
          projectName={featuredProject?.name ?? '未选择项目'}
          registrationName={
            featuredRegistration.teamName ||
            featuredRegistration.captainName ||
            `${selectedEvent.shortName}个人报名`
          }
          registrationStatus={getRegistrationStatusLabel(featuredRegistration.status)}
          unreadNoticeCount={featuredUnreadCount}
        />
      )}

      {selectedEvent && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MotionStatCard
            label="Entries"
            progress={Math.min(eventRegistrations.length * 18, 100)}
            tone="olive"
            trend="我的赛事记录"
            value={eventRegistrations.length}
          />
          <MotionStatCard
            label="Unread"
            progress={featuredUnreadCount > 0 ? 68 : 8}
            tone="yellow"
            trend="待确认通知"
            value={featuredUnreadCount}
          />
          <MotionStatCard
            label="Progress"
            progress={48}
            tone="acid"
            trend="已通过点位"
            unit="cp"
            value={featuredRegistration?.checkpointProgress.filter((item) => item.status === 'approved').length ?? 0}
          />
          <MotionStatCard
            label="Mode"
            progress={76}
            tone="blue"
            trend="报名模式"
            value={selectedEvent.registrationMode === 'team' ? 'TEAM' : 'SOLO'}
          />
        </div>
      )}

      <StepIndicator currentStepId={step} steps={participantSteps} />

      {!selectedEvent ? (
        <EmptyState
          title="暂无可报名赛事"
          description="当前还没有开放赛事，请稍后再查看。"
        />
      ) : (
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <SectionCard title={getStepTitle(step)}>{renderStepContent()}</SectionCard>
        <ParticipantSidebar
          eventConfig={selectedEvent}
          registrations={eventRegistrations}
          currentRegistration={currentRegistration}
          onPickRegistration={(registration) => {
            setCurrentRegistrationId(registration.id)
            setSelectedProjectId(registration.projectId)
            setStep('status')
          }}
        />
      </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <PixelCopilot compact />
        <HealthSignalPreview />
      </div>
      <BottomAppNav
        activeId={
          step === 'events' || step === 'detail' || step === 'start'
            ? 'events'
            : step === 'checkpoints'
              ? 'tasks'
              : step === 'announcements'
                ? 'notices'
                : 'home'
        }
        onChange={(navId) => {
          if (navId === 'events') setStep('events')
          if (navId === 'tasks' && currentRegistration) setStep('checkpoints')
          if (navId === 'notices' && currentRegistration) setStep('announcements')
          if (navId === 'home' || navId === 'mine') setStep(currentRegistration ? 'status' : 'events')
        }}
      />
    </AnimatedPage>
  )

  function renderStepContent() {
    if (step === 'events') {
      return (
        <div className="grid gap-4">
          {eventConfigs.map((eventConfig) => (
            <button
              key={eventConfig.id}
              type="button"
              onClick={() => handleSelectEvent(eventConfig)}
              className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/88 p-4 text-left shadow-sm shadow-slate-950/10 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_0_36px_rgba(34,211,238,0.16)]"
            >
              <div className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-gradient-to-br from-emerald-300/35 to-cyan-400/20 blur-2xl transition group-hover:scale-125" />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-950">{eventConfig.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {eventConfig.date} · {eventConfig.location}
                  </p>
                </div>
                <StatusBadge label={modeLabels[eventConfig.registrationMode]} tone="info" />
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                <span>项目：{eventConfig.projects.length} 个</span>
                <span>点位：{eventConfig.checkpoints.length} 个</span>
                <span>材料规则：{eventConfig.materialRules.length} 条</span>
              </div>
            </button>
          ))}
        </div>
      )
    }

    if (step === 'detail') {
      return (
        <EventDetailPage
          eventConfig={selectedEvent}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
          onStartRegistration={() => setStep('start')}
        />
      )
    }

    if (step === 'start') {
      return (
        <RegistrationStartPage
          eventConfig={selectedEvent}
          projectId={selectedProjectId}
          onCreateRegistration={handleCreateRegistration}
        />
      )
    }

    if (step === 'members') {
      if (!currentRegistration) {
        return (
          <EmptyState
            title="还没有报名记录"
            description="请先选择项目并创建报名。"
          />
        )
      }

      return (
        <MemberEditorPage
          eventConfig={selectedEvent}
          registration={currentRegistration}
          onSaveRegistration={handleSaveRegistration}
          onReviewStatus={() => setStep('status')}
        />
      )
    }

    if (!currentRegistration) {
      return (
        <EmptyState
          title="请选择报名记录"
          description="你可以从右侧报名记录中继续查看或编辑。"
        />
      )
    }

    if (step === 'checkpoints') {
      return (
        <CheckpointTaskPage
          eventConfig={selectedEvent}
          registration={currentRegistration}
          onBack={() => setStep('status')}
          onMarkArrived={(checkpointId) =>
            void checkpointService
              .markCheckpointArrived(currentRegistration.id, checkpointId)
              .then(refreshRegistrations)
          }
          onSubmitTask={(checkpointId, payload) =>
            void checkpointService
              .submitCheckpointTask(currentRegistration.id, checkpointId, payload)
              .then(refreshRegistrations)
          }
        />
      )
    }

    if (step === 'announcements') {
      return (
        <AnnouncementCenterPage
          announcements={announcements}
          eventConfig={selectedEvent}
          registration={currentRegistration}
          onBack={() => setStep('status')}
          onConfirm={(announcementId) =>
            void announcementService
              .confirmAnnouncementRead(
                announcementId,
                currentRegistration.id,
                currentRegistration.teamName || currentRegistration.captainName || '参赛者',
              )
              .then(refreshAnnouncements)
          }
        />
      )
    }

    return (
      <RegistrationStatusPage
        eventConfig={selectedEvent}
        registration={currentRegistration}
        unconfirmedAnnouncementCount={
          getUnconfirmedAnnouncementsForRegistration(announcements, currentRegistration)
            .length
        }
        onEnterCheckpoints={handleEnterCheckpoints}
        onEditMembers={() => setStep('members')}
        onOpenAnnouncements={() => setStep('announcements')}
        onSubmitReview={handleSubmitReview}
      />
    )
  }
}

function ParticipantSidebar({
  eventConfig,
  registrations,
  currentRegistration,
  onPickRegistration,
}: {
  eventConfig: EventConfig
  registrations: Registration[]
  currentRegistration?: Registration
  onPickRegistration: (registration: Registration) => void
}) {
  const missingRequirements = currentRegistration
    ? getMissingRequirements(currentRegistration, eventConfig)
    : []

  return (
    <aside className="space-y-4">
      <SectionCard title="当前赛事">
        <div className="space-y-3 text-sm">
          <p className="font-semibold text-slate-950">{eventConfig.name}</p>
          <p className="text-slate-500">{eventConfig.location}</p>
          <StatusBadge label={modeLabels[eventConfig.registrationMode]} tone="info" />
        </div>
      </SectionCard>

      <SectionCard title="我的报名记录">
        {registrations.length === 0 ? (
          <EmptyState title="暂无报名" description="创建报名后会显示在这里。" />
        ) : (
          <div className="space-y-2">
            {registrations.map((registration) => (
              <button
                key={registration.id}
                type="button"
                onClick={() => onPickRegistration(registration)}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  currentRegistration?.id === registration.id
                    ? 'border-cyan-200/50 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-700 text-white shadow-[0_0_28px_rgba(34,211,238,0.18)]'
                    : 'border-slate-200 bg-white/84 text-slate-900 hover:border-cyan-200 hover:bg-cyan-50/70'
                }`}
              >
                <p className="text-sm font-semibold">
                  {registration.teamName ||
                    registration.captainName ||
                    `${eventConfig.shortName}个人报名`}
                </p>
                <p
                  className={`mt-1 text-xs ${
                    currentRegistration?.id === registration.id
                      ? 'text-slate-300'
                      : 'text-slate-500'
                  }`}
                >
                  {getRegistrationStatusLabel(registration.status)} ·{' '}
                  {registration.members.length} 人
                </p>
              </button>
            ))}
          </div>
        )}
      </SectionCard>

      {currentRegistration && (
        <SectionCard title="规则核验">
          <RequirementList missingRequirements={missingRequirements} />
        </SectionCard>
      )}
    </aside>
  )
}

function getStepTitle(step: ParticipantStep): string {
  const labels: Record<ParticipantStep, string> = {
    events: '赛事选择页',
    detail: '赛事详情页',
    start: '报名入口页',
    members: '成员资料管理页',
    status: '报名状态页',
    checkpoints: '点位打卡页',
    announcements: '通知公告页',
  }

  return labels[step]
}

function getParticipantNextAction(registration: Registration): string {
  if (registration.status === 'draft' || registration.status === 'incomplete') {
    return '完善成员资料'
  }
  if (registration.status === 'pending_review') {
    return '等待资料审核'
  }
  if (registration.status === 'rejected') {
    return '查看驳回原因'
  }
  if (registration.status === 'approved') {
    return '等待确认为正式报名'
  }
  if (registration.checkinStatus === 'not_checked_in') {
    return '准备现场检录'
  }
  if (registration.checkinStatus === 'checked_in') {
    return '等待出发'
  }
  if (registration.executionStatus === 'finished') {
    return '查看完赛状态'
  }
  return '进入点位任务'
}

function createBlankMember(roleType: string, eventConfig: EventConfig): Member {
  const roleField = eventConfig.memberFields.find((field) =>
    field.options?.includes(roleType),
  )

  return {
    id: crypto.randomUUID(),
    name: '',
    phone: '',
    roleType,
    formData: roleField ? { [roleField.key]: roleType } : {},
    materials: [],
  }
}

function createMemberFromCaptain(
  roleType: string,
  eventConfig: EventConfig,
  registrationDraft: Pick<
    Registration,
    'teamName' | 'captainName' | 'captainPhone'
  >,
): Member {
  return {
    ...createBlankMember(roleType, eventConfig),
    name: registrationDraft.captainName ?? '',
    phone: registrationDraft.captainPhone ?? '',
  }
}
