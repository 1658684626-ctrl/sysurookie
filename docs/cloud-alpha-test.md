# EasyEvent 云端 Alpha 闭环测试

当前环境没有 `.env.local` 和 Supabase CLI link。本文件用于在真实 Supabase 项目中执行和验收云端闭环。

## 1. 准备 Supabase

1. 创建 Supabase 项目。
2. 复制 `.env.example` 为 `.env.local`。
3. 填写：

```env
VITE_DATA_ADAPTER=supabase
VITE_ENABLE_DEV_TOOLS=false
VITE_SUPABASE_URL=你的 Supabase URL
VITE_SUPABASE_PUBLISHABLE_KEY=你的 publishable key
```

4. 重启本地开发服务。

## 2. 执行数据库 SQL

在 Supabase SQL Editor 中按顺序执行：

1. `db/schema.sql`
2. `db/rls-policies.sql`
3. `db/seed.sql`

`db/seed.sql` 会创建组织、赛事、项目、点位和基础公告，不会创建 auth 用户。

## 3. 注册与 Profile

1. 打开 App。
2. 注册一个账号。
3. 登录后进入 App。
4. 在 Supabase Table Editor 查看 `profiles` 是否创建了当前用户记录。

如果要测试管理端审核，请把该 profile 的 `role` 临时改为 `event_admin` 或 `org_admin`，并设置 `organization_id` 为 seed 中的组织：

```text
11111111-1111-4111-8111-111111111111
```

## 4. 报名到审核闭环

1. 进入“赛事大厅”。
2. 选择 seed 中的赛事。
3. 创建报名并填写成员资料。
4. 提交审核。
5. 在 Supabase `registrations` 表确认状态变为 `pending_review`。
6. 使用有管理角色的账号进入管理后台。
7. 审核通过。
8. 确认为正式报名。
9. 检查 `audit_logs` 是否写入 `approved` 和 `registered`。

## 5. 签到检录闭环

1. 管理后台进入“签到检录”。
2. 对 `registered` 报名点击签到。
3. 检查 `checkin_status` 为 `checked_in`。
4. 点击标记出发。
5. 检查 `checkin_status` 为 `departed`，`execution_status` 为 `in_progress`。
6. 检查 `audit_logs` 是否写入 `checked_in` 和 `departed`。

## 6. 点位任务闭环

1. 参赛者进入点位任务。
2. 模拟到达点位。
3. 提交任务。
4. 检查 `checkpoint_progress` 中对应记录为 `submitted`。
5. 管理后台进入“现场执行”。
6. 审核 submitted 点位任务通过。
7. 检查 `checkpoint_progress.status` 为 `approved`。
8. 所有必需点位通过后标记完赛。
9. 检查 `registrations.execution_status` 为 `finished`。

## 7. 通知公告闭环

1. 管理后台进入“通知公告”。
2. 创建草稿通知。
3. 发布通知。
4. 参赛者进入通知中心。
5. 点击确认已读。
6. 检查 `announcement_confirmations` 是否写入记录。
7. 管理后台查看确认率变化。

## 8. 常见问题

- 看不到赛事：确认 `db/seed.sql` 已执行，且 `events.status = published`。
- 无法审核：确认当前 profile 的 `role` 是 `reviewer`、`event_admin` 或 `org_admin`。
- 无法签到：报名必须先变为 `registered`。
- 无法点位打卡：报名必须 `registered`，且 `checkin_status = departed`。
- 看不到通知：通知必须已发布，且目标范围匹配当前报名。
- AI 不回复：确认 Supabase Edge Function 已部署，并设置 `OPENAI_API_KEY`。
