import { SectionCard } from '../../components/common/SectionCard'
import { SimpleBar } from '../../components/common/SimpleBar'
import type { ReviewFunnelStep } from '../../types/analytics'

interface ReviewFunnelPanelProps {
  steps: ReviewFunnelStep[]
}

export function ReviewFunnelPanel({ steps }: ReviewFunnelPanelProps) {
  const maxValue = Math.max(...steps.map((step) => step.value), 0)

  return (
    <SectionCard title="报名运营漏斗" description="展示从报名到完赛的关键转化。">
      <div className="space-y-4">
        {steps.map((step) => (
          <SimpleBar
            key={step.key}
            label={step.label}
            value={step.value}
            maxValue={maxValue}
            hint={
              step.rateFromPrevious === undefined
                ? undefined
                : `相对上一环节：${step.rateFromPrevious}%`
            }
          />
        ))}
      </div>
    </SectionCard>
  )
}
