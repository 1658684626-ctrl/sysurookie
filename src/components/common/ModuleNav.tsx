import { clsx } from 'clsx'

export interface ModuleNavItem<T extends string> {
  id: T
  label: string
}

interface ModuleNavProps<T extends string> {
  items: ModuleNavItem<T>[]
  activeId: T
  onChange: (id: T) => void
  ariaLabel?: string
}

export function ModuleNav<T extends string>({
  items,
  activeId,
  onChange,
  ariaLabel = '模块导航',
}: ModuleNavProps<T>) {
  return (
    <nav
      className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
      aria-label={ariaLabel}
    >
      <div className="flex min-w-max gap-2 rounded-[1.75rem] border border-[var(--ee-line)] bg-[#F8F6EF]/78 p-1.5 shadow-[0_18px_60px_rgba(51,70,45,0.12)] backdrop-blur-xl sm:min-w-0">
        {items.map((item) => {
          const active = item.id === activeId

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={clsx(
                'min-h-10 rounded-xl px-4 py-2 text-sm font-semibold transition',
                active
                  ? 'bg-[var(--ee-deep-olive)] text-[#F8F6EF] shadow-[0_12px_28px_rgba(51,70,45,0.2)]'
                  : 'text-[var(--ee-muted)] hover:bg-white/70 hover:text-[var(--ee-text)]',
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
