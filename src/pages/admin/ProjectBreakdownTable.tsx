import { EmptyState } from '../../components/common/EmptyState'
import { DataPanel } from '../../components/common/DataPanel'
import { SectionCard } from '../../components/common/SectionCard'
import type { ProjectReviewSummary } from '../../types/analytics'

interface ProjectBreakdownTableProps {
  summaries: ProjectReviewSummary[]
}

export function ProjectBreakdownTable({ summaries }: ProjectBreakdownTableProps) {
  return (
    <SectionCard title="项目 / 路线表现">
      {summaries.length === 0 ? (
        <EmptyState title="暂无项目数据" description="当前赛事还没有项目配置。" />
      ) : (
        <DataPanel>
          <div className="grid min-w-[900px] grid-cols-[1.2fr_repeat(8,0.65fr)] gap-3 bg-slate-950/90 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">
            <span>项目 / 路线</span>
            <span>报名</span>
            <span>正式</span>
            <span>签到</span>
            <span>出发</span>
            <span>完赛</span>
            <span>签到率</span>
            <span>完赛率</span>
            <span>异常</span>
          </div>
          <div className="divide-y divide-slate-200/80">
            {summaries.map((summary) => (
              <div
                key={summary.projectId}
                className="grid min-w-[900px] grid-cols-[1.2fr_repeat(8,0.65fr)] gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-cyan-50/65"
              >
                <span className="font-medium text-slate-950">{summary.projectName}</span>
                <span>{summary.totalRegistrations}</span>
                <span>{summary.registeredCount}</span>
                <span>{summary.checkedInCount}</span>
                <span>{summary.departedCount}</span>
                <span>{summary.finishedCount}</span>
                <span>{summary.checkinRate}%</span>
                <span>{summary.finishRate}%</span>
                <span>{summary.attentionNeededCount}</span>
              </div>
            ))}
          </div>
        </DataPanel>
      )}
    </SectionCard>
  )
}
