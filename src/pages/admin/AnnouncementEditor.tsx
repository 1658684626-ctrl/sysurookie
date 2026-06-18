import { useState } from 'react'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import { SectionCard } from '../../components/common/SectionCard'
import type { EventConfig } from '../../types/event'
import type { AnnouncementDraftInput, AnnouncementTargetScope } from '../../types/announcement'
import type { RegistrationStatus } from '../../types/status'
import {
  getAnnouncementSeverityLabel,
  getAnnouncementTargetScopeLabel,
} from '../../utils/announcements'
import { getRegistrationStatusLabel } from '../../utils/statusFlow'

interface AnnouncementEditorProps {
  eventConfig: EventConfig
  onCreateDraft: (input: AnnouncementDraftInput) => void
}

const severityOptions = ['info', 'warning', 'urgent'] as const
const targetScopeOptions: AnnouncementTargetScope[] = ['all', 'projects', 'statuses']
const registrationStatusOptions: RegistrationStatus[] = [
  'draft',
  'incomplete',
  'pending_review',
  'rejected',
  'approved',
  'registered',
]

export function AnnouncementEditor({
  eventConfig,
  onCreateDraft,
}: AnnouncementEditorProps) {
  const [typeId, setTypeId] = useState(eventConfig.announcementTypes[0]?.id ?? '')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [severity, setSeverity] = useState<(typeof severityOptions)[number]>('info')
  const [targetScope, setTargetScope] = useState<AnnouncementTargetScope>('all')
  const [targetProjectIds, setTargetProjectIds] = useState<string[]>([])
  const [targetRegistrationStatuses, setTargetRegistrationStatuses] = useState<
    RegistrationStatus[]
  >(['registered'])
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const validationError = getValidationError({
      typeId,
      title,
      content,
      targetScope,
      targetProjectIds,
      targetRegistrationStatuses,
    })

    if (validationError) {
      setError(validationError)
      return
    }

    onCreateDraft({
      eventId: eventConfig.id,
      typeId,
      title: title.trim(),
      content: content.trim(),
      severity,
      targetScope,
      targetProjectIds: targetScope === 'projects' ? targetProjectIds : undefined,
      targetRegistrationStatuses:
        targetScope === 'statuses' ? targetRegistrationStatuses : undefined,
    })
    setTitle('')
    setContent('')
    setError('')
  }

  return (
    <SectionCard title="创建通知草稿" description="保存后可在详情面板发布通知。">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            通知类型
            <select
              value={typeId}
              onChange={(event) => setTypeId(event.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
            >
              {eventConfig.announcementTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            重要程度
            <select
              value={severity}
              onChange={(event) =>
                setSeverity(event.target.value as (typeof severityOptions)[number])
              }
              className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
            >
              {severityOptions.map((option) => (
                <option key={option} value={option}>
                  {getAnnouncementSeverityLabel(option)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          标题
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          内容
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          目标范围
          <select
            value={targetScope}
            onChange={(event) => setTargetScope(event.target.value as AnnouncementTargetScope)}
            className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
          >
            {targetScopeOptions.map((option) => (
              <option key={option} value={option}>
                {getAnnouncementTargetScopeLabel(option)}
              </option>
            ))}
          </select>
        </label>

        {targetScope === 'projects' && (
          <div className="grid gap-2 sm:grid-cols-2">
            {eventConfig.projects.map((project) => (
              <label key={project.id} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={targetProjectIds.includes(project.id)}
                  onChange={(event) =>
                    setTargetProjectIds((current) =>
                      event.target.checked
                        ? [...current, project.id]
                        : current.filter((id) => id !== project.id),
                    )
                  }
                />
                {project.name}
              </label>
            ))}
          </div>
        )}

        {targetScope === 'statuses' && (
          <div className="grid gap-2 sm:grid-cols-2">
            {registrationStatusOptions.map((status) => (
              <label key={status} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={targetRegistrationStatuses.includes(status)}
                  onChange={(event) =>
                    setTargetRegistrationStatuses((current) =>
                      event.target.checked
                        ? [...current, status]
                        : current.filter((item) => item !== status),
                    )
                  }
                />
                {getRegistrationStatusLabel(status)}
              </label>
            ))}
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        <PrimaryButton onClick={handleSubmit}>保存草稿</PrimaryButton>
      </div>
    </SectionCard>
  )
}

function getValidationError(input: {
  typeId: string
  title: string
  content: string
  targetScope: AnnouncementTargetScope
  targetProjectIds: string[]
  targetRegistrationStatuses: RegistrationStatus[]
}) {
  if (!input.typeId) {
    return '请选择通知类型'
  }

  if (!input.title.trim()) {
    return '标题不能为空'
  }

  if (!input.content.trim()) {
    return '内容不能为空'
  }

  if (input.targetScope === 'projects' && input.targetProjectIds.length === 0) {
    return '请至少选择一个项目 / 路线'
  }

  if (
    input.targetScope === 'statuses' &&
    input.targetRegistrationStatuses.length === 0
  ) {
    return '请至少选择一个报名状态'
  }

  return ''
}
