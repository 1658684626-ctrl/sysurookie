import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
)

let supabaseClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null
  }

  supabaseClient ??= createClient(supabaseUrl, supabasePublishableKey)

  return supabaseClient
}

export function maybeSupabaseClient(): SupabaseClient | null {
  return getSupabaseClient()
}

export function requireSupabaseClient(): SupabaseClient {
  const client = getSupabaseClient()

  if (!client) {
    throw new Error('Supabase 尚未配置，请检查 .env.local 中的 URL 和 publishable key。')
  }

  return client
}
