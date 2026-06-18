# EasyEvent Auth / Profile / Role 设计

## 为什么需要 Auth

EasyEvent 当前课程 MVP 使用 mock data + localStorage，适合课堂演示。真实上线后，报名资料、手机号、身份证明材料、点位任务证据和通知确认记录都属于赛事运营数据，必须知道“谁在访问、谁在修改、谁能审核”。

Auth 的目标不是增加复杂登录流程，而是支撑：

- 参赛者只能查看和维护自己的报名。
- 队长可以维护本队成员资料。
- 审核员只能处理授权赛事的报名。
- 检录员只能处理现场签到与出发。
- 现场工作人员只能处理点位任务、异常关注和完赛。
- 赛事管理员可以管理该赛事全流程。
- 组织管理员可以管理本组织下多个赛事。

## 角色设计

| 角色 | 主要能力 |
| --- | --- |
| participant | 浏览已发布赛事、创建个人报名、查看自己的状态、确认通知。 |
| captain | 创建队伍报名、维护队伍成员资料、提交审核、查看签到码、提交点位任务。 |
| reviewer | 查看报名资料、查看系统校验结果、审核通过或驳回。 |
| checkin_staff | 查看正式报名名单、完成签到、标记出发。 |
| field_staff | 查看现场执行进度、审核点位任务、标记异常关注、标记完赛。 |
| event_admin | 管理单场赛事配置、报名、审核、签到、现场执行、通知和复盘。 |
| org_admin | 管理组织下多个赛事、工作人员和赛事模板。 |
| super_admin | 平台级管理角色，用于系统运维和跨组织支持。 |

## Auth 用户与 profiles 表

Supabase Auth 负责登录身份，`profiles.id` 关联 `auth.users.id`。

建议 `profiles` 保存：

- `id`：等于 Auth user id。
- `organization_id`：用户所属组织。
- `role`：当前 MVP 采用单角色字段，后续可扩展为 organization_members 多角色模型。
- `display_name`：展示名称。
- `phone`：联系手机号。
- `metadata`：扩展信息。

## profiles 与 organizations

`organizations` 表代表学校、赛事公司、社团、企业等组织。赛事 `events.organization_id` 归属一个组织。

组织边界用于限制管理端数据访问：

- `event_admin` 只能管理自己组织或授权赛事。
- `org_admin` 可以管理本组织下全部赛事。
- `participant` 不应看到其他人的报名资料。

## 多赛事 / 多组织边界

第一版可以先使用 `profiles.organization_id + profiles.role` 简化授权。真实商业化后建议增加：

- `organization_members`：记录一个用户在不同组织的角色。
- `event_staff_assignments`：记录工作人员被分配到哪些赛事。
- `team_memberships`：记录参赛者所属队伍和队内身份。

这样可以支持同一个用户既是某赛事参赛者，又是另一个赛事工作人员。

## 敏感数据说明

EasyEvent 涉及以下敏感数据：

- 手机号。
- 成员身份类型。
- 学生证、校友证明、亲子证明等材料。
- 点位任务证据文件。
- 审核驳回原因。
- 异常关注原因。

这些数据不应暴露给无关用户。材料文件需要配合 Supabase Storage policy，数据库中只保存文件路径、状态和审核结果。

## 为什么必须使用 RLS

前端应用无法隐藏 publishable key，因此真实数据库访问必须依赖 Supabase Row Level Security。RLS 能让每条记录根据当前 Auth 用户、组织、角色和报名关系决定是否可读写。

原则：

- 普通参赛者只访问自己的报名、通知和点位任务。
- 管理角色只访问授权赛事或组织的数据。
- audit logs 原则上只追加，不允许普通用户删除。
- 文件访问通过 Storage policy 单独控制。

## 第一版真实登录建议

可选路线：

- 参赛者端：手机号 OTP 更贴近赛事场景。
- 管理端：邮箱 magic link 或邮箱密码登录更容易管理工作人员。
- 课堂项目后续迭代：可以先做邮箱 magic link，避免密码体系和短信成本。

## 当前阶段边界

第十四阶段只设计 Auth / profile / role 边界，不实现登录 UI，不创建真实 Supabase 项目，不迁移业务数据。当前 App 默认仍使用 localStorage adapter，Supabase adapter 只是基础骨架。
