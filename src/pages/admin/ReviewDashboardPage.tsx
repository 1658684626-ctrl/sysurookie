import { useMemo, useState } from 'react'
import { Copy } from 'lucide-react'
import { AnimatedPage } from '../../components/common/AnimatedPage'
import { EmptyState } from '../../components/common/EmptyState'
import { MotionStatCard } from '../../components/common/MotionStatCard'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import { SectionCard } from '../../components/common/SectionCard'
import type { Announcement } from '../../types/announcement'
import type { EventConfig } from '../../types/event'
import type { Registration } from '../../types/registration'
import {
  getAnnouncementReviewSummaries,
  getCheckpointReviewSummaries,
  getEventReviewSummary,
  getOperationInsights,
  getProjectReviewSummaries,
  getReviewFunnel,
  safePercent,
} from '../../utils/analytics'
import { AnnouncementReviewTable } from './AnnouncementReviewTable'
import { CheckpointReviewTable } from './CheckpointReviewTable'
import { OperationInsightPanel } from './OperationInsightPanel'
import { ProjectBreakdownTable } from './ProjectBreakdownTable'
import { ReviewFunnelPanel } from './ReviewFunnelPanel'
import { ReviewMetricGrid } from './ReviewMetricGrid'

interface ReviewDashboardPageProps {
  announcements: Announcement[]
  eventConfig: EventConfig
  registrations: Registration[]
}

export function ReviewDashboardPage({
  announcements,
  eventConfig,
  registrations,
}: ReviewDashboardPageProps) {
  const [copyMessage, setCopyMessage] = useState('')
  const [fallbackSummary, setFallbackSummary] = useState('')
  const eventRegistrations = useMemo(
    () => registrations.filter((registration) => registration.eventId === eventConfig.id),
    [eventConfig.id, registrations],
  )
  const summary = getEventReviewSummary(eventConfig, registrations)
  const funnel = getReviewFunnel(eventConfig, registrations)
  const projectSummaries = getProjectReviewSummaries(eventConfig, registrations)
  const checkpointSummaries = getCheckpointReviewSummaries(eventConfig, registrations)
  const announcementSummaries = getAnnouncementReviewSummaries(
    eventConfig,
    announcements,
    registrations,
  )
  const insights = getOperationInsights(eventConfig, registrations, announcements)
  const averageAnnouncementConfirmRate = safePercent(
    announcementSummaries.reduce((total, item) => total + item.confirmedTotal, 0),
    announcementSummaries.reduce((total, item) => total + item.targetTotal, 0),
  )

  const reviewText = [
    'EasyEvent 赛事复盘摘要',
    `赛事：${eventConfig.name}`,
    `总报名：${summary.totalRegistrations}`,
    `正式报名：${summary.registeredCount}`,
    `签到率：${summary.checkinRate}%`,
    `出发率：${summary.departureRate}%`,
    `完赛率：${summary.finishRate}%`,
    `异常关注：${summary.attentionNeededCount}`,
    `通知平均确认率：${averageAnnouncementConfirmRate}%`,
  ].join('\n')

  const handleCopySummary = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(reviewText)
      setCopyMessage('复盘摘要已复制')
      setFallbackSummary('')
      return
    }

    setCopyMessage('当前浏览器不支持自动复制，可手动复制下方文本')
    setFallbackSummary(reviewText)
  }

  return (
    <AnimatedPage className="space-y-6">
      <SectionCard variant="command" title="数据复盘">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Race Operations Review
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
              {eventConfig.name}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              基于报名、审核、签到、点位和通知确认数据生成运营复盘指标。
            </p>
          </div>
          <PrimaryButton variant="neon" onClick={handleCopySummary}>
            <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
            复制复盘摘要
          </PrimaryButton>
        </div>
        {copyMessage && (
          <p className="mt-3 rounded-2xl border border-emerald-200/40 bg-emerald-400/12 p-3 text-sm text-emerald-100">
            {copyMessage}
          </p>
        )}
        {fallbackSummary && (
          <textarea
            readOnly
            value={fallbackSummary}
            rows={8}
            className="mt-3 w-full rounded-2xl border border-slate-300 p-3 text-sm text-slate-700"
          />
        )}
      </SectionCard>

      {eventRegistrations.length === 0 ? (
        <EmptyState title="暂无复盘数据" description="当前赛事还没有报名记录。" />
      ) : (
        <>
          <ReviewMetricGrid
            announcementConfirmRate={averageAnnouncementConfirmRate}
            summary={summary}
          />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MotionStatCard
              label="Check-in"
              progress={summary.checkinRate}
              tone="olive"
              trend="现场检录转化"
              unit="%"
              value={summary.checkinRate}
            />
            <MotionStatCard
              label="Departed"
              progress={summary.departureRate}
              tone="acid"
              trend="已出发队伍"
              unit="%"
              value={summary.departureRate}
            />
            <MotionStatCard
              label="Finished"
              progress={summary.finishRate}
              tone="yellow"
              trend="完赛率"
              unit="%"
              value={summary.finishRate}
            />
            <MotionStatCard
              label="Attention"
              progress={summary.attentionRate}
              tone="coral"
              trend="异常关注率"
              unit="%"
              value={summary.attentionRate}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <ReviewFunnelPanel steps={funnel} />
            <OperationInsightPanel insights={insights} />
          </div>

          <ProjectBreakdownTable summaries={projectSummaries} />
          <CheckpointReviewTable summaries={checkpointSummaries} />
          <AnnouncementReviewTable summaries={announcementSummaries} />

          <SectionCard variant="glow" title="数字化价值总结">
            <div className="grid gap-4 md:grid-cols-3">
              <ValueBlock
                title="原来"
                description="报名、签到、通知、点位和复盘分散在问卷、微信群、Excel、纸质表和工作人员记忆里。"
              />
              <ValueBlock
                title="现在"
                description="EasyEvent 将报名、审核、签到、点位、通知和复盘数据沉淀在同一套系统。"
              />
              <ValueBlock
                title="价值"
                description="减少人工核对，提高现场执行可视性，支持赛后复盘和下一届赛事优化。"
              />
            </div>
          </SectionCard>
        </>
      )}
    </AnimatedPage>
  )
}

function ValueBlock({
  description,
  title,
}: {
  description: string
  title: string
}) {
  return (
    <div className="rounded-2xl border border-cyan-200/18 bg-white/10 p-4 text-slate-300">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6">{description}</p>
    </div>
  )
}
