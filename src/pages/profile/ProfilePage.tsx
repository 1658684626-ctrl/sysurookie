import { useEffect, useState } from 'react'
import { LogOut, Settings, Shield, UserRound } from 'lucide-react'
import { EmptyState } from '../../components/common/EmptyState'
import { HealthSignalPreview } from '../../components/common/HealthSignalPreview'
import { InfoRow } from '../../components/common/InfoRow'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import * as authService from '../../services/authService'
import { getActiveAdapterName, getConfiguredAdapterName } from '../../services/serviceClient'
import { isSupabaseConfigured } from '../../lib/supabaseClient'

export function ProfilePage() {
  const [profile, setProfile] = useState<authService.UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true

    authService
      .getCurrentProfile()
      .then((nextProfile) => {
        if (active) {
          setProfile(nextProfile)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const handleSignOut = async () => {
    setMessage('')
    try {
      await authService.signOut()
      window.location.reload()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '退出登录失败。')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <SectionCard
        variant="glow"
        title="我的"
        description="管理个人信息、组织身份和账号状态。"
      >
        {loading ? (
          <EmptyState title="正在读取账号信息" description="请稍候。" />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-[2rem] border border-[var(--ee-line)] bg-white/70 p-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--ee-deep-olive)] text-[#F8F6EF]">
                <UserRound className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--ee-text)]">
                  {profile?.displayName ?? 'EasyEvent 用户'}
                </h2>
                <p className="mt-1 text-sm text-[var(--ee-muted)]">
                  {profile?.role ?? 'participant'}
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              <InfoRow label="账号状态" value={profile ? '已登录' : '本机使用'} />
              <InfoRow label="当前组织" value={profile?.organizationId ?? '未加入组织'} />
              <InfoRow label="App 版本" value="Alpha 0.1" />
            </div>

            {profile && (
              <PrimaryButton variant="danger" onClick={() => void handleSignOut()}>
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                退出登录
              </PrimaryButton>
            )}

            {message && (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                {message}
              </p>
            )}
          </div>
        )}
      </SectionCard>

      <div className="space-y-6">
        <SectionCard title="安全与数据" description="账号、组织和数据服务状态。">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-3xl border border-[var(--ee-line)] bg-white/70 p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-[var(--ee-deep-olive)]" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-[var(--ee-text)]">数据服务</p>
                  <p className="text-sm text-[var(--ee-muted)]">
                    {getActiveAdapterName() === 'supabase' ? '云端模式' : '本机模式'}
                  </p>
                </div>
              </div>
              <StatusBadge
                label={getActiveAdapterName() === 'supabase' ? 'Cloud' : 'Local'}
                tone={getActiveAdapterName() === 'supabase' ? 'success' : 'warning'}
              />
            </div>

            <details className="rounded-3xl border border-[var(--ee-line)] bg-white/70 p-4">
              <summary className="flex cursor-pointer items-center gap-2 font-semibold text-[var(--ee-text)]">
                <Settings className="h-4 w-4" aria-hidden="true" />
                开发者设置
              </summary>
              <div className="mt-3 space-y-2 text-sm text-[var(--ee-muted)]">
                <p>配置适配器：{getConfiguredAdapterName()}</p>
                <p>实际适配器：{getActiveAdapterName()}</p>
                <p>Supabase 配置：{isSupabaseConfigured ? '已配置' : '未配置'}</p>
              </div>
            </details>
          </div>
        </SectionCard>

        <HealthSignalPreview />
      </div>
    </div>
  )
}
