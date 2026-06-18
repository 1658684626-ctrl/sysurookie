import { maybeSupabaseClient } from '../lib/supabaseClient'
import type { Registration } from '../types/registration'
import type { EventConfig } from '../types/event'

export interface AiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface AiConversationContext {
  event?: EventConfig
  registration?: Registration
  role?: 'participant' | 'organizer'
}

export interface SendMessageInput {
  message: string
  conversationId?: string
  context?: AiConversationContext
}

export interface SendMessageResult {
  conversationId?: string
  reply: string
}

const fallbackReply =
  '我可以帮你查看报名状态、缺失资料、签到进度和下一步行动。当前 AI 云服务尚未配置时，我会先提供本地说明；配置 Edge Function 和 OPENAI_API_KEY 后可返回实时回答。'

export async function createConversation(context?: AiConversationContext) {
  const client = maybeSupabaseClient()

  if (!client) {
    return `local-${Date.now()}`
  }

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return `local-${Date.now()}`
  }

  const { data, error } = await client
    .from('ai_conversations')
    .insert({
      user_id: user.id,
      event_id: context?.event?.id ?? null,
      registration_id: context?.registration?.id ?? null,
      title: context?.event?.shortName ?? 'EasyEvent Copilot',
    })
    .select('id')
    .single()

  if (error) {
    return `local-${Date.now()}`
  }

  return data.id as string
}

export async function getConversation(conversationId: string): Promise<AiMessage[]> {
  const client = maybeSupabaseClient()

  if (!client || conversationId.startsWith('local-')) {
    return []
  }

  const { data, error } = await client
    .from('ai_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error || !data) {
    return []
  }

  return data.map((message) => ({
    id: message.id as string,
    role: message.role as AiMessage['role'],
    content: message.content as string,
    createdAt: message.created_at as string,
  }))
}

export async function sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
  const client = maybeSupabaseClient()

  if (!client) {
    return {
      conversationId: input.conversationId,
      reply: buildLocalReply(input.message, input.context),
    }
  }

  const { data, error } = await client.functions.invoke('event-copilot', {
    body: input,
  })

  if (error) {
    return {
      conversationId: input.conversationId,
      reply: 'AI 服务暂时不可用。你仍然可以继续使用报名、审核、签到和现场执行功能。',
    }
  }

  return {
    conversationId: data?.conversationId ?? input.conversationId,
    reply: typeof data?.reply === 'string' ? data.reply : fallbackReply,
  }
}

function buildLocalReply(message: string, context?: AiConversationContext) {
  const normalized = message.toLowerCase()

  if (normalized.includes('缺') || normalized.includes('missing')) {
    return '我会优先检查成员资料、必填字段和材料状态。进入“我的报名”可看到具体缺失项。'
  }

  if (normalized.includes('下一') || normalized.includes('next')) {
    return context?.registration
      ? `当前报名状态是 ${context.registration.status}。下一步请根据报名状态页的操作按钮继续。`
      : '你可以先选择赛事并创建报名，我会根据状态提示下一步。'
  }

  if (normalized.includes('通知') || normalized.includes('notice')) {
    return '通知中心会显示与你报名相关的已发布通知，未确认通知会置顶显示。'
  }

  return fallbackReply
}
