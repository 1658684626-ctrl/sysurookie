import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import { StatusBadge } from './StatusBadge'

export interface CheckpointTimelineItem {
  id: string
  order: number
  name: string
  description?: string
  statusLabel: string
  isCurrent?: boolean
  required?: boolean
  submittedNote?: string
  evidenceFileName?: string
  submittedAt?: string
  action?: ReactNode
}

interface CheckpointTimelineProps {
  items: CheckpointTimelineItem[]
}

export function CheckpointTimeline({ items }: CheckpointTimelineProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <section
          key={item.id}
          className={clsx(
            'relative overflow-hidden rounded-[2rem] border p-4 transition',
            item.isCurrent
              ? 'border-[#B6FF4D]/70 bg-[#F8F6EF] shadow-[0_18px_50px_rgba(182,255,77,0.18)]'
              : 'border-[var(--ee-line)] bg-[#F8F6EF]/78',
          )}
        >
          <div className="absolute left-7 top-14 bottom-0 w-px bg-[var(--ee-line)]" />
          <div className="relative flex gap-4">
            <div
              className={clsx(
                'font-mono-ui flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-black',
                item.isCurrent
                  ? 'border-[#B6FF4D] bg-[#B6FF4D]'
                  : 'border-[var(--ee-line)] bg-white/80',
              )}
            >
              {String(item.order).padStart(2, '0')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-editorial text-2xl tracking-[-0.04em] text-[var(--ee-text)]">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="mt-1 text-sm leading-6 text-[var(--ee-muted)]">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge label={item.statusLabel} tone={item.isCurrent ? 'warning' : 'info'} />
                  {item.required && <StatusBadge label="必需" tone="neutral" />}
                </div>
              </div>
              {(item.submittedNote || item.evidenceFileName || item.submittedAt) && (
                <div className="mt-3 rounded-3xl bg-[#E3E8DA]/72 p-3 text-sm text-[var(--ee-muted)]">
                  {item.submittedNote && <p>备注：{item.submittedNote}</p>}
                  {item.evidenceFileName && <p>文件：{item.evidenceFileName}</p>}
                  {item.submittedAt && <p>提交：{item.submittedAt}</p>}
                </div>
              )}
              {item.action && <div className="mt-4">{item.action}</div>}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
