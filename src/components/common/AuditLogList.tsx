import type { AuditLog } from '../../types/registration'
import { EmptyState } from './EmptyState'

interface AuditLogListProps {
  auditLogs: AuditLog[]
}

export function AuditLogList({ auditLogs }: AuditLogListProps) {
  if (auditLogs.length === 0) {
    return <EmptyState title="暂无审核记录" description="审核操作后会写入记录。" />
  }

  return (
    <div className="space-y-3">
      {auditLogs.map((log) => (
        <div key={log.id} className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium text-slate-950">{getAuditActionLabel(log.action)}</p>
            <span className="text-xs text-slate-500">{log.createdAt}</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">操作人：{log.operator}</p>
          {log.reason && <p className="mt-2 text-sm text-slate-700">原因：{log.reason}</p>}
        </div>
      ))}
    </div>
  )
}

function getAuditActionLabel(action: string): string {
  const labels: Record<string, string> = {
    approved: '审核通过',
    rejected: '审核驳回',
    registered: '确认为正式报名',
    checked_in: '检录签到',
    departed: '标记出发',
    checkpoint_arrived: '到达点位',
    checkpoint_submitted: '提交点位任务',
    checkpoint_approved: '点位任务通过',
    attention_needed: '标记异常关注',
    attention_resolved: '解除异常关注',
    finished: '标记完赛',
    提交审核: '提交审核',
    审核通过: '审核通过',
    审核驳回: '审核驳回',
    标记异常关注: '标记异常关注',
  }

  return labels[action] ?? action
}
