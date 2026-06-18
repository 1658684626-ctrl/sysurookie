import { SectionCard } from '../../components/common/SectionCard'

interface DemoStepListProps {
  primaryEventName: string
}

export function DemoStepList({ primaryEventName }: DemoStepListProps) {
  const steps = [
    `切换到${primaryEventName}模板`,
    '参赛者端创建队伍并提交审核',
    '管理端审核通过并确认为正式报名',
    '管理端签到检录并标记出发',
    '参赛者端进入点位打卡并提交任务',
    '管理端现场执行审核点位任务并标记完赛',
    '管理端发布通知公告',
    '参赛者端确认已读',
    '管理端查看数据复盘',
  ]

  return (
    <SectionCard title="演示建议流程">
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-3"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-sky-600 text-sm font-semibold text-white">
              {index + 1}
            </div>
            <p className="text-sm leading-6 text-slate-700">{step}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
