import { Mic } from 'lucide-react'
import { clsx } from 'clsx'

export type VoiceOrbState = 'idle' | 'listening' | 'processing' | 'disabled'

interface VoiceOrbProps {
  state?: VoiceOrbState
  label?: string
}

const stateText: Record<VoiceOrbState, string> = {
  idle: 'Hold to talk',
  listening: 'Listening...',
  processing: 'Processing...',
  disabled: '语音输入即将开放',
}

export function VoiceOrb({ label, state = 'idle' }: VoiceOrbProps) {
  const active = state === 'listening' || state === 'processing'

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled
        className={clsx(
          'relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#B6FF4D]/50 bg-[var(--ee-deep-olive)] text-[#B6FF4D] shadow-[0_0_36px_rgba(182,255,77,0.22)]',
          active && 'animate-pulse',
        )}
        aria-label={label ?? stateText[state]}
      >
        <span className="absolute inset-2 rounded-full border border-[#B6FF4D]/20" />
        <Mic className="relative h-6 w-6" aria-hidden="true" />
      </button>
      <div>
        <p className="font-mono-ui text-xs uppercase tracking-[0.2em] text-[#B6FF4D]">
          Voice orb
        </p>
        <p className="mt-1 text-sm text-[#E3E8DA]">{label ?? stateText[state]}</p>
      </div>
    </div>
  )
}
