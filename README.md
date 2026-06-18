# EasyEvent 易赛通

EasyEvent（易赛通）是一个面向中小型体育赛事的一站式数字化管理 App。它把赛事配置、报名组队、资料审核、签到检录、现场执行、通知确认和数据复盘整合到统一系统，减少微信群、问卷、Excel、纸质签到表和人工核对带来的运营混乱。

首个产品场景来自“珠海城市鲁宾逊趣味定向赛”，但系统不写死为单场赛事专用；赛事、项目、报名模式和规则都通过配置扩展，可复用到校园跑、篮球赛、亲子运动会、企业团建运动赛和徒步活动。

## 产品定位

EasyEvent 不是普通报名表，而是中小型体育赛事的数字化运营工具：

赛事配置 -> 报名 / 组队 -> 资料审核 -> 正式报名 -> 签到检录 -> 出发 -> 点位任务 -> 通知确认 -> 数据复盘

## 当前能力

- 赛事模板配置与赛事切换。
- 参赛者报名 / 组队 / 成员资料填写。
- 系统规则校验与缺失项提示。
- 管理端报名审核、驳回和确认为正式报名。
- 签到码、检录签到和标记出发。
- 点位打卡、任务提交、现场执行管理、异常关注和完赛。
- 通知公告发布与已读确认。
- 数据复盘指标、项目表现、点位任务和通知确认统计。
- Capacitor Android / iOS App 化基础。
- Supabase Auth / Database 最小后端闭环准备。
- AI 助手 Alpha：通过 Supabase Edge Function 调用 AI 服务，关键操作必须人工确认。
- Android APK / AAB 构建脚本。
- localStorage 本地开发模式 fallback。

## 技术栈

- Vite
- React
- TypeScript
- Tailwind CSS
- lucide-react
- clsx
- zod
- motion
- Capacitor
- Supabase Auth / Database
- localStorage 开发 fallback

## 数据模式

EasyEvent 支持两种数据模式：

- 云端数据模式：`VITE_DATA_ADAPTER=supabase`，用于真实产品开发。需要配置 Supabase URL、publishable key，并登录后使用。
- 本地开发模式：`VITE_DATA_ADAPTER=localStorage`，用于离线预览、开发调试和 fallback，不需要登录。

`.env.example`：

```env
VITE_DATA_ADAPTER=supabase
VITE_ENABLE_DEV_TOOLS=false
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

不要提交真实 `.env.local`，也不要使用 Supabase `service_role` key。

## AI 助手 Alpha

AI 助手前端只调用 Supabase Edge Function：`supabase/functions/event-copilot`。OpenAI key 只放在 Supabase Function secret 中：

```bash
supabase secrets set OPENAI_API_KEY=你的 OpenAI Key
supabase functions deploy event-copilot
```

AI 助手只生成解释、摘要和草稿，不会直接审核、驳回、删除、发布紧急通知或提供医疗建议。配置说明见 [docs/ai-assistant-setup.md](/Users/shawn/Documents/Codex/2026-05-28/easyevent-easyevent-mvp-1-2-3/docs/ai-assistant-setup.md)。

## 安装与启动

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
```

Capacitor 同步：

```bash
npm run cap:sync
```

Android 测试包：

```bash
npm run android:debug-apk
```

Debug APK 产物路径：

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Release APK 和 AAB：

```bash
npm run android:release-apk
npm run android:bundle
```

正式分发前需要配置 Android 签名，不能把 keystore 或密码提交到仓库。

类型检查和 lint：

```bash
npm run typecheck
npm run lint
```

## 产品官网

独立官网位于 `website/`，用于介绍 EasyEvent 的产品定位、可复用赛事模板、未来健康 / 可穿戴集成、AI Assistant 路线、下载入口和联系入口。

官网视觉 2.0 采用 editorial futurism 方向：米白 / 墨色 / 酸性绿、超大 serif 标题、细线边框、编号模块和抽象生成式赛事网络。它用于品牌叙事和下载联系，不承载主 App 业务流程。

官网支持右上角中英文切换，主要文案集中在 `website/src/data/content.ts`。联系邮箱显示为 `1658684626@qq.com`。

官网运行：

```bash
npm run website:dev
```

官网构建：

```bash
npm run website:build
```

官网不接健康 API、AI API、支付、地图、推送或后端服务。联系表单只提供前端成功提示和邮件草稿入口。

官网发布到公网：

- 根目录已提供 `netlify.toml`、`vercel.json`
- 根目录已提供 GitHub Pages 工作流：`.github/workflows/deploy-website.yml`
- 详细说明见 [docs/public-website-deploy.md](docs/public-website-deploy.md)

公网发布推荐路径：

1. 首次快速展示：Netlify Drop（拖拽 `website/dist`）
2. 正式公开页：接入 Netlify / Vercel / GitHub Pages 中任意一种

