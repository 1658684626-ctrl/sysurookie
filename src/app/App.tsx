import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Activity,
  Bell,
  ClipboardCheck,
  LayoutDashboard,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { AnimatedPage } from '../components/common/AnimatedPage'
import { AppLogo } from '../components/common/AppLogo'
import { AppShell } from '../components/common/AppShell'
import { EmptyState } from '../components/common/EmptyState'
import { MetricCard } from '../components/common/MetricCard'
import { SectionCard } from '../components/common/SectionCard'
import { StatusBadge } from '../components/common/StatusBadge'
import { eventTemplates } from '../data/eventTemplates'
import { AdminHome } from '../pages/admin/AdminHome'
import { AiAssistantPage } from '../pages/assistant/AiAssistantPage'
import { ParticipantHome } from '../pages/participant/ParticipantHome'
import { ProfilePage } from '../pages/profile/ProfilePage'
import { eventService, registrationService } from '../services'
import { getActiveAdapterName } from '../services/serviceClient'
import type { EventConfig } from '../types/event'
import type { Registration } from '../types/registration'
import {
  getCheckpointSummary,
  getDashboardSummary,
  getRegistrationStatusLabel,
} from '../utils/statusFlow'

type AppTab = 'home' | 'registrations' | 'assistant' | 'admin' | 'profile'

const modeLabels = {
  team: '队伍报名',
  individual: '个人报名',
}

