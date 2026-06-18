import type { ReactNode } from 'react'
import { clsx } from 'clsx'

interface SoftCommandCardProps {
  index: string
  title: string
  description: string
  value?: string | number
  status?: string
  icon?: ReactNode
  active?: boolean
  onClick?: () => void
}

export function SoftCommandCard({
  active = false,
  description,
  icon,
  index,
  onClick,
  status,
  title,
  value,
}: SoftCommandCardProps) {
  const content = (
    <>
      <div className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-[#B6FF4D]/24 blur-2xl transition group-hover:scale-125" />
      <div className="relative flex items-start justify-between gap-3">
        <p className={clsx('font-mono-ui text-xs uppercase tracking-[0.24em]', active ? 'text-[#B6FF4D]' : 'text-[var(--ee-muted)]')}>
          {index}
        </p>
        {icon && (
          <div className={clsx('flex h-11 w-11 items-center justify-center rounded-2xl', active ? 'bg-white/10 text-[#B6FF4D]' : 'bg-[#E3E8DA] text-[var(--ee-deep-olive)]')}>
            {icon}
          </div>
        )}
      </div>
      <h3 className="font-editorial relative mt-8 text-3xl leading-none tracking-[-0.05em]">
        {title}
      </h3>
      <p className={clsx('relative mt-3 text-sm leading-6', active ? 'text-[#E3E8DA]' : 'text-[var(--ee-muted)]')}>
        {description}
      </p>
      <div className="relative mt-5 flex items-end justify-between gap-3">
        {value !== undefined && (
          <p className="font-mono-ui text-3xl font-black tracking-[-0.08em]">{value}</p>
        )}
        {status && (
          <span className={clsx('rounded-full px-3 py-1 text-xs font-semibold', active ? 'bg-[#B6FF4D] text-black' : 'bg-[#E3E8DA] text-[var(--ee-muted)]')}>
            {status}
          </span>
        )}
      </div>
    </>
  )

  const className = clsx(
    'group relative w-full overflow-hidden rounded-[2rem] border p-5 text-left transition duration-300',
    active
      ? 'border-[#B6FF4D]/70 bg-[var(--ee-deep-olive)] text-[#F8F6EF] shadow-[0_22px_70px_rgba(51,70,45,0.24)]'
      : 'border-[var(--ee-line)] bg-[#F8F6EF]/86 text-[var(--ee-text)] ee-card-shadow hover:-translate-y-0.5',
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    )
  }

  return <article className={className}>{content}</article>
}
