import type { RegistrationStatus } from '../../types/status'

export type RegistrationStatusFilter = 'all' | RegistrationStatus

interface StatusFilterOption {
  label: string
  value: RegistrationStatusFilter
}

interface StatusFilterProps {
  value: RegistrationStatusFilter
  options: StatusFilterOption[]
  onChange: (value: RegistrationStatusFilter) => void
}

export function StatusFilter({ value, options, onChange }: StatusFilterProps) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1 sm:mx-0 sm:flex-wrap sm:px-0">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`min-h-9 shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
            value === option.value
              ? 'border-emerald-500 bg-gradient-to-r from-emerald-600 to-sky-600 text-white'
              : 'border-slate-200 bg-white/85 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
