import { Send } from 'lucide-react'
import { PixelCopilot } from './PixelCopilot'

interface AiTerminalPanelProps {
  title?: string
  prompts?: string[]
}

export function AiTerminalPanel({
  prompts = ['我还差什么资料？', '我的下一点位是哪里？', '哪些队伍需要关注？', '生成一条天气提醒'],
  title = 'Event Copilot',
}: AiTerminalPanelProps) {
  return (
    <section className="rounded-[2rem] border border-[#B6FF4D]/24 bg-[#171915] p-4 text-[#F8F6EF] shadow-[0_24px_70px_rgba(23,25,21,0.22)]">
      <div className="flex flex-col gap-4 xl:flex-row">
        <div className="xl:w-80">
          <PixelCopilot compact promptChips={prompts.slice(0, 2)} />
        </div>
        <div className="min-w-0 flex-1 rounded-[1.5rem] border border-white/10 bg-black/24 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono-ui text-xs uppercase tracking-[0.22em] text-[#B6FF4D]">
              {title}
            </p>
            <span className="rounded-full border border-[#B6FF4D]/28 px-2 py-1 text-xs text-[#E3E8DA]">
              Alpha
            </span>
          </div>
          <div className="mt-4 space-y-3 text-sm leading-6">
            <p className="rounded-2xl bg-white/8 p-3 text-[#E3E8DA]">
              用户：我现在报名成功了吗？
            </p>
            <p className="rounded-2xl border border-[#B6FF4D]/20 bg-[#B6FF4D]/10 p-3 text-[#F8F6EF]">
              助手：我可以帮你检查报名状态、缺失资料、签到进度和下一点位。关键操作仍需人工确认。
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <span key={prompt} className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-[#E3E8DA]">
                {prompt}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm text-[#E3E8DA]">
            <span className="flex-1">Ask about this event...</span>
            <Send className="h-4 w-4 text-[#B6FF4D]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
