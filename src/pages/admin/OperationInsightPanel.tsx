import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import type { OperationInsight } from '../../types/analytics'

interface OperationInsightPanelProps {
  insights: OperationInsight[]
}

const levelLabels: Record<OperationInsight['level'], string> = {
  positive: '表现良好',
  warning: '需要关注',
  neutral: '复盘提示',
}

export function OperationInsightPanel({ insights }: OperationInsightPanelProps) {
  return (
    <SectionCard variant="glow" title="运营洞察" description="基于已有数据的透明规则判断，不使用预测模型。">
      <div className="grid gap-3 md:grid-cols-2">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="rounded-2xl border border-white/18 bg-slate-950/55 p-4 shadow-[0_0_26px_rgba(15,23,42,0.18)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="font-semibold text-white">{insight.title}</h3>
              <StatusBadge
                label={levelLabels[insight.level]}
                tone={
                  insight.level === 'positive'
                    ? 'success'
                    : insight.level === 'warning'
                      ? 'warning'
                      : 'neutral'
                }
              />
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">{insight.description}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
