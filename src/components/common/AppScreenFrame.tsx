import type { ReactNode } from 'react'

interface AppScreenFrameProps {
  children: ReactNode
}

export function AppScreenFrame({ children }: AppScreenFrameProps) {
  return (
    <div className="mx-auto max-w-sm rounded-[2.5rem] border border-black/10 bg-[#171915] p-2 shadow-[0_24px_90px_rgba(23,25,21,0.28)]">
      <div className="overflow-hidden rounded-[2rem] bg-[var(--ee-bg)]">
        <div className="mx-auto mt-3 h-1.5 w-20 rounded-full bg-white/20" />
        <div className="p-3">{children}</div>
      </div>
    </div>
  )
}
