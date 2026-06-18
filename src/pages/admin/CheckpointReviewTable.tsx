import { EmptyState } from '../../components/common/EmptyState'
import { DataPanel } from '../../components/common/DataPanel'
import { SectionCard } from '../../components/common/SectionCard'
import type { CheckpointReviewSummary } from '../../types/analytics'

interface CheckpointReviewTableProps {
  summaries: CheckpointReviewSummary[]
}

export function CheckpointReviewTable({ summaries }: CheckpointReviewTableProps) {
  return (
    <SectionCard title="点位任务复盘">
      {summaries.length === 0 ? (
        <EmptyState title="暂无点位数据" description="当前赛事还没有点位配置。" />
      ) : (
        <DataPanel>
          <div className="grid min-w-[720px] grid-cols-[1.3fr_repeat(5,0.75fr)] gap-3 bg-slate-950/90 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">
            <span>点位</span>
            <span>已到达</span>
            <span>已提交</span>
            <span>已通过</span>
            <span>待审核</span>
            <span>通过率</span>
          </div>
          <div className="divide-y divide-slate-200/80">
            {summaries.map((summary) => (
              <div
                key={summary.checkpointId}
                className="grid min-w-[720px] grid-cols-[1.3fr_repeat(5,0.75fr)] gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-cyan-50/65"
              >
                <span className="font-medium text-slate-950">{summary.checkpointName}</span>
                <span>{summary.arrivedCount}</span>
                <span>{summary.submittedCount}</span>
                <span>{summary.approvedCount}</span>
                <span>{summary.pendingReviewCount}</span>
                <span>{summary.approvalRate}%</span>
              </div>
            ))}
          </div>
        </DataPanel>
      )}
    </SectionCard>
  )
}