function App() {
  const activeAdapterName = getActiveAdapterName()
  const localFallbackEvents = activeAdapterName === 'supabase' ? [] : eventTemplates
  const [eventConfigs, setEventConfigs] = useState<EventConfig[]>(localFallbackEvents)
  const [selectedEventId, setSelectedEventId] = useState(eventTemplates[0].id)
  const [activeTab, setActiveTab] = useState<AppTab>('home')
  const [registrations, setRegistrations] = useState<Registration[]>([])

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

  const dashboardSummary = useMemo(
    () => getDashboardSummary(eventRegistrations),
    [eventRegistrations],
  )

  const checkpointSummary = useMemo(
    () =>
      selectedEvent
        ? getCheckpointSummary(registrations, selectedEvent)
        : [],
    [registrations, selectedEvent],
  )

  const sampleRegistration = eventRegistrations[0]

  const reloadAppData = useCallback(async () => {
    const [nextEventConfigs, currentEventId, nextRegistrations] = await Promise.all([
      eventService.getEventTemplates(),
      eventService.getCurrentEventId(),
      registrationService.getRegistrations(),
    ])
    const fallbackEvents = getActiveAdapterName() === 'supabase' ? [] : eventTemplates
    const usableEventConfigs = nextEventConfigs.length > 0 ? nextEventConfigs : fallbackEvents
    const safeEventId = usableEventConfigs.some((event) => event.id === currentEventId)
      ? currentEventId
      : usableEventConfigs[0]?.id ?? ''

    setEventConfigs(usableEventConfigs)
    setSelectedEventId(safeEventId)
    setRegistrations(nextRegistrations)
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void reloadAppData()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [reloadAppData])

  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId)
    void eventService.setCurrentEventId(eventId)
  }

  return (
    <AppShell>
      <header className="relative overflow-hidden rounded-[2.25rem] border border-[var(--ee-line)] bg-[#F8F6EF]/88 p-5 text-[var(--ee-text)] ee-card-shadow backdrop-blur-xl sm:p-7">
        <div className="absolute inset-0 ee-grid-overlay opacity-30" />
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#B6FF4D]/32 blur-3xl" />
        <div className="absolute -bottom-24 left-20 h-72 w-72 rounded-full bg-[#A8BAC5]/24 blur-3xl" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <AppLogo />
            <div className="font-mono-ui mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--ee-line)] bg-[#E3E8DA]/72 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ee-muted)]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Soft Editorial Sport OS
            </div>
            <h1 className="font-editorial mt-5 max-w-4xl text-5xl font-semibold leading-[0.9] tracking-[-0.07em] text-[var(--ee-text)] sm:text-7xl">
              EasyEvent Event OS
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--ee-muted)]">
              易赛通把报名、审核、检录、点位、通知和复盘变成一张实时赛事通行图。适合城市定向、校园跑、球赛、团建和越野活动。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <HeroPill icon={<MapPinned className="h-4 w-4" />} label="今日赛事" />
              <HeroPill icon={<ClipboardCheck className="h-4 w-4" />} label="报名与审核" />
              <HeroPill icon={<Activity className="h-4 w-4" />} label="现场状态" />
            </div>
          </div>

          <label className="flex w-full flex-col gap-2 rounded-[2rem] border border-[var(--ee-line)] bg-white/62 p-4 text-sm font-medium text-[var(--ee-muted)] backdrop-blur lg:w-96">
            选择赛事
            <select
              value={selectedEvent?.id ?? ''}
              onChange={(event) => handleEventChange(event.target.value)}
              className="h-12 rounded-2xl border border-[var(--ee-line)] bg-[#F8F6EF] px-3 text-sm text-[var(--ee-text)] outline-none transition focus:border-[#6C765F] focus:ring-2 focus:ring-[#B6FF4D]/30"
            >
              {eventConfigs.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <nav className="sticky top-[calc(0.5rem+env(safe-area-inset-top))] z-20 grid grid-cols-2 gap-2 rounded-[2rem] border border-[var(--ee-line)] bg-[#F8F6EF]/82 p-1.5 shadow-[0_18px_60px_rgba(51,70,45,0.14)] backdrop-blur-xl sm:grid-cols-5">
        <TabButton
          active={activeTab === 'home'}
          label="赛事大厅"
          onClick={() => setActiveTab('home')}
        />
        <TabButton
          active={activeTab === 'registrations'}
          label="我的报名"
          onClick={() => setActiveTab('registrations')}
        />
        <TabButton
          active={activeTab === 'assistant'}
          label="AI 助手"
          onClick={() => setActiveTab('assistant')}
        />
        <TabButton
          active={activeTab === 'admin'}
          label="管理后台"
          onClick={() => {
            void reloadAppData()
            setActiveTab('admin')
          }}
        />
        <TabButton
          active={activeTab === 'profile'}
          label="我的"
          onClick={() => setActiveTab('profile')}
        />
      </nav>

      {!selectedEvent ? (
        <EmptyState
          title="暂无可用赛事"
          description="云端数据模式下需要先在 Supabase 中创建或 seed 赛事数据。"
        />
      ) : activeTab === 'home' && (
        <AnimatedPage>
          <AppHome
            selectedEvent={selectedEvent}
            dashboardSummary={dashboardSummary}
            checkpointSummary={checkpointSummary}
            sampleRegistration={sampleRegistration}
          />
        </AnimatedPage>
      )}

      {selectedEvent && activeTab === 'registrations' && <ParticipantHome />}

      {selectedEvent && activeTab === 'assistant' && (
        <AiAssistantPage selectedEvent={selectedEvent} registrations={eventRegistrations} />
      )}

      {selectedEvent && activeTab === 'admin' && (
        <AdminHome
          selectedEventId={selectedEvent.id}
          onDataChange={() => void reloadAppData()}
          onSelectEvent={handleEventChange}
        />
      )}

      {activeTab === 'profile' && <ProfilePage />}

      <footer className="flex flex-wrap items-center gap-3 pb-4 text-sm text-slate-400">
        <FooterItem icon={<ClipboardCheck className="h-4 w-4" />} label="规则核验" />
        <FooterItem icon={<ShieldCheck className="h-4 w-4" />} label="审核状态" />
        <FooterItem icon={<Activity className="h-4 w-4" />} label="现场执行" />
        <FooterItem icon={<Bell className="h-4 w-4" />} label="通知确认" />
      </footer>
    </AppShell>
  )
}