网站已配置为可发布静态产物（`website/dist`），不依赖本地 App 环境。

## Supabase 后端最小闭环

本阶段已经接入 Supabase 基础设施，但没有全量迁移所有业务模块。默认产品模式使用 Supabase；如果环境变量缺失，开发环境会回退到 localStorage，本地预览不会白屏。

已实现：

- `src/lib/supabaseClient.ts`：Supabase client 初始化与配置检测。
- `src/services/authService.ts`：登录、注册、退出、session、profile 初始化。
- `src/pages/auth/AuthGate.tsx`：Supabase 模式下要求登录；localStorage 模式可直接进入。
- `src/pages/auth/AuthPage.tsx`：邮箱密码登录 / 注册界面。
- `src/services/adapters/supabaseAdapter.ts`：events、registrations、reviews 的最小云端 adapter。
- `src/services/adapters/supabaseTransforms.ts`：Supabase snake_case 与前端 camelCase 类型转换。
- `db/schema.sql`：最小可执行数据库 schema。
- `db/rls-policies.sql`：RLS 权限策略第一版。
- `db/seed.sql`：可选初始化组织、赛事和项目。

Supabase 当前覆盖：

- organizations
- profiles
- events
- event_projects
- event_checkpoints
- registrations
- registration_members
- audit_logs
- checkpoint_progress
- announcements
- announcement_confirmations
- ai_conversations
- ai_messages

暂未云端迁移：

- 数据复盘云端聚合。
- 文件上传、扫码、推送和地图能力。

完整配置步骤见 [docs/supabase-setup.md](docs/supabase-setup.md)。
云端 Alpha 闭环测试见 [docs/cloud-alpha-test.md](docs/cloud-alpha-test.md)。

## Capacitor App 化

当前移动端路线：

React + Vite + TypeScript Web App -> Capacitor -> Android / iOS App

已完成：

- `capacitor.config.ts`
- Android 原生项目：`android/`
- iOS 原生项目：`ios/`
- App ID：`com.easyevent.app`
- App Name：`EasyEvent`
- Web 构建目录：`dist`
- App icon / splash 资源目录：`assets/`

同步到原生项目：

```bash
npm run cap:sync
```

打开 Android / iOS 工程：

```bash
npm run cap:open:android
npm run cap:open:ios
```

真机和模拟器检查见 [docs/native-preview-checklist.md](docs/native-preview-checklist.md)。

## 目录结构

```text
src/
  app/
  components/common/
  data/
  lib/
  pages/
    auth/
    admin/
    participant/
  services/
    adapters/
  types/
  utils/
db/
  schema.sql
  rls-policies.sql
  seed.sql
docs/
android/
ios/
assets/
```

说明：

- `src/pages/demo/` 和早期演示文档作为历史开发材料保留，但不再出现在产品 UI 中。
- `mockRegistrations` / `mockAnnouncements` 只服务于 localStorage 开发模式。
- 页面不直接调用 Supabase；数据读写通过 `src/services/`。

## 文档入口

- Supabase 配置：[docs/supabase-setup.md](docs/supabase-setup.md)
- 云端 Alpha 测试：[docs/cloud-alpha-test.md](docs/cloud-alpha-test.md)
- Auth 与角色设计：[docs/auth-and-roles-plan.md](docs/auth-and-roles-plan.md)
- 数据库映射：[docs/database-mapping.md](docs/database-mapping.md)
- Service 层说明：[docs/service-layer-plan.md](docs/service-layer-plan.md)
- App 路线：[docs/app-roadmap.md](docs/app-roadmap.md)
- 发布路线：[docs/release-roadmap.md](docs/release-roadmap.md)
- 产品愿景：[docs/product-vision.md](docs/product-vision.md)
- 官网设计说明：[docs/website-design-notes.md](docs/website-design-notes.md)
- 真机预览：[docs/native-preview-checklist.md](docs/native-preview-checklist.md)
- 移动端 QA：[docs/mobile-qa-checklist.md](docs/mobile-qa-checklist.md)

## 当前边界

当前阶段不做：

- 支付。
- 真实扫码。
- 文件上传。
- 推送通知。
- 地图 / GPS。
- App Store / Google Play 正式上架。
- 复杂权限后台。
- 全量迁移签到、点位、通知和复盘模块。

## 下一阶段建议

1. 在真实 Supabase 项目中执行 `db/schema.sql`、`db/rls-policies.sql` 和 `db/seed.sql`。
2. 用测试账号验证注册、登录、profile 创建、赛事读取、报名创建和审核状态流。
3. 继续迁移签到检录、点位任务、通知公告到 Supabase adapter。
4. 增加管理员角色管理和组织成员邀请。
5. 准备 Android signed APK / TestFlight 内测。
