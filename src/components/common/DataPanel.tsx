import type { ReactNode } from 'react'
import { clsx } from 'clsx'

interface DataPanelProps {
  children: ReactNode
  className?: string
}

export function DataPanel({ children, className }: DataPanelProps) {
  return (
    <div
      className={clsx(
        'overflow-x-auto rounded-[2rem] border border-[var(--ee-line)] bg-[#F8F6EF]/82 shadow-[0_18px_50px_rgba(51,70,45,0.1)] backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const SoftDataTable = DataPanel