function AppHome({
  selectedEvent,
  dashboardSummary,
  checkpointSummary,
  sampleRegistration,
}: {
  selectedEvent: EventConfig
  dashboardSummary: ReturnType<typeof getDashboardSummary>
  checkpointSummary: ReturnType<typeof getCheckpointSummary>
  sampleRegistration?: Registration
}) {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="报名总数" value={dashboardSummary.totalRegistrations} highlight tone="cyan" />
        <MetricCard label="待完善" value={dashboardSummary.incompleteCount} tone="amber" />
        <MetricCard label="待审核" value={dashboardSummary.pendingReviewCount} tone="violet" />
        <MetricCard label="已签到" value={dashboardSummary.checkedInCount} tone="emerald" />
        <MetricCard label="异常关注" value={dashboardSummary.attentionNeededCount} tone="rose" />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          variant="glow"
          title="今日赛事"
          description="查看当前开放赛事、报名方式和现场运营概况。"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem label="赛事名称" value={selectedEvent.name} />
            <InfoItem label="组织方" value={selectedEvent.organizer} />
            <InfoItem label="赛事时间" value={selectedEvent.date} />
            <InfoItem label="赛事地点" value={selectedEvent.location} />
            <InfoItem label="报名模式" value={modeLabels[selectedEvent.registrationMode]} />
            <InfoItem label="签到方式" value={modeLabels[selectedEvent.checkinMode]} />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <CountTile label="项目数量" value={selectedEvent.projects.length} />
            <CountTile label="点位数量" value={selectedEvent.checkpoints.length} />
            <CountTile label="材料规则" value={selectedEvent.materialRules.length} />
          </div>
        </SectionCard>

        <SectionCard variant="command" title="快捷入口" description="从这里进入报名、检录、通知和运营工作台。">
          <PlaceholderView
            icon={<Users className="h-5 w-5" aria-hidden="true" />}
            title="我的报名"
            items={['选择赛事', '创建报名', '成员资料', '提交审核']}
          />
          <div className="mt-4 border-t border-slate-200 pt-4">
            <PlaceholderView
              icon={<LayoutDashboard className="h-5 w-5" aria-hidden="true" />}
              title="管理后台"
              items={['报名审核', '签到检录', '现场执行', '通知公告', '数据复盘']}
            />
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="我的下一步" description="根据报名状态提示下一步行动。">
          {sampleRegistration ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-4">
                <div>
                  <p className="font-medium text-slate-950">
                    {sampleRegistration.teamName ??
                      sampleRegistration.captainName ??
                      '个人报名'}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedEvent.projects.find(
                      (project) => project.id === sampleRegistration.projectId,
                    )?.name ?? '未选择项目'}
                  </p>
                </div>
                <StatusBadge
                  label={getRegistrationStatusLabel(sampleRegistration.status)}
                  tone={sampleRegistration.status === 'registered' ? 'success' : 'info'}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <CountTile label="报名成功" value={dashboardSummary.registeredCount} />
                <CountTile label="进行中" value={dashboardSummary.inProgressCount} />
                <CountTile label="已完赛" value={dashboardSummary.finishedCount} />
              </div>
            </div>
          ) : (
            <EmptyState title="暂无报名数据" description="可在参赛者端创建报名。" />
          )}
        </SectionCard>

        <SectionCard title="现场点位" description="查看点位到达、任务提交和通过情况。">
          <div className="space-y-3">
            {checkpointSummary.map((checkpoint) => (
              <div
                key={checkpoint.checkpointId}
                className="rounded-2xl border border-slate-200/80 bg-white/70 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{checkpoint.checkpointName}</p>
                  <StatusBadge label="进度统计" tone="neutral" />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                  <MiniStat label="已到达" value={checkpoint.arrivedCount} />
                  <MiniStat label="已提交" value={checkpoint.submittedCount} />
                  <MiniStat label="已通过" value={checkpoint.approvedCount} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard variant="command" title="赛事能力">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            '报名审核',
            '签到检录',
            '现场执行',
            '通知确认',
            '数据复盘',
            'AI 助手',
          ].map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-semibold text-emerald-700">
                {index + 1}
              </div>
              <span className="text-sm font-medium text-slate-800">{item}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  )
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-xl px-3 py-2 text-sm font-semibold transition ${
        active
          ? 'bg-[var(--ee-deep-olive)] text-[#F8F6EF] shadow-[0_12px_28px_rgba(51,70,45,0.2)]'
          : 'text-[var(--ee-muted)] hover:bg-white/70 hover:text-[var(--ee-text)]'
      }`}
    >
      {label}
    </button>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#E3E8DA]/70 p-3">
      <p className="text-xs font-medium text-[var(--ee-muted)]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[var(--ee-text)]">{value}</p>
    </div>
  )
}

function CountTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--ee-line)] bg-[#F8F6EF]/80 p-3 text-[var(--ee-text)] shadow-sm">
      <p className="text-xs text-[var(--ee-muted)]">{label}</p>
      <p className="font-mono-ui mt-1 text-xl font-black">{value}</p>
    </div>
  )
}

function PlaceholderView({
  icon,
  title,
  items,
}: {
  icon: ReactNode
  title: string
  items: string[]
}) {
  return (
    <div>
      <div className="flex items-center gap-2 font-medium text-[#F8F6EF]">
        {icon}
        {title}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <StatusBadge key={item} label={item} tone="info" />
        ))}
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-[#E3E8DA]/70 px-3 py-2">
      <p className="text-xs text-[var(--ee-muted)]">{label}</p>
      <p className="mt-1 font-semibold text-[var(--ee-text)]">{value}</p>
    </div>
  )
}

function FooterItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      {label}
    </span>
  )
}

function HeroPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ee-line)] bg-white/60 px-3 py-1.5 text-xs font-semibold text-[var(--ee-deep-olive)] backdrop-blur">
      {icon}
      {label}
    </span>
  )
}

export default App
