interface SimpleBarProps {
  label: string
  value: number
  maxValue: number
  hint?: string
}

export function SimpleBar({ label, value, maxValue, hint }: SimpleBarProps) {
  const percent = maxValue === 0 ? 0 : Math.round((value / maxValue) * 100)

  return (
    <div className="rounded-2xl border border-white/55 bg-white/75 p-3 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-800">{label}</span>
        <span className="font-black text-slate-950">{value}</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full border border-slate-200 bg-slate-950/10 p-0.5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 shadow-[0_0_18px_rgba(34,211,238,0.35)] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
