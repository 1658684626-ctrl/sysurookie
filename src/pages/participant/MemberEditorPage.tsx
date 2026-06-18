import { Plus, Trash2 } from 'lucide-react'
import { FieldRenderer } from '../../components/common/FieldRenderer'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import { RequirementList } from '../../components/common/RequirementList'
import type { EventConfig } from '../../types/event'
import type { Member, MemberMaterial, Registration } from '../../types/registration'
import { getMissingRequirements } from '../../utils/statusFlow'
import {
  getEventRoleTypeOptions,
  getRequiredMaterialRules,
} from '../../utils/validators'

interface MemberEditorPageProps {
  eventConfig: EventConfig
  registration: Registration
  onSaveRegistration: (registration: Registration) => void
  onReviewStatus: () => void
}

export function MemberEditorPage({
  eventConfig,
  registration,
  onSaveRegistration,
  onReviewStatus,
}: MemberEditorPageProps) {
  const roleTypeOptions = getEventRoleTypeOptions(eventConfig)
  const project = eventConfig.projects.find((item) => item.id === registration.projectId)
  const missingRequirements = getMissingRequirements(registration, eventConfig)

  const addMember = () => {
    const roleType = roleTypeOptions[0]
    const member = createEmptyMember(roleType, eventConfig)
    const nextRegistration = {
      ...registration,
      members: [...registration.members, member],
      updatedAt: new Date().toISOString(),
    }

    onSaveRegistration(nextRegistration)
  }

  const updateMember = (memberId: string, nextMember: Member) => {
    onSaveRegistration({
      ...registration,
      members: registration.members.map((member) =>
        member.id === memberId ? nextMember : member,
      ),
      status: 'incomplete',
      updatedAt: new Date().toISOString(),
    })
  }

  const deleteMember = (memberId: string) => {
    onSaveRegistration({
      ...registration,
      members: registration.members.filter((member) => member.id !== memberId),
      status: 'incomplete',
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">当前项目</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">
            {project?.name ?? '未选择项目'}
          </h3>
          {project && (
            <p className="mt-1 text-sm text-slate-500">
              人数规则：{project.minMembers}-{project.maxMembers} 人，当前{' '}
              {registration.members.length} 人
            </p>
          )}
        </div>
        {registration.mode === 'team' && (
          <PrimaryButton onClick={addMember}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            添加成员
          </PrimaryButton>
        )}
      </div>

      <div className="space-y-4">
        {registration.members.map((member, index) => (
          <MemberCard
            key={member.id}
            eventConfig={eventConfig}
            index={index}
            member={member}
            roleTypeOptions={roleTypeOptions}
            canDelete={registration.mode === 'team' && registration.members.length > 1}
            onChange={(nextMember) => updateMember(member.id, nextMember)}
            onDelete={() => deleteMember(member.id)}
          />
        ))}
      </div>

      {registration.members.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          当前还没有成员，请先添加成员。
        </div>
      )}

      <RequirementList missingRequirements={missingRequirements} />

      <div className="flex flex-wrap gap-3">
        <PrimaryButton onClick={onReviewStatus}>查看报名状态</PrimaryButton>
      </div>
    </div>
  )
}

function MemberCard({
  eventConfig,
  index,
  member,
  roleTypeOptions,
  canDelete,
  onChange,
  onDelete,
}: {
  eventConfig: EventConfig
  index: number
  member: Member
  roleTypeOptions: string[]
  canDelete: boolean
  onChange: (member: Member) => void
  onDelete: () => void
}) {
  const requiredMaterials = getRequiredMaterialRules(member, eventConfig)

  const updateFormData = (key: string, value: unknown) => {
    onChange({
      ...member,
      formData: {
        ...member.formData,
        [key]: value,
      },
    })
  }

  const updateRoleType = (roleType: string) => {
    const roleField = eventConfig.memberFields.find(
      (field) => field.options?.includes(roleType),
    )

    onChange({
      ...member,
      roleType,
      formData: {
        ...member.formData,
        ...(roleField ? { [roleField.key]: roleType } : {}),
      },
      materials: member.materials.filter((material) =>
        eventConfig.materialRules.some(
          (rule) =>
            rule.id === material.ruleId && rule.requiredForRoleTypes.includes(roleType),
        ),
      ),
    })
  }

  const updateMaterial = (ruleId: string, fileName: string) => {
    const nextMaterials = upsertMaterial(member.materials, {
      ruleId,
      fileName,
      status: fileName.trim() ? 'uploaded' : 'missing',
    })

    onChange({
      ...member,
      materials: nextMaterials,
    })
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">成员 {index + 1}</p>
          <h4 className="text-base font-semibold text-slate-950">
            {member.name || '未填写姓名'}
          </h4>
        </div>
        {canDelete && (
          <PrimaryButton tone="danger" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
            删除成员
          </PrimaryButton>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <TextInput
          label="成员姓名"
          value={member.name}
          onChange={(value) => onChange({ ...member, name: value })}
          required
        />
        <TextInput
          label="成员手机号"
          value={member.phone}
          onChange={(value) => onChange({ ...member, phone: value })}
          required
        />
        <label className="block text-sm font-medium text-slate-700">
          成员类型 <span className="text-rose-500">*</span>
          <select
            value={member.roleType}
            onChange={(event) => updateRoleType(event.target.value)}
            className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
          >
            {roleTypeOptions.map((roleType) => (
              <option key={roleType} value={roleType}>
                {roleType}
              </option>
            ))}
          </select>
        </label>

        {eventConfig.memberFields.map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            value={member.formData[field.key]}
            onChange={(value) => updateFormData(field.key, value)}
          />
        ))}
      </div>

      <div className="mt-5">
        <h5 className="text-sm font-semibold text-slate-900">材料要求</h5>
        {requiredMaterials.length === 0 ? (
          <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
            当前成员类型无需额外材料。
          </p>
        ) : (
          <div className="mt-2 grid gap-3">
            {requiredMaterials.map((rule) => {
              const material = member.materials.find((item) => item.ruleId === rule.id)

              return (
                <label
                  key={rule.id}
                  className="block rounded-lg border border-slate-200 p-3 text-sm"
                >
                  <span className="font-medium text-slate-800">{rule.name}</span>
                  <span className="ml-2 text-xs text-slate-500">{rule.description}</span>
                  <input
                    value={material?.fileName ?? ''}
                    onChange={(event) => updateMaterial(rule.id, event.target.value)}
                    placeholder="填写文件名，文件上传后续接入"
                    className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
              )
            })}
          </div>
        )}
      </div>
    </section>
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

function createEmptyMember(roleType: string, eventConfig: EventConfig): Member {
  const roleField = eventConfig.memberFields.find((field) =>
    field.options?.includes(roleType),
  )

  return {
    id: `member-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: '',
    phone: '',
    roleType,
    formData: roleField ? { [roleField.key]: roleType } : {},
    materials: [],
  }
}

function upsertMaterial(
  materials: MemberMaterial[],
  nextMaterial: MemberMaterial,
): MemberMaterial[] {
  const exists = materials.some((material) => material.ruleId === nextMaterial.ruleId)

  return exists
    ? materials.map((material) =>
        material.ruleId === nextMaterial.ruleId ? nextMaterial : material,
      )
    : [...materials, nextMaterial]
}
