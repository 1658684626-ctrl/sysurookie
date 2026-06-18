export type RegistrationMode = 'team' | 'individual'

export type CheckinMode = 'team' | 'individual'

export type FormFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'date'
  | 'checkbox'
  | 'file'

export type CheckpointTaskType = 'scan' | 'photo' | 'text' | 'manual'

export type AnnouncementSeverity = 'info' | 'warning' | 'urgent'

export interface EventConfig {
  id: string
  name: string
  shortName: string
  date: string
  location: string
  organizer: string
  registrationMode: RegistrationMode
  projects: ProjectConfig[]
  memberFields: FormFieldConfig[]
  materialRules: MaterialRule[]
  checkinMode: CheckinMode
  checkpoints: CheckpointConfig[]
  announcementTypes: AnnouncementType[]
}

export interface ProjectConfig {
  id: string
  name: string
  description: string
  minMembers: number
  maxMembers: number
  targetAudience: string
  checkpoints?: string[]
}

export interface FormFieldConfig {
  key: string
  label: string
  type: FormFieldType
  required: boolean
  appliesTo?: 'team' | 'member'
  options?: string[]
}

export interface MaterialRule {
  id: string
  name: string
  description: string
  requiredForRoleTypes: string[]
  required: boolean
}

export interface CheckpointConfig {
  id: string
  name: string
  description: string
  order: number
  taskType: CheckpointTaskType
  required: boolean
}

export interface AnnouncementType {
  id: string
  name: string
  description: string
  severity: AnnouncementSeverity
}
