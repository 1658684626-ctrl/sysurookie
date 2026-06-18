import { Bot } from 'lucide-react'
import { clsx } from 'clsx'
import { VoiceOrb, type VoiceOrbState } from './VoiceOrb'

type PixelCopilotState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'alert'

interface PixelCopilotProps {
  state?: PixelCopilotState
  message?: string
  promptChips?: string[]
  compact?: boolean
}

const stateLabel: Record<PixelCopilotState, string> = {
  idle: 'Alpha',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
  alert: 'Needs attention',
}

const voiceStateMap: Record<PixelCopilotState, VoiceOrbState> = {
  idle: 'disabled',
  listening: 'listening',
  thinking: 'processing',
  speaking: 'processing',
  alert: 'idle',
}

export function PixelCopilot({
  compact = false,
  message = '我可以帮你检查报名状态、缺失资料、签到进度和下一点位。关键操作仍需人工确认。',
  promptChips = ['我还差什么资料？', '我的下一点位是哪里？', '哪些队伍需要关注？'],
  state = 'idle',
}: PixelCopilotProps) {
  return (
    <section
      className={clsx(
        'relative overflow-hidden rounded-[2rem] border border-[#B6FF4D]/24 bg-[var(--ee-deep-olive)] p-4 text-[#F8F6EF] shadow-[0_24px_70px_rgba(51,70,45,0.24)]',
        compact ? 'space-y-3' : 'space-y-4',
      )}
    >
      <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#B6FF4D]/22 blur-3xl" />
      <div className="relative flex items-start gap-4">
        <PixelFace state={state} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono-ui text-xs uppercase tracking-[0.2em] text-[#B6FF4D]">
              Event Copilot
            </p>
            <span className="rounded-full border border-[#B6FF4D]/30 px-2 py-0.5 text-[0.68rem] text-[#E3E8DA]">
              {stateLabel[state]}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#E3E8DA]">{message}</p>
        </div>
      </div>

      <div className="relative flex flex-wrap gap-2">
        {promptChips.map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-[#F8F6EF]"
          >
            {chip}
          </span>
        ))}
      </div>

      {!compact && <VoiceOrb state={voiceStateMap[state]} />}
    </section>
  )
}

function PixelFace({ state }: { state: PixelCopilotState }) {
  return (
    <div className="grid h-16 w-16 shrink-0 grid-cols-4 grid-rows-4 gap-1 rounded-2xl border border-[#B6FF4D]/30 bg-[#171915] p-2">
      {Array.from({ length: 16 }).map((_, index) => {
        const activePixels = state === 'alert'
          ? [1, 2, 4, 7, 8, 11, 13, 14]
          : [1, 2, 5, 6, 9, 10, 13, 14]

        return (
          <span
            key={index}
            className={clsx(
              'rounded-[0.2rem]',
              activePixels.includes(index)
                ? 'bg-[#B6FF4D] shadow-[0_0_10px_rgba(182,255,77,0.6)]'
                : 'bg-[#F8F6EF]/10',
            )}
          />
        )
      })}
      <Bot className="sr-only" aria-hidden="true" />
    </div>
  )
}
