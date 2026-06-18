interface ProgressBarProps {
  value: number
  label?: string
  tone?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'violet'
}

const toneClassNames = {
  cyan: 'from-[#A8BAC5] via-sky-300 to-blue-400 shadow-sky-400/25',
  emerald: 'from-[#B6FF4D] via-[#6F8F5E] to-[#33462D] shadow-[#B6FF4D]/30',
  amber: 'from-amber-300 via-orange-400 to-rose-400 shadow-amber-400/35',
  rose: 'from-rose-300 via-pink-400 to-fuchsia-500 shadow-rose-400/35',
  violet: 'from-violet-300 via-indigo-400 to-cyan-500 shadow-violet-400/35',
}

export function ProgressBar({ value, label, tone = 'emerald' }: ProgressBarProps) {
  const normalizedValue = Math.max(0, Math.min(100, value))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-[var(--ee-muted)]">{label ?? '完成进度'}</span>
        <span className="font-mono-ui font-semibold text-[var(--ee-text)]">{normalizedValue}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full border border-[var(--ee-line)] bg-[#E3E8DA]/70 p-0.5">
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 shadow-[0_0_22px] ${toneClassNames[tone]}`}
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  )
}
