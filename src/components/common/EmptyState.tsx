import { CircleAlert } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-200/35 bg-gradient-to-br from-white/82 to-cyan-50/70 p-8 text-center shadow-sm backdrop-blur">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200/60 bg-cyan-400/10 text-cyan-600 shadow-[0_0_28px_rgba(34,211,238,0.18)]">
        <CircleAlert className="h-7 w-7" aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-900">{title}</p>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}
    </div>
  )
}
