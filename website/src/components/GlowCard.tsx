import type { ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  intensity?: 'soft' | 'strong'
}

export function GlowCard({ children, className = '', intensity = 'soft' }: GlowCardProps) {
  const shadow =
    intensity === 'strong'
      ? 'shadow-[0_0_70px_rgba(34,211,238,0.18)]'
      : 'shadow-[0_0_34px_rgba(15,23,42,0.32)]'

  return (
    <div
      className={`ee-glow-border rounded-[2rem] bg-slate-950/74 p-px ${shadow} ${className}`}
    >
      <div className="h-full rounded-[calc(2rem-1px)] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-2xl sm:p-6">
        {children}
      </div>
    </div>
  )
}
