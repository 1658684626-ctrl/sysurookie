import { clsx } from 'clsx'

type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

interface StatusBadgeProps {
  label: string
  tone?: StatusTone
  glow?: boolean
}

const toneClassNames: Record<StatusTone, string> = {
  neutral: 'border-[var(--ee-line)] bg-[#E3E8DA]/72 text-[var(--ee-muted)]',
  success: 'border-[#4F8B59]/28 bg-[#4F8B59]/14 text-[#33462D]',
  warning: 'border-[#FFD95A]/70 bg-[#FFD95A]/32 text-[#5f4a0b]',
  danger: 'border-[#FF6B5E]/45 bg-[#FF6B5E]/16 text-[#7c2d24]',
  info: 'border-[#A8BAC5]/50 bg-[#A8BAC5]/24 text-[#33462D]',
}

const dotClassNames: Record<StatusTone, string> = {
  neutral: 'bg-[var(--ee-muted)] shadow-[0_0_12px_rgba(108,118,95,0.34)]',
  success: 'bg-[#4F8B59] shadow-[0_0_14px_rgba(79,139,89,0.45)]',
  warning: 'bg-[#FFD95A] shadow-[0_0_14px_rgba(255,217,90,0.65)]',
  danger: 'bg-[#FF6B5E] shadow-[0_0_14px_rgba(255,107,94,0.5)]',
  info: 'bg-[#A8BAC5] shadow-[0_0_14px_rgba(168,186,197,0.55)]',
}

export function StatusBadge({ label, tone = 'neutral', glow = true }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-4 backdrop-blur',
        toneClassNames[tone],
        glow && 'shadow-[0_0_22px_rgba(15,23,42,0.18)]',
      )}
    >
      <span className={clsx('h-1.5 w-1.5 shrink-0 rounded-full', dotClassNames[tone])} />
      {label}
    </span>
  )
}
