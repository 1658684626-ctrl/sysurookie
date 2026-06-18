import { useMemo, useState } from 'react'
import { Bot, SendHorizontal } from 'lucide-react'
import { PixelCopilot } from '../../components/common/PixelCopilot'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import { SectionCard } from '../../components/common/SectionCard'
import { VoiceOrb } from '../../components/common/VoiceOrb'
import type { EventConfig } from '../../types/event'
import type { Registration } from '../../types/registration'
import * as aiService from '../../services/aiService'

interface AiAssistantPageProps {
  selectedEvent: EventConfig
  registrations: Registration[]
}

const quickPrompts = [
  '我现在报名成功了吗？',
  '我还缺什么资料？',
  '帮我总结当前赛事状态',
  '生成一条天气提醒草稿',
]

export function AiAssistantPage({
  registrations,
  selectedEvent,
}: AiAssistantPageProps) {
  const [messages, setMessages] = useState<aiService.AiMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '你好，我是 EasyEvent 赛事助手。你可以问我报名状态、缺失资料、签到进度、通知摘要或管理端运营概况。',
      createdAt: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | undefined>()

  const contextRegistration = useMemo(
    () => registrations[0],
    [registrations],
  )

  const handleSend = async (nextMessage = input) => {
    const trimmed = nextMessage.trim()

    if (!trimmed || loading) {
      return
    }

    const userMessage: aiService.AiMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    }

    setMessages((currentMessages) => [...currentMessages, userMessage])
    setInput('')
    setLoading(true)

    try {
      const result = await aiService.sendMessage({
        conversationId,
        message: trimmed,
        context: {
          event: selectedEvent,
          registration: contextRegistration,
          role: 'organizer',
        },
      })
      setConversationId(result.conversationId)
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: result.reply,
          createdAt: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4">
        <SectionCard
          variant="command"
          title="Event Copilot"
          description="用于解释状态、生成草稿和总结赛事运营。关键操作仍需人工确认。"
        >
          <PixelCopilot
            state={loading ? 'thinking' : 'speaking'}
            message="我不会直接审核、驳回、删除或发布紧急通知，只会给出建议和草稿。"
            promptChips={quickPrompts}
          />
        </SectionCard>

        <SectionCard title="语音入口" description="语音输入会在移动端权限配置完成后开放。">
          <VoiceOrb state="disabled" label="语音输入即将开放" />
        </SectionCard>
      </div>

      <SectionCard title="对话" description={`当前赛事：${selectedEvent.name}`}>
        <div className="flex min-h-[28rem] flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[86%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'bg-[var(--ee-deep-olive)] text-[#F8F6EF]'
                      : 'border border-[var(--ee-line)] bg-white/70 text-[var(--ee-text)]'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--ee-muted)]">
                      <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                      EasyEvent Copilot
                    </div>
                  )}
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void handleSend(prompt)}
                className="rounded-full border border-[var(--ee-line)] bg-[#E3E8DA]/70 px-3 py-1.5 text-xs font-semibold text-[var(--ee-deep-olive)] transition hover:bg-[#B6FF4D]/35"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="mt-4 flex gap-2 rounded-3xl border border-[var(--ee-line)] bg-white/74 p-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void handleSend()
                }
              }}
              placeholder="输入你的问题..."
              className="min-h-11 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
            />
            <PrimaryButton loading={loading} onClick={() => void handleSend()}>
              <SendHorizontal className="h-4 w-4" aria-hidden="true" />
            </PrimaryButton>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
