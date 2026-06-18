import type { FormFieldConfig } from '../../types/event'

interface FieldRendererProps {
  field: FormFieldConfig
  value: unknown
  onChange: (value: unknown) => void
}

const inputClassName =
  'mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white/90 px-3 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'

export function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 p-3 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        <span>
          {field.label}
          {field.required && <span className="text-rose-500"> *</span>}
        </span>
      </label>
    )
  }

  return (
    <label className="block text-sm font-medium text-slate-700">
      {field.label}
      {field.required && <span className="text-rose-500"> *</span>}
      {field.type === 'select' ? (
        <select
          value={String(value ?? '')}
          onChange={(event) => onChange(event.target.value)}
          className={inputClassName}
        >
          <option value="">请选择</option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type === 'file' ? 'text' : field.type}
          value={String(value ?? '')}
          placeholder={field.type === 'file' ? '填写文件名，文件上传后续接入' : undefined}
          onChange={(event) => {
            const nextValue =
              field.type === 'number'
                ? Number(event.target.value)
                : event.target.value
            onChange(event.target.value === '' ? '' : nextValue)
          }}
          className={inputClassName}
        />
      )}
    </label>
  )
}
