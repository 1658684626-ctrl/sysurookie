import { MetricCard } from '../../components/common/MetricCard'
import type { Registration } from '../../types/registration'
import { getDashboardSummary } from '../../utils/statusFlow'

interface AdminDashboardProps {
  registrations: Registration[]
}

export function AdminDashboard({ registrations }: AdminDashboardProps) {
  const summary = getDashboardSummary(registrations)
  const draftCount = registrations.filter((item) => item.status === 'draft').length
  const rejectedCount = registrations.filter((item) => item.status === 'rejected').length
  const approvedCount = registrations.filter((item) => item.status === 'approved').length
  const attentionCount =
    summary.incompleteCount + summary.pendingReviewCount + rejectedCount

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="总报名数" value={summary.totalRegistrations} />
      <MetricCard label="草稿中" value={draftCount} />
      <MetricCard label="待完善" value={summary.incompleteCount} />
      <MetricCard label="待审核" value={summary.pendingReviewCount} />
      <MetricCard label="审核驳回" value={rejectedCount} />
      <MetricCard label="审核通过" value={approvedCount} />
      <MetricCard label="报名成功" value={summary.registeredCount} />
      <MetricCard label="需要关注" value={attentionCount} hint="待完善 / 待审核 / 驳回" />
    </section>
  )
}
