# EasyEvent 数据库映射草案

## 映射总览

当前 TypeScript 类型与 Supabase/PostgreSQL 表的建议映射如下：

| TypeScript 类型 | 数据库表 |
| --- | --- |
| `EventConfig` | `events` + `event_projects` + `event_form_fields` + `event_material_rules` + `event_checkpoints` + `event_announcement_types` |
| `ProjectConfig` | `event_projects` |
| `FormFieldConfig` | `event_form_fields` |
| `MaterialRule` | `event_material_rules` |
| `CheckpointConfig` | `event_checkpoints` |
| `AnnouncementType` | `event_announcement_types` |
| `Registration` | `registrations` |
| `Member` | `registration_members` |
| `MemberMaterial` | `member_materials` |
| `AuditLog` | `audit_logs` |
| `CheckpointProgress` | `checkpoint_progress` |
| `Announcement` | `announcements` |
| `AnnouncementConfirmation` | `announcement_confirmations` |

## EventConfig 拆表原因

`EventConfig` 在前端是一个完整赛事模板对象，但数据库需要支持筛选、权限和部分更新，所以建议拆成多张表：

- `events`：赛事基础信息、报名模式、签到模式、状态。
- `event_projects`：路线 / 项目、人数规则、目标人群、点位顺序。
- `event_form_fields`：动态成员字段。
- `event_material_rules`：材料规则。
- `event_checkpoints`：点位和任务类型。
- `event_announcement_types`：通知类型。

## 结构化字段

以下字段需要结构化，方便筛选、统计和 RLS：

- `event_id`
- `project_id`
- `organization_id`
- `owner_profile_id`
- `status`
- `checkin_status`
- `execution_status`
- `registration_mode`
- `checkin_mode`
- `role`
- `severity`
- `target_scope`

这些字段会被管理端列表、数据复盘、RLS 策略和索引用到。

## jsonb 字段

以下内容可以用 `jsonb` 保持灵活：

- `events.config`：赛事扩展配置。
- `event_projects.config`：项目扩展规则。
- `event_form_fields.options`：select 选项。
- `registration_members.form_data`：动态表单字段值。
- `registrations.metadata`：演示或扩展字段，例如旧版 `announcementsConfirmed`。
- `announcements.target_filters`：后续更复杂的定向规则。
- `profiles.metadata`：用户扩展信息。

原则是：常用筛选条件结构化，不稳定的扩展配置放 `jsonb`。

## localStorage 数据迁移思路

当前本地数据：

- 报名：`easyevent.registrations`
- 通知：`easyevent.announcements`
- 当前赛事 ID：沿用本地 key

未来迁移可分三步：

1. 先把 `eventTemplates` seed 到 `events` 和赛事配置子表。
2. 再把 `mockRegistrations` 拆分写入 `registrations`、`registration_members`、`member_materials`、`audit_logs`、`checkpoint_progress`。
3. 最后把 `mockAnnouncements` 写入 `announcements` 和 `announcement_confirmations`。

迁移脚本应是一次性 seed 工具，不应在页面组件中写入 mock 数据。

## mock 数据如何 seed 到 Supabase

建议后续新增 `db/seed-demo.sql` 或 `scripts/seed-supabase-demo.mjs`：

- 使用固定 UUID，保证课堂演示稳定。
- 先插入 organization 和 profiles。
- 再插入 events 和配置子表。
- 最后插入 registrations、announcements 和确认记录。

本阶段不执行 seed，也不连接真实 Supabase 项目。

## 后续 service 方法迁移优先级

建议按风险从低到高迁移：

1. `events.getEventTemplates()`：从数据库读取赛事配置。
2. `registrations.getRegistrationsByEventId()`：管理端只读列表。
3. `announcements.getAnnouncementsByEventId()`：通知列表只读。
4. 审核、签到、点位、通知确认等写操作。
5. Auth 登录和 RLS 验证。
6. Storage 文件上传和材料审核。

这样可以在不破坏课堂 MVP 的前提下逐步从 localStorage adapter 过渡到 Supabase adapter。
