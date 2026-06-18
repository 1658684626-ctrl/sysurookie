import type { ReactNode } from 'react'
import { clsx } from 'clsx'

interface MetricCardProps {
  label: string
  value: number | string
  hint?: string
  icon?: ReactNode
  highlight?: boolean
  tone?: 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose'
}

const toneClassNames = {
  cyan: 'from-cyan-400/22 to-blue-500/10 text-cyan-100 shadow-cyan-950/30',
  emerald: 'from-emerald-400/24 to-teal-500/10 text-emerald-100 shadow-emerald-950/30',
  violet: 'from-violet-400/22 to-fuchsia-500/10 text-violet-100 shadow-violet-950/30',
  amber: 'from-amber-300/22 to-orange-500/10 text-amber-100 shadow-amber-950/30',
  rose: 'from-rose-400/22 to-pink-500/10 text-rose-100 shadow-rose-950/30',
}

export function MetricCard({
  label,
  value,
  hint,
  icon,
  highlight = false,
  tone = 'cyan',
}: MetricCardProps) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-3xl border p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5',
        highlight
          ? 'border-cyan-200/30 bg-slate-950/80 shadow-[0_0_44px_rgba(34,211,238,0.18)]'
          : 'border-white/55 bg-white/86 shadow-sm shadow-slate-950/10',
      )}
    >
      <div
        className={clsx(
          'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-100',
          toneClassNames[tone],
        )}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <p
            className={clsx(
              'text-sm font-medium',
              highlight ? 'text-slate-300' : 'text-slate-500',
            )}
          >
            {label}
          </p>
          {icon && (
            <div
              className={clsx(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl',
                highlight
                  ? 'bg-white/10 text-cyan-100'
                  : 'bg-slate-950/5 text-slate-600',
              )}
            >
              {icon}
            </div>
          )}
        </div>
        <p
          className={clsx(
            'mt-3 text-3xl font-black tracking-tight',
            highlight ? 'text-white' : 'text-slate-950',
          )}
        >
          {value}
        </p>
        {hint && (
          <p
            className={clsx(
              'mt-2 text-xs leading-5',
              highlight ? 'text-slate-300' : 'text-slate-500',
            )}
          >
            {hint}
          </p>
        )}
      </div>
    </div>
  )
}
