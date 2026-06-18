import { AuditLogList } from '../../components/common/AuditLogList'
import { InfoRow } from '../../components/common/InfoRow'
import { RequirementList } from '../../components/common/RequirementList'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import type { EventConfig } from '../../types/event'
import type { Member, Registration } from '../../types/registration'
import {
  getCheckinStatusLabel,
  getMissingRequirements,
  getRegistrationStatusLabel,
} from '../../utils/statusFlow'
import { getRequiredMaterialRules } from '../../utils/validators'
import { AuditActionPanel } from './AuditActionPanel'

interface RegistrationReviewDetailProps {
  eventConfig: EventConfig
  registration?: Registration
  onApprove: () => void
  onReject: (reason: string) => void
  onMarkRegistered: () => void
}

const modeLabels = {
  team: '队伍报名',
  individual: '个人报名',
}

const materialStatusLabels = {
  missing: '缺失',
  uploaded: '已上传',
  approved: '已通过',
  rejected: '已驳回',
}

export function RegistrationReviewDetail({
  eventConfig,
  registration,
  onApprove,
  onReject,
  onMarkRegistered,
}: RegistrationReviewDetailProps) {
  if (!registration) {
    return (
      <SectionCard title="报名详情">
        <p className="text-sm text-slate-500">请选择左侧报名记录查看详情。</p>
      </SectionCard>
    )
  }

  const project = eventConfig.projects.find((item) => item.id === registration.projectId)
  const missingRequirements = getMissingRequirements(registration, eventConfig)

  return (
    <div className="space-y-5">
      <SectionCard title="报名基础信息">
        <div className="mb-4 flex flex-wrap gap-2">
          <StatusBadge
            label={getRegistrationStatusLabel(registration.status)}
            tone={getStatusTone(registration.status)}
          />
          <StatusBadge
            label={getCheckinStatusLabel(registration.checkinStatus)}
            tone="neutral"
          />
        </div>
        <InfoRow label="报名编号" value={registration.id} />
        <InfoRow label="报名模式" value={modeLabels[registration.mode]} />
        <InfoRow label="赛事名称" value={eventConfig.name} />
        <InfoRow label="项目 / 路线" value={project?.name ?? '未选择项目'} />
        {registration.mode === 'team' && (
          <InfoRow label="队伍名称" value={registration.teamName} />
        )}
        <InfoRow label="队长姓名" value={registration.captainName} />
        <InfoRow label="队长手机号" value={registration.captainPhone} />
        <InfoRow label="创建时间" value={registration.createdAt} />
        <InfoRow label="更新时间" value={registration.updatedAt} />
      </SectionCard>

      {project && (
        <SectionCard title="项目 / 路线规则">
          <InfoRow label="项目名称" value={project.name} />
          <InfoRow label="最少人数" value={project.minMembers} />
          <InfoRow label="最多人数" value={project.maxMembers} />
          <InfoRow label="适合人群" value={project.targetAudience} />
          <InfoRow label="点位数量" value={project.checkpoints?.length ?? 0} />
        </SectionCard>
      )}

      <SectionCard title="成员列表">
        <div className="space-y-4">
          {registration.members.map((member, index) => (
            <MemberReviewCard
              key={member.id}
              eventConfig={eventConfig}
              member={member}
              index={index}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="系统校验结果">
        <RequirementList missingRequirements={missingRequirements} />
      </SectionCard>

      <SectionCard title="审核操作面板">
        <AuditActionPanel
          eventConfig={eventConfig}
          registration={registration}
          onApprove={onApprove}
          onReject={onReject}
          onMarkRegistered={onMarkRegistered}
        />
      </SectionCard>

      <SectionCard title="审核记录">
        <AuditLogList auditLogs={registration.auditLogs} />
      </SectionCard>
    </div>
  )
}

function MemberReviewCard({
  eventConfig,
  member,
  index,
}: {
  eventConfig: EventConfig
  member: Member
  index: number
}) {
  const requiredRules = getRequiredMaterialRules(member, eventConfig)

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm text-slate-500">成员 {index + 1}</p>
          <h4 className="font-semibold text-slate-950">{member.name || '未填写姓名'}</h4>
        </div>
        <StatusBadge label={member.roleType} tone="info" />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <InfoRow label="手机号" value={member.phone} />
        {eventConfig.memberFields.map((field) => (
          <InfoRow
            key={field.key}
            label={field.label}
            value={formatFieldValue(member.formData[field.key])}
          />
        ))}
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-900">材料状态</p>
        {requiredRules.length === 0 ? (
          <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
            当前成员无需额外材料。
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            {requiredRules.map((rule) => {
              const material = member.materials.find((item) => item.ruleId === rule.id)
              const status = material?.status ?? 'missing'

              return (
                <div
                  key={rule.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-slate-900">{rule.name}</span>
                    <StatusBadge
                      label={materialStatusLabels[status]}
                      tone={status === 'missing' || status === 'rejected' ? 'warning' : 'success'}
                    />
                  </div>
                  <p className="mt-1 text-slate-500">{rule.description}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    文件名：{material?.fileName ?? '未填写'}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function formatFieldValue(value: unknown): string {
  if (typeof value === 'boolean') {
    return value ? '是' : '否'
  }

  if (value === null || value === undefined || value === '') {
    return '未填写'
  }

  return String(value)
}

function getStatusTone(status: Registration['status']) {
  if (status === 'registered' || status === 'approved') {
    return 'success'
  }

  if (status === 'pending_review') {
    return 'warning'
  }

  if (status === 'rejected') {
    return 'danger'
  }

  return 'neutral'
}
