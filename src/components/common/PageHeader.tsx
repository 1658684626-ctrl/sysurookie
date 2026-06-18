import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  eyebrow?: string
  action?: ReactNode
  tone?: 'light' | 'dark'
}

export function PageHeader({
  title,
  description,
  eyebrow,
  action,
  tone = 'light',
}: PageHeaderProps) {
  const isDark = tone === 'dark'

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && (
          <p
            className={`text-sm font-semibold uppercase tracking-[0.2em] ${
              isDark ? 'text-[#B6FF4D]' : 'text-[var(--ee-muted-olive)]'
            }`}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={`mt-2 text-2xl font-black tracking-tight sm:text-3xl ${
            isDark ? 'text-[#F8F6EF]' : 'text-[var(--ee-text)]'
          }`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-2 max-w-4xl text-sm leading-6 ${
              isDark ? 'text-[#E3E8DA]' : 'text-[var(--ee-muted)]'
            }`}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
