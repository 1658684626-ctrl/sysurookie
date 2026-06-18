import type { ReactNode } from 'react'
import { Bell, ClipboardList, Home, Map, UserRound } from 'lucide-react'
import { clsx } from 'clsx'

export type BottomAppNavItemId = 'home' | 'events' | 'tasks' | 'notices' | 'mine'

const navItems: { id: BottomAppNavItemId; label: string; icon: ReactNode }[] = [
  { id: 'home', label: '首页', icon: <Home className="h-4 w-4" /> },
  { id: 'events', label: '赛事', icon: <ClipboardList className="h-4 w-4" /> },
  { id: 'tasks', label: '任务', icon: <Map className="h-4 w-4" /> },
  { id: 'notices', label: '通知', icon: <Bell className="h-4 w-4" /> },
  { id: 'mine', label: '我的', icon: <UserRound className="h-4 w-4" /> },
]

interface BottomAppNavProps {
  activeId?: BottomAppNavItemId
  onChange?: (id: BottomAppNavItemId) => void
}

export function BottomAppNav({ activeId = 'home', onChange }: BottomAppNavProps) {
  return (
    <nav className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 rounded-[2rem] border border-[var(--ee-line)] bg-[#F8F6EF]/90 p-2 shadow-[0_18px_48px_rgba(51,70,45,0.2)] backdrop-blur-xl sm:hidden">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const active = item.id === activeId
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange?.(item.id)}
              className={clsx(
                'flex min-h-12 flex-col items-center justify-center gap-1 rounded-3xl text-[0.68rem] font-semibold transition',
                active
                  ? 'bg-[var(--ee-deep-olive)] text-[#F8F6EF]'
                  : 'text-[var(--ee-muted)] hover:bg-white/70',
              )}
            >
              {item.icon}
              {item.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
