import { clsx } from 'clsx'

export interface StepIndicatorItem {
  id: string
  label: string
}

interface StepIndicatorProps {
  currentStepId: string
  steps: StepIndicatorItem[]
}

export function StepIndicator({ currentStepId, steps }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStepId)

  return (
    <nav className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" aria-label="报名步骤">
      <div className="flex min-w-max gap-2 rounded-3xl border border-white/16 bg-slate-950/55 p-2 backdrop-blur-xl sm:grid sm:min-w-0 sm:grid-cols-2 lg:grid-cols-7">
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStepId
          const isPast = index < currentIndex

          return (
            <div
              key={step.id}
              className={clsx(
                'flex min-h-11 items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition',
                isCurrent &&
                  'border-cyan-200/45 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 text-white shadow-[0_0_28px_rgba(34,211,238,0.24)]',
                isPast &&
                  'border-emerald-300/30 bg-emerald-400/12 text-emerald-100',
                !isCurrent &&
                  !isPast &&
                  'border-white/10 bg-white/6 text-slate-300 hover:bg-white/10',
              )}
            >
              <span
                className={clsx(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                  isCurrent && 'bg-white text-emerald-700 shadow-[0_0_16px_rgba(255,255,255,0.6)]',
                  isPast && 'bg-emerald-300 text-slate-950 shadow-[0_0_14px_rgba(52,211,153,0.6)]',
                  !isCurrent && !isPast && 'bg-slate-800 text-slate-300',
                )}
              >
                {index + 1}
              </span>
              <span className="whitespace-nowrap font-medium">{step.label}</span>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
