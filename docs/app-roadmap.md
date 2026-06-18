# EasyEvent App 路线

## 当前状态

EasyEvent 已从前端原型推进到可 App 化的产品工程：

- React + Vite + TypeScript 前端。
- Capacitor Android / iOS 原生工程。
- App ID：`com.easyevent.app`。
- App Name：`EasyEvent`。
- Web 构建目录：`dist`。
- App icon / splash 资源：`assets/`。
- Service 层与 adapter 架构。
- Supabase Auth / Database 最小闭环准备。
- localStorage 作为开发 fallback。

## 数据路线

当前支持两种模式：

- `VITE_DATA_ADAPTER=supabase`：真实产品模式，要求 Supabase 环境变量和登录。
- `VITE_DATA_ADAPTER=localStorage`：本地开发模式，不要求登录，继续使用本地示例数据。

生产方向是 Supabase。localStorage 只保留为开发、离线预览和故障 fallback。

## 已完成的产品化工作

- 移除产品 UI 中的历史展示入口。
- 接入 `@supabase/supabase-js`。
- 新增 `src/lib/supabaseClient.ts`。
- 新增 `src/services/authService.ts`。
- 新增 `AuthGate` 和 `AuthPage`。
- 将 `supabaseAdapter` 从占位升级为最小实现。
- 新增最小 schema、RLS 策略和 seed SQL。
- 新增 Supabase 设置文档和发布路线文档。

## 下一步路线

1. 在真实 Supabase 项目执行 `db/schema.sql`、`db/rls-policies.sql`、`db/seed.sql`。
2. 验证注册、登录、profile 初始化、赛事读取、报名创建和审核状态流。
3. 完成签到检录云端写入。
4. 完成点位任务和现场执行云端写入。
5. 完成通知公告和已读确认云端写入。
6. 引入 Supabase Storage，替换材料和任务文件名占位。
7. 接入真实二维码和相机扫码。
8. 准备 Android signed APK 和 TestFlight。

## 后续可接入能力

- Supabase Storage：材料证明、点位任务图片、赛事附件。
- Capacitor 相机 / 扫码插件：签到检录和点位任务扫码。
- 推送通知：赛前提醒、现场通知和紧急公告。
- 组织与角色管理：工作人员、审核员、检录员、现场人员、组织管理员。
- PWA：作为轻量移动 Web 分发方案。
- 应用商店发布：隐私协议、用户协议、截图、版本号和审核资料。

## 当前边界

当前阶段不做支付、真实扫码、文件上传、推送通知、地图 / GPS、复杂权限后台或应用商店正式提交。
