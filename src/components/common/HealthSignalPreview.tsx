import type { ReactNode } from 'react'
import { Activity, Footprints, HeartPulse, Route } from 'lucide-react'
import { MotionStatCard } from './MotionStatCard'

export function HealthSignalPreview() {
  return (
    <section className="rounded-[2rem] border border-[var(--ee-line)] bg-[#F8F6EF]/86 p-4 ee-card-shadow">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono-ui text-xs uppercase tracking-[0.22em] text-[var(--ee-muted)]">
            Health signals
          </p>
          <h3 className="font-editorial mt-2 text-3xl tracking-[-0.05em]">
            Future movement layer.
          </h3>
        </div>
        <p className="rounded-full bg-[#E3E8DA] px-3 py-1 text-xs font-semibold text-[var(--ee-muted)]">
          用户授权后可用
        </p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SignalItem icon={<Footprints className="h-4 w-4" />} label="Steps" value="--" />
        <SignalItem icon={<HeartPulse className="h-4 w-4" />} label="Heart rate" value="-- bpm" />
        <SignalItem icon={<Activity className="h-4 w-4" />} label="Activity" value="Private" />
        <SignalItem icon={<Route className="h-4 w-4" />} label="Movement state" value="Authorized only" />
      </div>
      <p className="mt-4 text-xs leading-5 text-[var(--ee-muted)]">
        Not for medical diagnosis. Organizers see operational signals, not raw private health data by default.
      </p>
    </section>
  )
}

function SignalItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-3xl border border-[var(--ee-line)] bg-white/66 p-3">
      <div className="flex items-center gap-2 text-[var(--ee-muted)]">
        {icon}
        <span className="font-mono-ui text-xs uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className="mt-3 text-lg font-bold text-[var(--ee-text)]">{value}</p>
    </div>
  )
}

export function HealthSignalStatStrip() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MotionStatCard label="Steps" value="--" trend="Permission required" progress={42} tone="acid" />
      <MotionStatCard label="Heart" value="--" unit="bpm" trend="Permission required" progress={30} tone="coral" />
      <MotionStatCard label="Activity" value="0" unit="min" trend="Private by design" progress={0} tone="blue" />
      <MotionStatCard label="Route" value="--" trend="No GPS connected" progress={18} tone="olive" />
    </div>
  )
}
