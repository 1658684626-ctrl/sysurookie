import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'

interface DemoValuePanelProps {
  primaryEventName: string
}

export function DemoValuePanel({ primaryEventName }: DemoValuePanelProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SectionCard title="核心痛点">
        <div className="grid gap-3">
          <PainPoint title="工具分散" description="问卷、微信群、Excel、纸质表割裂。" />
          <PainPoint title="规则复杂" description="不同赛事审核规则不一样，人工容易漏判。" />
          <PainPoint title="现场不可视" description="签到、出发、点位进度和异常情况依赖人工沟通。" />
          <PainPoint title="复盘困难" description="赛后数据散落，难以沉淀经验。" />
        </div>
      </SectionCard>

      <SectionCard title="系统闭环">
        <div className="flex flex-wrap gap-2">
          {[
            '赛事配置',
            '报名 / 组队',
            '资料审核',
            '正式报名',
            '签到检录',
            '出发',
            '点位打卡',
            '任务审核',
            '通知确认',
            '数据复盘',
          ].map((item) => (
            <StatusBadge key={item} label={item} tone="info" />
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          {primaryEventName} 只是首个模板案例，同一套配置结构也可复制到校园跑步赛、篮球赛等中小型赛事。
        </p>
      </SectionCard>
    </div>
  )
}

function PainPoint({ description, title }: { description: string; title: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-3">
      <p className="font-semibold text-slate-950">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </div>
  )
}
