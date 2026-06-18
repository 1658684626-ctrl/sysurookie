import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import * as authService from '../../services/authService'
import { getConfiguredAdapterName, shouldRequireAuth } from '../../services/serviceClient'
import { EmptyState } from '../../components/common/EmptyState'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import { AuthPage } from './AuthPage'

interface AuthGateProps {
  children: ReactNode
}

export function AuthGate({ children }: AuthGateProps) {
  const needsAuth = shouldRequireAuth()
  const configuredAdapter = getConfiguredAdapterName()
  const [loading, setLoading] = useState(needsAuth)
  const [authenticated, setAuthenticated] = useState(!needsAuth)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!needsAuth) {
      return
    }

    let active = true

    if (!isSupabaseConfigured) {
      queueMicrotask(() => {
        if (!active) {
          return
        }
        setErrorMessage('云端数据模式尚未配置，请检查 Supabase 环境变量。')
        setAuthenticated(false)
        setLoading(false)
      })
      return () => {
        active = false
      }
    }

    authService
      .getCurrentSession()
      .then((session) => {
        if (!active) {
          return
        }
        setAuthenticated(Boolean(session))
        setErrorMessage('')
      })
      .catch((error: unknown) => {
        if (!active) {
          return
        }
        setErrorMessage(error instanceof Error ? error.message : '读取登录状态失败。')
        setAuthenticated(false)
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [needsAuth])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--ee-bg)] px-4">
        <div className="rounded-3xl border border-cyan-200/20 bg-slate-950/70 p-6 text-center text-slate-200 shadow-[0_0_44px_rgba(34,211,238,0.16)] backdrop-blur">
          正在检查登录状态...
        </div>
      </main>
    )
  }

  if (needsAuth && !authenticated) {
    if (errorMessage && configuredAdapter === 'supabase') {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--ee-bg)] px-4">
          <div className="w-full max-w-lg space-y-4">
            <EmptyState
              title="后端未配置"
              description="当前启用了云端数据模式，但 Supabase URL 或 publishable key 尚未配置。请配置 .env.local 后重启应用。"
            />
            <PrimaryButton fullWidth variant="ghost" onClick={() => window.location.reload()}>
              重新检查
            </PrimaryButton>
          </div>
        </main>
      )
    }

    return <AuthPage onAuthenticated={() => setAuthenticated(true)} />
  }

  return children
}
