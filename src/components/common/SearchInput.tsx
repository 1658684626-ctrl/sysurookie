import { Search } from 'lucide-react'

interface SearchInputProps {
  onChange: (value: string) => void
  placeholder?: string
  value: string
}

export function SearchInput({
  onChange,
  placeholder = '搜索',
  value,
}: SearchInputProps) {
  return (
    <label className="relative block">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white/90 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  )
}
