import type { Session, User } from '@supabase/supabase-js'
import { requireSupabaseClient, maybeSupabaseClient } from '../lib/supabaseClient'

export interface UserProfile {
  id: string
  organizationId?: string
  displayName?: string
  email?: string
  phone?: string
  role: string
  createdAt?: string
  updatedAt?: string
}

interface ProfileRow {
  id: string
  organization_id?: string | null
  display_name?: string | null
  email?: string | null
  phone?: string | null
  role: string
  created_at?: string | null
  updated_at?: string | null
}

function mapProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    organizationId: row.organization_id ?? undefined,
    displayName: row.display_name ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    role: row.role,
    createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  }
}

export async function getCurrentSession(): Promise<Session | null> {
  const client = maybeSupabaseClient()

  if (!client) {
    return null
  }

  const { data, error } = await client.auth.getSession()

  if (error) {
    throw new Error(`获取登录状态失败：${error.message}`)
  }

  return data.session
}

export async function getCurrentUser(): Promise<User | null> {
  const client = maybeSupabaseClient()

  if (!client) {
    return null
  }

  const { data, error } = await client.auth.getUser()

  if (error) {
    throw new Error(`获取用户信息失败：${error.message}`)
  }

  return data.user
}

export async function signInWithEmail(email: string) {
  const client = requireSupabaseClient()
  const { error } = await client.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  })

  if (error) {
    throw new Error(`发送登录邮件失败：${error.message}`)
  }
}

export async function signInWithPassword(email: string, password: string) {
  const client = requireSupabaseClient()
  const { data, error } = await client.auth.signInWithPassword({ email, password })

  if (error) {
    throw new Error(`登录失败：${error.message}`)
  }

  await ensureProfile()

  return data
}

export async function signUpWithPassword(
  email: string,
  password: string,
  displayName?: string,
) {
  const client = requireSupabaseClient()
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  })

  if (error) {
    throw new Error(`注册失败：${error.message}`)
  }

  await ensureProfile(displayName)

  return data
}

export async function signOut() {
  const client = requireSupabaseClient()
  const { error } = await client.auth.signOut()

  if (error) {
    throw new Error(`退出登录失败：${error.message}`)
  }
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const client = maybeSupabaseClient()
  const user = await getCurrentUser()

  if (!client || !user) {
    return null
  }

  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    throw new Error(`读取用户资料失败：${error.message}`)
  }

  return data ? mapProfile(data as ProfileRow) : null
}

export async function ensureProfile(displayName?: string): Promise<UserProfile | null> {
  const client = maybeSupabaseClient()
  const user = await getCurrentUser()

  if (!client || !user) {
    return null
  }

  const existingProfile = await getCurrentProfile()

  if (existingProfile) {
    return existingProfile
  }

  const fallbackName =
    displayName || user.user_metadata.display_name || user.email || 'EasyEvent 用户'
  const { data, error } = await client
    .from('profiles')
    .insert({
      id: user.id,
      display_name: fallbackName,
      email: user.email,
      role: 'participant',
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(`创建用户资料失败：${error.message}`)
  }

  return mapProfile(data as ProfileRow)
}
