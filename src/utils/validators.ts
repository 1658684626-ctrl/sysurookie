import { z } from 'zod'
import type { EventConfig, MaterialRule, ProjectConfig } from '../types/event'
import type { Member, Registration } from '../types/registration'

export const currentEventIdSchema = z.string().min(1)

export function isRequiredValueFilled(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    return Number.isFinite(value)
  }

  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  if (Array.isArray(value)) {
    return value.length > 0
  }

  return value !== null && value !== undefined
}

export function isTeamSizeValid(
  registration: Registration,
  projectConfig: ProjectConfig,
): boolean {
  const memberCount = registration.members.length

  return (
    memberCount >= projectConfig.minMembers &&
    memberCount <= projectConfig.maxMembers
  )
}

export function getRequiredMaterialRules(
  member: Member,
  eventConfig: EventConfig,
): MaterialRule[] {
  return eventConfig.materialRules.filter(
    (rule) => rule.required && rule.requiredForRoleTypes.includes(member.roleType),
  )
}

export function getMemberMissingFields(
  member: Member,
  eventConfig: EventConfig,
): string[] {
  const missingFields = eventConfig.memberFields
    .filter((field) => field.required && (field.appliesTo ?? 'member') === 'member')
    .filter((field) => !isRequiredValueFilled(member.formData[field.key]))
    .map((field) => field.label)

  if (!isRequiredValueFilled(member.name)) {
    missingFields.unshift('成员姓名')
  }

  if (!isRequiredValueFilled(member.phone)) {
    missingFields.unshift('成员手机号')
  }

  return missingFields
}

export function isMemberProfileComplete(
  member: Member,
  eventConfig: EventConfig,
): boolean {
  return getMemberMissingFields(member, eventConfig).length === 0
}

export function getEventRoleTypeOptions(eventConfig: EventConfig): string[] {
  const fieldOptions = eventConfig.memberFields
    .filter(
      (field) =>
        field.type === 'select' &&
        (field.key.toLowerCase().includes('role') ||
          field.label.includes('成员类型') ||
          field.label.includes('身份') ||
          field.label.includes('角色')),
    )
    .flatMap((field) => field.options ?? [])

  const materialRoleTypes = eventConfig.materialRules.flatMap(
    (rule) => rule.requiredForRoleTypes,
  )

  const roleTypes = Array.from(new Set([...fieldOptions, ...materialRoleTypes]))

  return roleTypes.length > 0 ? roleTypes : ['参赛者']
}
