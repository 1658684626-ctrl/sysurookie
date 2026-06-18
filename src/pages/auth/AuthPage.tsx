import { useState } from 'react'
import type { ReactNode } from 'react'
import { LockKeyhole, Mail, UserPlus } from 'lucide-react'
import { AppLogo } from '../../components/common/AppLogo'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import { SectionCard } from '../../components/common/SectionCard'
import * as authService from '../../services/authService'

interface AuthPageProps {
  onAuthenticated: () => void
}

type AuthMode = 'login' | 'signup'

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setMessage('')
    setErrorMessage('')

    if (!email.trim() || !password.trim()) {
      setErrorMessage('请填写邮箱和密码。')
      return
    }

    if (password.length < 6) {
      setErrorMessage('密码至少需要 6 位。')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signup') {
        await authService.signUpWithPassword(email.trim(), password, displayName.trim())
        setMessage('注册已提交。如 Supabase 开启邮箱确认，请先完成邮箱验证后再登录。')
      } else {
        await authService.signInWithPassword(email.trim(), password)
        onAuthenticated()
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '认证失败，请稍后再试。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--ee-bg)] px-4 py-10 text-white">
      <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-emerald-400/18 blur-3xl" />
      <SectionCard variant="command" className="w-full max-w-lg">
        <div className="space-y-6">
          <AppLogo />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
              EasyEvent Account
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
              登录 EasyEvent
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              登录后可同步赛事、报名和审核数据。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/14 bg-white/8 p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`min-h-10 rounded-xl text-sm font-semibold transition ${
                mode === 'login'
                  ? 'bg-cyan-400/18 text-white'
                  : 'text-slate-300 hover:bg-white/8'
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`min-h-10 rounded-xl text-sm font-semibold transition ${
                mode === 'signup'
                  ? 'bg-cyan-400/18 text-white'
                  : 'text-slate-300 hover:bg-white/8'
              }`}
            >
              注册
            </button>
          </div>

          <div className="space-y-4">
            {mode === 'signup' && (
              <AuthField
                icon={<UserPlus className="h-4 w-4" />}
                label="昵称"
                placeholder="例如：赛事负责人"
                value={displayName}
                onChange={setDisplayName}
              />
            )}
            <AuthField
              icon={<Mail className="h-4 w-4" />}
              label="邮箱"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
            />
            <AuthField
              icon={<LockKeyhole className="h-4 w-4" />}
              label="密码"
              placeholder="至少 6 位"
              type="password"
              value={password}
              onChange={setPassword}
            />
          </div>

          {errorMessage && (
            <p className="rounded-2xl border border-rose-300/40 bg-rose-400/12 p-3 text-sm text-rose-100">
              {errorMessage}
            </p>
          )}
          {message && (
            <p className="rounded-2xl border border-emerald-300/40 bg-emerald-400/12 p-3 text-sm text-emerald-100">
              {message}
            </p>
          )}

          <PrimaryButton fullWidth loading={loading} size="lg" onClick={handleSubmit}>
            {mode === 'login' ? '登录' : '注册账号'}
          </PrimaryButton>
        </div>
      </SectionCard>
    </main>
  )
}

function AuthField({
  icon,
  label,
  onChange,
  placeholder,
  type = 'text',
  value,
}: {
  icon: ReactNode
  label: string
  onChange: (value: string) => void
  placeholder: string
  type?: string
  value: string
}) {
  return (
    <label className="block text-sm font-semibold text-slate-200">
      {label}
      <div className="mt-2 flex items-center gap-2 rounded-2xl border border-cyan-200/20 bg-slate-950/70 px-3 text-slate-400">
        {icon}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="auth-input h-12 min-w-0 flex-1 appearance-none bg-transparent text-white caret-cyan-200 outline-none placeholder:text-slate-500"
          style={{ WebkitTextFillColor: '#ffffff' }}
        />
      </div>
    </label>
  )
}
