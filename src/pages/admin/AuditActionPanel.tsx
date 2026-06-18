import { useState } from 'react'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import { RequirementList } from '../../components/common/RequirementList'
import type { EventConfig } from '../../types/event'
import type { Registration } from '../../types/registration'
import {
  canApproveRegistration,
  getMissingRequirements,
} from '../../utils/statusFlow'

interface AuditActionPanelProps {
  eventConfig: EventConfig
  registration: Registration
  onApprove: () => void
  onReject: (reason: string) => void
  onMarkRegistered: () => void
}

export function AuditActionPanel({
  eventConfig,
  registration,
  onApprove,
  onReject,
  onMarkRegistered,
}: AuditActionPanelProps) {
  const [rejectReason, setRejectReason] = useState('')
  const missingRequirements = getMissingRequirements(registration, eventConfig)
  const canApprove = canApproveRegistration(registration, eventConfig)
  const canReject = ['pending_review', 'approved', 'registered'].includes(
    registration.status,
  )

  return (
    <div className="space-y-4">
      <RequirementList missingRequirements={missingRequirements} />

      {registration.status === 'pending_review' && !canApprove && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          存在缺失项，暂不能通过审核。管理员仍可填写原因并驳回报名。
        </p>
      )}

      {registration.status === 'pending_review' && (
        <PrimaryButton disabled={!canApprove} onClick={onApprove}>
          审核通过
        </PrimaryButton>
      )}

      {registration.status === 'approved' && (
        <PrimaryButton onClick={onMarkRegistered}>确认为正式报名</PrimaryButton>
      )}

      {canReject && (
        <div className="rounded-lg border border-slate-200 p-4">
          <label className="block text-sm font-medium text-slate-700">
            驳回原因
            <textarea
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              rows={3}
              placeholder="请输入驳回原因"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <PrimaryButton
            tone="danger"
            disabled={!rejectReason.trim()}
            onClick={() => {
              onReject(rejectReason.trim())
              setRejectReason('')
            }}
            className="mt-3"
          >
            驳回报名
          </PrimaryButton>
        </div>
      )}

      {!canReject && registration.status !== 'pending_review' && (
        <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
          当前状态不支持审核操作，请等待参赛者提交审核。
        </p>
      )}
    </div>
  )
}
