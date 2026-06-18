import { Bell, Bot, Fingerprint, Ticket } from 'lucide-react'
import { StatusBadge } from './StatusBadge'

interface EventPassCardProps {
  eventName: string
  registrationName: string
  projectName: string
  registrationStatus: string
  checkinStatus?: string
  nextAction?: string
  code?: string
  unreadNoticeCount?: number
  onAiHelper?: () => void
}

export function EventPassCard({
  checkinStatus,
  code,
  eventName,
  nextAction,
  onAiHelper,
  projectName,
  registrationName,
  registrationStatus,
  unreadNoticeCount = 0,
}: EventPassCardProps) {
  return (
    <section className="relative overflow-hidden rounded-[2.25rem] border border-[var(--ee-line)] bg-[#F8F6EF] p-5 text-[var(--ee-text)] ee-card-shadow">
      <div className="pointer-events-none absolute inset-0 ee-soft-line opacity-80" />
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#B6FF4D]/30 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="font-mono-ui text-xs uppercase tracking-[0.24em] text-[var(--ee-muted)]">
            Event Pass
          </p>
          <h3 className="font-editorial mt-3 max-w-xl text-3xl leading-none tracking-[-0.05em] sm:text-4xl">
            {registrationName}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--ee-muted)]">
            {eventName} / {projectName}
          </p>
        </div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-[var(--ee-deep-olive)] text-[#F8F6EF] shadow-[0_14px_28px_rgba(51,70,45,0.22)]">
          <Ticket className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>

      <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border border-[var(--ee-line)] bg-white/60 p-3">
          <p className="font-mono-ui text-[0.65rem] uppercase tracking-[0.2em] text-[var(--ee-muted)]">
            Status
          </p>
          <div className="mt-2">
            <StatusBadge label={registrationStatus} tone="success" />
          </div>
        </div>
        <div className="rounded-3xl border border-[var(--ee-line)] bg-white/60 p-3">
          <p className="font-mono-ui text-[0.65rem] uppercase tracking-[0.2em] text-[var(--ee-muted)]">
            Check-in
          </p>
          <p className="mt-2 text-sm font-semibold">{checkinStatus ?? '待生成'}</p>
        </div>
        <div className="rounded-3xl border border-[var(--ee-line)] bg-white/60 p-3">
          <p className="font-mono-ui text-[0.65rem] uppercase tracking-[0.2em] text-[var(--ee-muted)]">
            Notices
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
            <Bell className="h-4 w-4" aria-hidden="true" />
            {unreadNoticeCount} 待确认
          </div>
        </div>
      </div>

      <div className="relative mt-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <div className="rounded-[1.75rem] bg-[#E3E8DA] p-4">
          <p className="font-mono-ui text-xs uppercase tracking-[0.22em] text-[var(--ee-muted)]">
            Next action
          </p>
          <p className="mt-2 text-lg font-semibold tracking-[-0.03em]">
            {nextAction ?? '查看报名状态'}
          </p>
        </div>
        {code && (
          <div className="rounded-[1.75rem] border border-black/10 bg-[var(--ee-deep-olive)] p-4 text-[#F8F6EF]">
            <div className="flex items-center gap-2 text-xs text-[#E3E8DA]">
              <Fingerprint className="h-4 w-4" aria-hidden="true" />
              Check-in code
            </div>
            <p className="font-mono-ui mt-2 text-2xl font-black tracking-[0.08em]">{code}</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onAiHelper}
        className="relative mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--ee-line)] bg-white/50 px-3 py-2 text-sm font-semibold text-[var(--ee-deep-olive)] transition hover:bg-[#B6FF4D]/25"
      >
        <Bot className="h-4 w-4" aria-hidden="true" />
        Event Copilot · Alpha
      </button>
    </section>
  )
}
