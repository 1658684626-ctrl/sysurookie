import { EmptyState } from '../../components/common/EmptyState'
import { DataPanel } from '../../components/common/DataPanel'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import type { AnnouncementReviewSummary } from '../../types/analytics'
import {
  getAnnouncementSeverityLabel,
  getAnnouncementStatusLabel,
} from '../../utils/announcements'

interface AnnouncementReviewTableProps {
  summaries: AnnouncementReviewSummary[]
}

export function AnnouncementReviewTable({ summaries }: AnnouncementReviewTableProps) {
  return (
    <SectionCard title="通知确认复盘">
      {summaries.length === 0 ? (
        <EmptyState title="暂无通知数据" description="发布通知后会显示确认统计。" />
      ) : (
        <DataPanel>
          <div className="grid min-w-[900px] grid-cols-[1.4fr_0.8fr_0.8fr_repeat(4,0.65fr)] gap-3 bg-slate-950/90 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">
            <span>通知标题</span>
            <span>重要程度</span>
            <span>状态</span>
            <span>应确认</span>
            <span>已确认</span>
            <span>未确认</span>
            <span>确认率</span>
          </div>
          <div className="divide-y divide-slate-200/80">
            {summaries.map((summary) => (
              <div
                key={summary.announcementId}
                className="grid min-w-[900px] grid-cols-[1.4fr_0.8fr_0.8fr_repeat(4,0.65fr)] gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-cyan-50/65"
              >
                <span className="font-medium text-slate-950">{summary.title}</span>
                <span>
                  <StatusBadge
                    label={getAnnouncementSeverityLabel(summary.severity)}
                    tone={
                      summary.severity === 'urgent'
                        ? 'danger'
                        : summary.severity === 'warning'
                          ? 'warning'
                          : 'info'
                    }
                  />
                </span>
                <span>{getAnnouncementStatusLabel(summary.status)}</span>
                <span>{summary.targetTotal}</span>
                <span>{summary.confirmedTotal}</span>
                <span>{summary.unconfirmedTotal}</span>
                <span>{summary.confirmRate}%</span>
              </div>
            ))}
          </div>
        </DataPanel>
      )}
    </SectionCard>
  )
}
