# EasyEvent 产品化 Alpha 计划

EasyEvent 的产品化方向是面向中小型体育赛事的移动 App，而不是开发展示页。Alpha 版本保留现有报名、审核、检录、现场执行、通知和复盘流程，并逐步把数据从本机存储迁移到 Supabase。

## 当前 Alpha 范围

- 真实 App 信息架构：赛事大厅、我的报名、AI 助手、管理后台、我的。
- Supabase 基础设施：Auth、profiles、organizations、events、registrations、registration_members、audit_logs。
- AI 助手 Alpha：前端调用 Supabase Edge Function，不暴露 OpenAI key。
- Android APK 脚本：支持 debug APK、release APK 和 AAB 构建入口。
- localStorage fallback：用于本机预览和开发调试。

## 暂不接入

- 支付。
- 地图 / GPS。
- 推送通知。
- 文件上传。
- 真实健康数据。
- App Store / Google Play 正式上架。

## 下一步

1. 在 Supabase 执行 `db/schema.sql` 和 `db/rls-policies.sql`。
2. 配置 `.env.local`。
3. 真实测试注册、登录、赛事读取、报名提交和审核。
4. 配置 Edge Function 的 `OPENAI_API_KEY`。
5. 生成 Android debug APK 做小范围内测。
