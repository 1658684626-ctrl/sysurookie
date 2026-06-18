const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Origin': '*',
}

interface CopilotRequest {
  message?: string
  conversationId?: string
  context?: {
    event?: {
      id: string
      name: string
      shortName?: string
    }
    registration?: {
      id: string
      status: string
      checkinStatus: string
      executionStatus: string
    }
    role?: 'participant' | 'organizer'
  }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const openAiKey = Deno.env.get('OPENAI_API_KEY')

  if (!openAiKey) {
    return json({
      reply:
        'AI 服务尚未配置。请在 Supabase Edge Function 环境变量中设置 OPENAI_API_KEY。',
    })
  }

  const body = (await request.json().catch(() => ({}))) as CopilotRequest
  const userMessage = body.message?.trim()

  if (!userMessage) {
    return json({ reply: '请先输入你想了解的赛事问题。' }, 400)
  }

  const systemPrompt = [
    'You are EasyEvent Copilot, an assistant for sports event operations.',
    'Answer in concise Chinese unless the user asks otherwise.',
    'You may explain status, summarize operations, draft notices, and suggest next steps.',
    'You must not directly approve, reject, delete, publish, or modify event records.',
    'You must not provide medical advice.',
    'For critical actions, say human confirmation is required.',
  ].join('\n')

  const contextText = JSON.stringify(body.context ?? {}, null, 2)
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'system', content: `Current EasyEvent context:\n${contextText}` },
        { role: 'user', content: userMessage },
      ],
      model: 'gpt-4o-mini',
      temperature: 0.4,
    }),
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  if (!response.ok) {
    return json({
      reply: 'AI 服务暂时不可用。请稍后再试，或继续使用赛事状态页完成操作。',
    })
  }

  const data = await response.json()
  const reply =
    data?.choices?.[0]?.message?.content ??
    '我暂时无法生成回答，请稍后再试。'

  return json({
    conversationId: body.conversationId,
    reply,
  })
})

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
    status,
  })
}
