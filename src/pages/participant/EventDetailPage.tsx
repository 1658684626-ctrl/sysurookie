import type { EventConfig, ProjectConfig } from '../../types/event'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import { StatusBadge } from '../../components/common/StatusBadge'

interface EventDetailPageProps {
  eventConfig: EventConfig
  selectedProjectId: string
  onSelectProject: (projectId: string) => void
  onStartRegistration: () => void
}

const modeLabels = {
  team: '队伍报名',
  individual: '个人报名',
}

export function EventDetailPage({
  eventConfig,
  selectedProjectId,
  onSelectProject,
  onStartRegistration,
}: EventDetailPageProps) {
  const selectedProject =
    eventConfig.projects.find((project) => project.id === selectedProjectId) ??
    eventConfig.projects[0]

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoItem label="赛事名称" value={eventConfig.name} />
        <InfoItem label="赛事时间" value={eventConfig.date} />
        <InfoItem label="赛事地点" value={eventConfig.location} />
        <InfoItem label="主办方" value={eventConfig.organizer} />
        <InfoItem label="报名模式" value={modeLabels[eventConfig.registrationMode]} />
        <InfoItem label="点位数量" value={`${eventConfig.checkpoints.length} 个`} />
      </div>

      <section>
        <h3 className="text-base font-semibold text-slate-950">项目 / 路线</h3>
        <div className="mt-3 grid gap-3">
          {eventConfig.projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              selected={project.id === selectedProject.id}
              onSelect={() => onSelectProject(project.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold text-slate-950">材料要求</h3>
        <div className="mt-3 grid gap-2">
          {eventConfig.materialRules.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
              当前赛事未设置额外材料要求。
            </p>
          ) : (
            eventConfig.materialRules.map((rule) => (
              <div key={rule.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{rule.name}</p>
                  {rule.required && <StatusBadge label="必需" tone="warning" />}
                </div>
                <p className="mt-1 text-sm text-slate-500">{rule.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  适用成员类型：{rule.requiredForRoleTypes.join('、')}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-slate-950">已选择：{selectedProject.name}</p>
          <p className="mt-1 text-sm text-slate-500">
            人数规则：{selectedProject.minMembers}-{selectedProject.maxMembers} 人
          </p>
        </div>
        <PrimaryButton onClick={onStartRegistration}>进入报名</PrimaryButton>
      </div>
    </div>
  )
}

function ProjectCard({
  project,
  selected,
  onSelect,
}: {
  project: ProjectConfig
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-lg border p-4 text-left transition ${
        selected
          ? 'border-slate-900 bg-slate-950 text-white'
          : 'border-slate-200 bg-white text-slate-900 hover:border-slate-400'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold">{project.name}</p>
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            selected ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {project.minMembers}-{project.maxMembers} 人
        </span>
      </div>
      <p className={`mt-2 text-sm ${selected ? 'text-slate-200' : 'text-slate-500'}`}>
        {project.description}
      </p>
      <p className={`mt-2 text-xs ${selected ? 'text-slate-300' : 'text-slate-500'}`}>
        适合：{project.targetAudience}
      </p>
    </button>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  )
}
