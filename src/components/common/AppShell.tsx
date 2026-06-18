import type { ReactNode } from 'react'
import { BackgroundOrbs } from './BackgroundOrbs'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[var(--ee-bg)] text-[var(--ee-text)]">
      <BackgroundOrbs />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] sm:gap-6 sm:px-6 sm:pb-[calc(2.5rem+env(safe-area-inset-bottom))] sm:pt-[calc(1.5rem+env(safe-area-inset-top))] lg:px-8">
        {children}
      </div>
    </main>
  )
}
