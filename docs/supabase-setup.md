# EasyEvent Supabase 设置指南

## 1. 创建 Supabase 项目

在 Supabase 控制台创建一个新项目，记录：

- Project URL
- Publishable key

不要使用 service_role key 放进前端项目。

## 2. 配置环境变量

复制环境变量示例：

```bash
cp .env.example .env.local
```

填写：

```env
VITE_DATA_ADAPTER=supabase
VITE_ENABLE_DEV_TOOLS=false
VITE_SUPABASE_URL=你的项目 URL
VITE_SUPABASE_PUBLISHABLE_KEY=你的 publishable key
```

## 3. 执行数据库 SQL

在 Supabase SQL Editor 中依次执行：

1. `db/schema.sql`
2. `db/rls-policies.sql`

可选执行：

3. `db/seed.sql`

`seed.sql` 只创建组织、赛事和项目，不会伪造 Auth 用户。

## 4. 启动本地应用

```bash
npm install
npm run dev
```

打开本地地址后，Supabase 模式会要求登录。

## 5. 注册账号

进入登录页后选择“注册”，填写邮箱、密码和昵称。

注意：

- 如果 Supabase 项目开启了邮箱确认，需要先完成邮箱验证。
- 注册后会自动调用 `ensureProfile()` 创建 `profiles` 记录。
- 默认角色是 `participant`。

## 6. 测试最小闭环

推荐测试：

1. 执行 `db/seed.sql`。
2. 注册并登录。
3. 进入赛事大厅。
4. 选择一个赛事。
5. 创建报名。
6. 修改成员资料。
7. 提交审核。

管理审核需要账号具备 `reviewer`、`event_admin` 或 `org_admin` 角色。第一版可以在 Supabase Table Editor 中手动修改 `profiles.role` 和 `profiles.organization_id`。

## 当前限制

本阶段只迁移：

- Auth
- profiles
- organizations
- events
- event_projects
- registrations
- registration_members
- audit_logs

尚未迁移：

- 签到检录云端写入
- 点位任务云端写入
- 通知公告云端写入
- 文件上传
- 推送通知
- 真实扫码
- 地图 / GPS
# Supabase Alpha 设置

本阶段 Supabase 是 EasyEvent 的正式数据模式；localStorage 仅作为本机预览和开发 fallback。

## 快速步骤

1. 创建 Supabase 项目。
2. 复制 `.env.example` 为 `.env.local`。
3. 填写：

```bash
VITE_DATA_ADAPTER=supabase
VITE_SUPABASE_URL=你的 Supabase URL
VITE_SUPABASE_PUBLISHABLE_KEY=你的 publishable key
VITE_ENABLE_DEV_TOOLS=false
```

4. 在 Supabase SQL Editor 执行 `db/schema.sql`。
5. 在 Supabase SQL Editor 执行 `db/rls-policies.sql`。
6. 可选执行 `db/seed.sql` 初始化组织、赛事和项目。
7. 启动 App：

```bash
npm run dev
```

8. 注册账号并测试登录、赛事读取、报名创建和管理端审核。

## 当前已覆盖

- Auth 用户。
- profiles。
- organizations。
- events / event_projects。
- event_checkpoints。
- registrations / registration_members。
- audit_logs。
- checkpoint_progress。
- announcements / announcement_confirmations。
- ai_conversations / ai_messages。

## 当前未覆盖

- 文件上传。
- 推送通知。
- 地图 / GPS。
- 支付。
- 健康数据。
- 文件材料和真实上传。

## 云端闭环测试

执行完 schema、RLS 和 seed 后，按 `docs/cloud-alpha-test.md` 测试：

1. 注册登录。
2. 创建报名。
3. 提交审核。
4. 管理端审核并确认为正式报名。
5. 签到检录并标记出发。
6. 点位到达、提交和审核通过。
7. 发布通知并确认已读。
