# EasyEvent Service 层说明

## 为什么抽离 Service 层

EasyEvent 需要同时支持本地开发模式和云端产品模式。Service 层的目的，是让页面只调用业务 API，不关心底层数据来自 localStorage 还是 Supabase。

这样后续迁移签到、点位、通知、文件上传和推送时，可以替换 adapter 或补充 service，而不需要大规模重写页面组件。

## 当前结构

```text
src/services/
  adapters/
    types.ts
    localStorageAdapter.ts
    supabaseAdapter.stub.ts
    supabaseAdapter.ts
    supabaseTransforms.ts
  serviceClient.ts
  authService.ts
  eventService.ts
  registrationService.ts
  reviewService.ts
  checkinService.ts
  checkpointService.ts
  announcementService.ts
  analyticsService.ts
  demoService.ts
  index.ts
```

## Adapter 选择

`serviceClient.ts` 根据环境变量选择当前 adapter：

```env
VITE_DATA_ADAPTER=supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

规则：

- `VITE_DATA_ADAPTER=supabase` 且 Supabase 环境变量完整：使用 `supabaseAdapter`。
- 开发环境中选择 Supabase 但环境变量缺失：回退到 `localStorageAdapter`，避免本地调试白屏。
- 生产环境中选择 Supabase 但环境变量缺失：显示“后端未配置”的友好提示。
- `VITE_DATA_ADAPTER=localStorage`：使用本地开发模式，不要求登录。

## localStorage Adapter

`localStorageAdapter` 继续复用 `src/utils/storage.ts`：

- 报名数据：`easyevent.registrations`。
- 通知数据：`easyevent.announcements`。
- 当前赛事 ID：沿用已有 key。
- 本地示例数据来自 `src/data/`。

localStorage 模式只用于开发、离线预览和 fallback，不作为正式产品数据源。

## Supabase Adapter

`supabaseAdapter.ts` 已实现最小云端闭环：

- `events.getEventTemplates()`：读取 `events` + `event_projects`。
- `registrations.getRegistrations()`：读取报名、成员和审核日志。
- `registrations.createRegistration()`：写入报名和成员。
- `registrations.updateRegistration()`：更新报名并替换成员。
- `registrations.deleteRegistration()`：删除报名。
- `reviews.approveRegistration()`：审核通过并写 audit log。
- `reviews.rejectRegistration()`：驳回并写 audit log。
- `reviews.markRegistrationAsRegistered()`：确认为正式报名并写 audit log。
- `reviews.appendAuditLog()`：追加审核日志。

暂未迁移：

- 签到检录云端写入。
- 点位任务云端写入。
- 通知公告云端写入。
- 数据复盘云端聚合。
- 本地 seed 工具的云端版本。

这些方法在 Supabase adapter 中会返回明确中文错误，避免静默失败。

## Auth Service

`authService.ts` 封装 Supabase Auth：

- `getCurrentSession()`
- `getCurrentUser()`
- `signInWithEmail()`
- `signInWithPassword()`
- `signUpWithPassword()`
- `signOut()`
- `getCurrentProfile()`
- `ensureProfile()`

页面不直接调用 `supabase.auth`。

## 保持纯函数的工具

以下文件继续保持纯函数，不直接读写 localStorage 或 Supabase：

- `statusFlow.ts`
- `validators.ts`
- `checkin.ts`
- `checkpoints.ts`
- `announcements.ts`
- `analytics.ts`

它们只负责状态标签、规则校验、筛选、统计和复盘计算。

## 下一步迁移顺序

1. 验证 Supabase Auth、profiles、events、registrations 和 review flows。
2. 迁移签到检录：`checkInRegistration`、`markRegistrationDeparted`。
3. 迁移点位任务：到达、提交、审核、异常、完赛。
4. 迁移通知公告：创建、发布、确认已读。
5. 将材料和点位证据接入 Supabase Storage。
6. 增加组织成员、角色管理和邀请机制。
