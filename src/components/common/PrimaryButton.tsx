import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'neon'
type ButtonSize = 'sm' | 'md' | 'lg'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  tone?: 'primary' | 'secondary' | 'danger'
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
}

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--ee-deep-olive)] text-[#F8F6EF] shadow-[0_14px_34px_rgba(51,70,45,0.22)] hover:bg-[#24331f] disabled:bg-slate-400 disabled:shadow-none',
  secondary:
    'border border-[var(--ee-line)] bg-[#F8F6EF]/88 text-[var(--ee-text)] shadow-sm hover:border-[#6C765F]/40 hover:bg-white disabled:text-slate-400',
  ghost:
    'border border-[rgba(248,246,239,0.16)] bg-white/8 text-[#F8F6EF] backdrop-blur hover:border-[#B6FF4D]/40 hover:bg-white/14 disabled:text-slate-500',
  danger:
    'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-[0_0_28px_rgba(244,63,94,0.22)] hover:from-rose-500 hover:to-pink-500 disabled:bg-rose-200 disabled:shadow-none',
  success:
    'bg-gradient-to-r from-[#4F8B59] to-[#6F8F5E] text-white shadow-[0_16px_30px_rgba(79,139,89,0.22)] hover:from-[#426f4a] hover:to-[#5f7f50] disabled:bg-emerald-200 disabled:shadow-none',
  neon:
    'border border-[#B6FF4D]/50 bg-[#B6FF4D]/18 text-[var(--ee-deep-olive)] shadow-[0_0_32px_rgba(182,255,77,0.26)] backdrop-blur hover:bg-[#B6FF4D]/30 disabled:text-slate-500',
}

const sizeClassNames: Record<ButtonSize, string> = {
  sm: 'min-h-9 rounded-2xl px-3 py-2 text-xs',
  md: 'min-h-11 rounded-3xl px-4 py-2.5 text-sm',
  lg: 'min-h-12 rounded-3xl px-5 py-3 text-base',
}

export function PrimaryButton({
  children,
  className,
  tone = 'primary',
  variant,
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  type = 'button',
  ...props
}: PrimaryButtonProps) {
  const resolvedVariant = variant ?? tone

  return (
    <button
      type={type}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold transition duration-200 hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-70',
        sizeClassNames[size],
        variantClassNames[resolvedVariant],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}
