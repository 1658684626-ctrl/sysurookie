import { localStorageAdapter } from './adapters/localStorageAdapter'
import { supabaseAdapter } from './adapters/supabaseAdapter'
import type { RepositoryClient } from './adapters/types'
import { isSupabaseConfigured } from '../lib/supabaseClient'

export type DataAdapterName = 'localStorage' | 'supabase'

export function getConfiguredAdapterName(): DataAdapterName {
  return import.meta.env.VITE_DATA_ADAPTER === 'supabase'
    ? 'supabase'
    : 'localStorage'
}

export function createServiceClient(): RepositoryClient {
  const adapterName = getConfiguredAdapterName()

  if (adapterName === 'supabase') {
    if (isSupabaseConfigured) {
      return supabaseAdapter
    }

    console.warn('Supabase 环境变量未配置，已回退到本机数据模式。')
  }

  return localStorageAdapter
}

export const serviceClient = createServiceClient()

export function getActiveAdapterName(): DataAdapterName {
  return getConfiguredAdapterName() === 'supabase' && isSupabaseConfigured
    ? 'supabase'
    : 'localStorage'
}

export function shouldRequireAuth(): boolean {
  return getConfiguredAdapterName() === 'supabase' && isSupabaseConfigured
}

export function isDevToolsEnabled(): boolean {
  return import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true'
}
