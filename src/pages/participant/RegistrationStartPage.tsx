import { useState } from 'react'
import type { EventConfig } from '../../types/event'
import type { Registration } from '../../types/registration'
import { PrimaryButton } from '../../components/common/PrimaryButton'

interface RegistrationStartPageProps {
  eventConfig: EventConfig
  projectId: string
  onCreateRegistration: (
    registrationDraft: Pick<
      Registration,
      'teamName' | 'captainName' | 'captainPhone'
    >,
  ) => void
}

export function RegistrationStartPage({
  eventConfig,
  projectId,
  onCreateRegistration,
}: RegistrationStartPageProps) {
  const [teamName, setTeamName] = useState('')
  const [captainName, setCaptainName] = useState('')
  const [captainPhone, setCaptainPhone] = useState('')
  const project = eventConfig.projects.find((item) => item.id === projectId)

  if (!project) {
    return <p className="text-sm text-rose-600">请先选择有效项目。</p>
  }

  if (eventConfig.registrationMode === 'individual') {
    return (
      <div className="space-y-5">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">当前项目</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">{project.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{project.description}</p>
        </div>
        <PrimaryButton
          onClick={() =>
            onCreateRegistration({
              captainName: '',
              captainPhone: '',
            })
          }
        >
          创建个人报名并填写资料
        </PrimaryButton>
      </div>
    )
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        onCreateRegistration({ teamName, captainName, captainPhone })
      }}
    >
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-500">当前路线 / 项目</p>
        <h3 className="mt-1 text-lg font-semibold text-slate-950">{project.name}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {project.description}，人数规则 {project.minMembers}-{project.maxMembers} 人。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="队伍名称" value={teamName} onChange={setTeamName} required />
        <TextInput label="队长姓名" value={captainName} onChange={setCaptainName} required />
        <TextInput
          label="队长手机号"
          value={captainPhone}
          onChange={setCaptainPhone}
          required
        />
      </div>

      <PrimaryButton type="submit">创建队伍并填写成员资料</PrimaryButton>
    </form>
  )
}

function TextInput({
  label,
  value,
  onChange,
  required,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {required && <span className="text-rose-500"> *</span>}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
      />
    </label>
  )
}
