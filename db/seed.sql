-- EasyEvent / 易赛通 Supabase 最小 seed
-- 先执行 db/schema.sql，再执行本文件。
-- profiles 依赖 auth.users，本文件不伪造用户，只创建组织、赛事和项目。

insert into public.organizations (id, name)
values
  ('11111111-1111-4111-8111-111111111111', 'EasyEvent 运营组织')
on conflict (id) do update set name = excluded.name;

insert into public.events (
  id,
  organization_id,
  name,
  short_name,
  date,
  location,
  organizer,
  registration_mode,
  checkin_mode,
  status,
  config
)
values
  (
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    '珠海城市鲁宾逊趣味定向赛',
    '珠海定向赛',
    '2026-07-18',
    '珠海市香洲区',
    'EasyEvent 赛事运营组',
    'team',
    'team',
    'published',
    '{
      "memberFields": [
        {"key":"age","label":"年龄","type":"number","required":true,"appliesTo":"member"},
        {"key":"roleType","label":"成员类型","type":"select","required":true,"appliesTo":"member","options":["学生","校友","亲子","社会人士"]}
      ],
      "materialRules": [],
      "checkpoints": [
        {"id":"cccccccc-cccc-4ccc-8ccc-ccccccccccc1","name":"城市起点","description":"队伍集合与出发确认点。","order":1,"taskType":"manual","required":true},
        {"id":"cccccccc-cccc-4ccc-8ccc-ccccccccccc2","name":"文化地标","description":"完成现场观察任务。","order":2,"taskType":"text","required":true},
        {"id":"cccccccc-cccc-4ccc-8ccc-ccccccccccc3","name":"终点服务区","description":"完赛确认。","order":3,"taskType":"photo","required":true}
      ],
      "announcementTypes": [
        {"id":"ops","name":"运营通知","description":"赛事运营与检录提醒。","severity":"info"},
        {"id":"safety","name":"安全提醒","description":"天气、路线和安全相关提醒。","severity":"warning"}
      ]
    }'::jsonb
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '11111111-1111-4111-8111-111111111111',
    '校园 5km 跑步赛',
    '校园跑',
    '2026-08-20',
    '校园田径场',
    'EasyEvent 赛事运营组',
    'individual',
    'individual',
    'published',
    '{
      "memberFields": [
        {"key":"healthCommitment","label":"健康承诺","type":"checkbox","required":true,"appliesTo":"member"}
      ],
      "materialRules": [],
      "checkpoints": [
        {"id":"dddddddd-dddd-4ddd-8ddd-ddddddddddd1","name":"检录门","description":"赛前检录点。","order":1,"taskType":"manual","required":true},
        {"id":"dddddddd-dddd-4ddd-8ddd-ddddddddddd2","name":"完赛区","description":"完赛确认点。","order":2,"taskType":"manual","required":true}
      ],
      "announcementTypes": [
        {"id":"race","name":"赛事通知","description":"跑步赛通知。","severity":"info"}
      ]
    }'::jsonb
  )
on conflict (id) do update set
  name = excluded.name,
  short_name = excluded.short_name,
  date = excluded.date,
  location = excluded.location,
  organizer = excluded.organizer,
  registration_mode = excluded.registration_mode,
  checkin_mode = excluded.checkin_mode,
  status = excluded.status,
  config = excluded.config;

insert into public.event_checkpoints (
  id,
  event_id,
  name,
  description,
  display_order,
  task_type,
  required
)
values
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1', '22222222-2222-4222-8222-222222222222', '城市起点', '队伍集合与出发确认点。', 1, 'manual', true),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc2', '22222222-2222-4222-8222-222222222222', '文化地标', '完成现场观察任务。', 2, 'text', true),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc3', '22222222-2222-4222-8222-222222222222', '终点服务区', '完赛确认。', 3, 'photo', true),
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd1', '33333333-3333-4333-8333-333333333333', '检录门', '赛前检录点。', 1, 'manual', true),
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd2', '33333333-3333-4333-8333-333333333333', '完赛区', '完赛确认点。', 2, 'manual', true)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  display_order = excluded.display_order,
  task_type = excluded.task_type,
  required = excluded.required;

insert into public.announcements (
  id,
  event_id,
  type_id,
  title,
  content,
  severity,
  target_scope,
  target_filters,
  status,
  published_at
)
values
  (
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1',
    '22222222-2222-4222-8222-222222222222',
    'ops',
    '检录时间提醒',
    '请各队伍按报名状态页提示，在出发前完成现场检录。',
    'info',
    'all',
    '{}'::jsonb,
    'published',
    now()
  ),
  (
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee2',
    '22222222-2222-4222-8222-222222222222',
    'safety',
    '天气与补水提醒',
    '今日户外活动请注意补水，队长需关注队员状态。',
    'warning',
    'statuses',
    '{"targetRegistrationStatuses":["registered"]}'::jsonb,
    'published',
    now()
  )
on conflict (id) do update set
  title = excluded.title,
  content = excluded.content,
  severity = excluded.severity,
  target_scope = excluded.target_scope,
  target_filters = excluded.target_filters,
  status = excluded.status,
  published_at = excluded.published_at;

insert into public.event_projects (
  id,
  event_id,
  name,
  description,
  min_members,
  max_members,
  target_audience,
  config
)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '22222222-2222-4222-8222-222222222222',
    '城市探索路线',
    '适合首次参加城市定向的队伍。',
    2,
    4,
    '学生、校友、亲子、社会人士',
    '{}'::jsonb
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    '22222222-2222-4222-8222-222222222222',
    '亲子协作路线',
    '适合亲子家庭参与的轻量路线。',
    2,
    5,
    '亲子家庭',
    '{}'::jsonb
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    '22222222-2222-4222-8222-222222222222',
    '挑战进阶路线',
    '适合有户外经验的队伍。',
    3,
    6,
    '学生、校友、社会人士',
    '{}'::jsonb
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    '33333333-3333-4333-8333-333333333333',
    '5km 健康跑',
    '适合普通跑者的校园路线。',
    1,
    1,
    '全体参赛者',
    '{}'::jsonb
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    '33333333-3333-4333-8333-333333333333',
    '10km 挑战跑',
    '适合有训练基础的跑者。',
    1,
    1,
    '进阶跑者',
    '{}'::jsonb
  )
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  min_members = excluded.min_members,
  max_members = excluded.max_members,
  target_audience = excluded.target_audience,
  config = excluded.config;
