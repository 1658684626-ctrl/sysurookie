interface InfoRowProps {
  label: string
  value?: string | number
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-2 text-sm last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="break-words font-medium text-slate-900 sm:text-right">
        {value ?? '未填写'}
      </span>
    </div>
  )
}
