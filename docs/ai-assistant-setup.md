# EasyEvent AI 助手 Alpha 设置

AI 助手通过 Supabase Edge Function 调用 OpenAI。前端不会保存或暴露 `OPENAI_API_KEY`。

## 文件位置

- 前端服务：`src/services/aiService.ts`
- 页面：`src/pages/assistant/AiAssistantPage.tsx`
- Edge Function：`supabase/functions/event-copilot/index.ts`

## 配置步骤

1. 安装并登录 Supabase CLI。
2. 在 Supabase 项目中设置 Edge Function secret：

```bash
supabase secrets set OPENAI_API_KEY=你的 OpenAI Key
```

3. 部署函数：

```bash
supabase functions deploy event-copilot
```

4. 前端 `.env.local` 配置：

```bash
VITE_DATA_ADAPTER=supabase
VITE_SUPABASE_URL=你的 Supabase URL
VITE_SUPABASE_PUBLISHABLE_KEY=你的 publishable key
```

## 安全边界

- AI 只生成解释、摘要和草稿。
- AI 不直接审核通过。
- AI 不直接驳回报名。
- AI 不删除数据。
- AI 不发布紧急通知。
- AI 不提供医疗建议。
- 关键操作必须人工确认。

## 未配置时

如果 Edge Function 或 `OPENAI_API_KEY` 未配置，AI 页面仍可打开，并显示本地安全回复。
