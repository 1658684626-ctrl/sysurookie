import { Copy, RotateCcw, Sparkles } from 'lucide-react'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import { SectionCard } from '../../components/common/SectionCard'
import type { DemoScenarioSummary } from '../../utils/demo'

interface DemoScenarioPanelProps {
  fallbackText: string
  message: string
  onCopyLongScript: () => void
  onCopyShortScript: () => void
  onReset: () => void
  onSeed: () => void
  summary: DemoScenarioSummary
}

export function DemoScenarioPanel({
  fallbackText,
  message,
  onCopyLongScript,
  onCopyShortScript,
  onReset,
  onSeed,
  summary,
}: DemoScenarioPanelProps) {
  return (
    <SectionCard title="演示操作区" description="用于课堂展示前快速恢复稳定数据和复制讲稿。">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <PrimaryButton tone="secondary" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
          一键重置演示数据
        </PrimaryButton>
        <PrimaryButton onClick={onSeed}>
          <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
          一键生成完整演示案例
        </PrimaryButton>
        <PrimaryButton tone="secondary" onClick={onCopyShortScript}>
          <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
          复制 3 分钟讲稿
        </PrimaryButton>
        <PrimaryButton tone="secondary" onClick={onCopyLongScript}>
          <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
          复制 5 分钟讲稿
        </PrimaryButton>
      </div>

      {message && (
        <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {message}
        </p>
      )}

      {fallbackText && (
        <textarea
          readOnly
          value={fallbackText}
          rows={8}
          className="mt-4 w-full rounded-2xl border border-slate-300 p-3 text-sm text-slate-700"
        />
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryItem label="当前赛事" value={summary.currentEventName} />
        <SummaryItem label="报名数" value={summary.totalRegistrations} />
        <SummaryItem label="待审核" value={summary.pendingReviewCount} />
        <SummaryItem label="报名成功" value={summary.registeredCount} />
        <SummaryItem label="已签到" value={summary.checkedInCount} />
        <SummaryItem label="进行中" value={summary.inProgressCount} />
        <SummaryItem label="已完赛" value={summary.finishedCount} />
        <SummaryItem label="未确认通知" value={summary.unconfirmedAnnouncementCount} />
      </div>
    </SectionCard>
  )
}

function SummaryItem({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/75 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-950">{value}</p>
    </div>
  )
}
