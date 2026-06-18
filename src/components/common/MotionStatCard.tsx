import { clsx } from 'clsx'

interface MotionStatCardProps {
  label: string
  value: string | number
  unit?: string
  trend?: string
  progress?: number
  status?: string
  tone?: 'olive' | 'acid' | 'yellow' | 'blue' | 'coral'
}

const toneClassNames = {
  olive: 'bg-[var(--ee-deep-olive)] text-[#F8F6EF]',
  acid: 'bg-[#B6FF4D] text-[var(--ee-text)]',
  yellow: 'bg-[#FFD95A] text-[var(--ee-text)]',
  blue: 'bg-[#A8BAC5] text-[var(--ee-text)]',
  coral: 'bg-[#FF6B5E] text-white',
}

export function MotionStatCard({
  label,
  progress = 0,
  status,
  tone = 'olive',
  trend,
  unit,
  value,
}: MotionStatCardProps) {
  const safeProgress = Math.max(0, Math.min(100, progress))

  return (
    <article className={clsx('relative overflow-hidden rounded-[2rem] p-4 ee-card-shadow', toneClassNames[tone])}>
      <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/24 blur-2xl" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <p className="font-mono-ui text-xs uppercase tracking-[0.22em] opacity-70">{label}</p>
          {status && (
            <span className="rounded-full bg-white/24 px-2 py-1 text-[0.68rem] font-semibold">
              {status}
            </span>
          )}
        </div>
        <div className="mt-5 flex items-end gap-1">
          <span className="font-mono-ui text-4xl font-black leading-none tracking-[-0.08em]">
            {value}
          </span>
          {unit && <span className="mb-1 text-sm font-semibold opacity-72">{unit}</span>}
        </div>
        {trend && <p className="mt-3 text-sm leading-5 opacity-75">{trend}</p>}
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/12">
          <div
            className="h-full rounded-full bg-white/86 transition-all duration-500"
            style={{ width: `${safeProgress}%` }}
          />
        </div>
      </div>
    </article>
  )
}
