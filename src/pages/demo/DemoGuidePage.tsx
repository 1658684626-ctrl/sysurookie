import { useEffect, useState } from 'react'
import { AnimatedPage } from '../../components/common/AnimatedPage'
import { PageHeader } from '../../components/common/PageHeader'
import { SectionCard } from '../../components/common/SectionCard'
import { eventTemplates } from '../../data/eventTemplates'
import { demoService } from '../../services'
import type { DemoScenarioSummary } from '../../services/demoService'
import { DemoScenarioPanel } from './DemoScenarioPanel'
import { DemoStepList } from './DemoStepList'
import { DemoValuePanel } from './DemoValuePanel'

interface DemoGuidePageProps {
  onDemoDataChange: () => void
}

export function DemoGuidePage({ onDemoDataChange }: DemoGuidePageProps) {
  const primaryEvent =
    eventTemplates.find((eventConfig) => eventConfig.registrationMode === 'team') ??
    eventTemplates[0]
  const [summary, setSummary] = useState<DemoScenarioSummary>({
    currentEventName: primaryEvent.name,
    totalRegistrations: 0,
    pendingReviewCount: 0,
    registeredCount: 0,
    checkedInCount: 0,
    inProgressCount: 0,
    finishedCount: 0,
    announcementCount: 0,
    unconfirmedAnnouncementCount: 0,
  })
  const [message, setMessage] = useState('')
  const [fallbackText, setFallbackText] = useState('')
  const { demoScript3Minutes, demoScript5Minutes } = demoService.getDemoScripts()

  useEffect(() => {
    void demoService.getDemoScenarioSummary().then(setSummary)
  }, [])

  const handleReset = () => {
    void demoService.resetAllDemoData().then((nextSummary) => {
      setSummary(nextSummary)
      setMessage('演示数据已重置，并切换到推荐演示赛事模板。')
      setFallbackText('')
      onDemoDataChange()
    })
  }

  const handleSeed = () => {
    void demoService.seedCompleteDemoScenario().then((nextSummary) => {
      setSummary(nextSummary)
      setMessage('完整演示案例已生成，可直接按演示流程讲解。')
      setFallbackText('')
      onDemoDataChange()
    })
  }

  const handleCopy = async (text: string, label: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        setMessage(`${label}已复制。`)
        setFallbackText('')
        return
      }
    } catch {
      setMessage('当前浏览器未允许自动复制，可手动复制下方讲稿。')
      setFallbackText(text)
      return
    }

    setMessage('当前浏览器不支持自动复制，可手动复制下方讲稿。')
    setFallbackText(text)
  }

  return (
    <AnimatedPage className="space-y-6">
      <SectionCard variant="glow" className="ee-grid-overlay">
        <div className="space-y-5">
          <PageHeader
            tone="dark"
            eyebrow="课堂演示模式"
            title="EasyEvent 易赛通课堂演示模式"
            description="面向中小型体育赛事的一站式数字化管理系统 MVP，适合开场说明、答辩截图和现场演示。"
          />
          <p className="max-w-5xl rounded-3xl border border-cyan-200/24 bg-slate-950/58 p-5 text-sm leading-7 text-slate-200 shadow-[0_0_34px_rgba(34,211,238,0.12)] backdrop-blur">
            EasyEvent 通过赛事模板配置，将报名组队、资料审核、签到检录、点位打卡、通知确认和数据复盘整合到统一平台，帮助赛事组织方减少微信群、问卷、Excel、纸质签到表和人工核对带来的运营混乱。
          </p>
        </div>
      </SectionCard>

      <DemoScenarioPanel
        fallbackText={fallbackText}
        message={message}
        summary={summary}
        onCopyLongScript={() => handleCopy(demoScript5Minutes, '5 分钟演示讲稿')}
        onCopyShortScript={() => handleCopy(demoScript3Minutes, '3 分钟演示讲稿')}
        onReset={handleReset}
        onSeed={handleSeed}
      />

      <DemoValuePanel primaryEventName={primaryEvent.name} />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <DemoStepList primaryEventName={primaryEvent.name} />
        <SectionCard variant="command" title="演示时长建议">
          <div className="space-y-4 text-sm leading-6 text-slate-600">
            <div className="rounded-2xl border border-cyan-200/18 bg-white/10 p-4 text-slate-300">
              <p className="font-semibold text-white">3 分钟压缩版</p>
              <p className="mt-1">重点讲产品定位、痛点、模板复用和数据复盘价值，点击演示模式与管理端数据复盘即可。</p>
            </div>
            <div className="rounded-2xl border border-cyan-200/18 bg-white/10 p-4 text-slate-300">
              <p className="font-semibold text-white">5 分钟完整版</p>
              <p className="mt-1">按参赛者端、管理端、通知公告和数据复盘串完整闭环，适合答辩时展示流程。</p>
            </div>
            <div className="rounded-2xl border border-cyan-200/18 bg-white/10 p-4 text-slate-300">
              <p className="font-semibold text-white">注意事项</p>
              <p className="mt-1">不需要展示真实支付、后端、地图或短信；重点讲“流程闭环”和“可配置复用”。</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </AnimatedPage>
  )
}
