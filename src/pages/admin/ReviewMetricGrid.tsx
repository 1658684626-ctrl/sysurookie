import { Activity, Bell, Flag, RadioTower, ShieldCheck, Siren, Users } from 'lucide-react'
import { MetricCard } from '../../components/common/MetricCard'
import type { EventReviewSummary } from '../../types/analytics'

interface ReviewMetricGridProps {
  announcementConfirmRate: number
  summary: EventReviewSummary
}

export function ReviewMetricGrid({
  announcementConfirmRate,
  summary,
}: ReviewMetricGridProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
      <MetricCard label="总报名数" value={summary.totalRegistrations} icon={<Users className="h-4 w-4" />} highlight tone="cyan" />
      <MetricCard label="正式报名数" value={summary.registeredCount} icon={<ShieldCheck className="h-4 w-4" />} tone="emerald" />
      <MetricCard label="签到率" value={`${summary.checkinRate}%`} icon={<RadioTower className="h-4 w-4" />} tone="cyan" />
      <MetricCard label="出发率" value={`${summary.departureRate}%`} icon={<Activity className="h-4 w-4" />} tone="violet" />
      <MetricCard label="完赛率" value={`${summary.finishRate}%`} icon={<Flag className="h-4 w-4" />} tone="emerald" />
      <MetricCard label="异常关注" value={summary.attentionNeededCount} icon={<Siren className="h-4 w-4" />} tone="rose" />
      <MetricCard label="通知确认率" value={`${announcementConfirmRate}%`} icon={<Bell className="h-4 w-4" />} tone="amber" />
    </section>
  )
}
