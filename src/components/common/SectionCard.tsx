import type { ReactNode } from 'react'
import { clsx } from 'clsx'

interface SectionCardProps {
  title?: string
  description?: string
  className?: string
  variant?: 'default' | 'dark' | 'glow' | 'command' | 'subtle'
  children: ReactNode
}

const variantClassNames = {
  default:
    'border-[var(--ee-line)] bg-[var(--ee-surface-light)] text-[var(--ee-text)] ee-card-shadow backdrop-blur-xl',
  dark: 'border-white/12 bg-[var(--ee-deep-olive)] text-[#F8F6EF] shadow-[0_24px_90px_rgba(51,70,45,0.28)] backdrop-blur-xl',
  glow: 'border-[rgba(51,70,45,0.16)] bg-gradient-to-br from-[#F8F6EF]/92 via-[#E3E8DA]/82 to-[#B6FF4D]/16 text-[var(--ee-text)] shadow-[0_22px_70px_rgba(51,70,45,0.14)] backdrop-blur-xl',
  command:
    'border-[#B6FF4D]/26 bg-[var(--ee-deep-olive)] text-[#F8F6EF] shadow-[0_24px_90px_rgba(51,70,45,0.28)] backdrop-blur-xl',
  subtle:
    'border-[var(--ee-line)] bg-[#F8F6EF]/78 text-[var(--ee-text)] shadow-sm shadow-[rgba(51,70,45,0.08)] backdrop-blur-xl',
}

export function SectionCard({
  title,
  description,
  className,
  variant = 'default',
  children,
}: SectionCardProps) {
  return (
    <section
      className={clsx(
        'relative overflow-hidden rounded-[2rem] border p-5 transition duration-300 hover:-translate-y-0.5 sm:p-6',
        variantClassNames[variant],
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B6FF4D]/70 to-transparent" />
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2
              className={clsx(
                'text-lg font-semibold',
                variant === 'default' || variant === 'subtle' || variant === 'glow'
                  ? 'text-[var(--ee-text)]'
                  : 'text-[#F8F6EF]',
              )}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              className={clsx(
                'mt-1 text-sm leading-6',
                variant === 'default' || variant === 'subtle' || variant === 'glow'
                  ? 'text-[var(--ee-muted)]'
                  : 'text-[#E3E8DA]',
              )}
            >
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}
