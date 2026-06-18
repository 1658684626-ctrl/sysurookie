-- EasyEvent / 易赛通 Supabase 最小后端闭环 schema
-- 执行位置：Supabase SQL Editor
-- 范围：organizations / profiles / events / event_projects / event_checkpoints / registrations / registration_members / audit_logs / checkpoint_progress / announcements / announcement_confirmations / ai_conversations / ai_messages

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  display_name text,
  email text,
  phone text,
  role text not null default 'participant',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (
    role in ('participant', 'reviewer', 'checkin_staff', 'field_staff', 'event_admin', 'org_admin')
  )
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  name text not null,
  short_name text,
  date text,
  location text,
  organizer text,
  registration_mode text not null,
  checkin_mode text not null,
  status text not null default 'draft',
  config jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_registration_mode_check check (registration_mode in ('team', 'individual')),
  constraint events_checkin_mode_check check (checkin_mode in ('team', 'individual')),
  constraint events_status_check check (status in ('draft', 'published', 'archived'))
);

create table if not exists public.event_projects (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  description text,
  min_members int,
  max_members int,
  target_audience text,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_checkpoints (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  description text,
  display_order int not null default 0,
  task_type text not null default 'manual',
  required boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_checkpoints_task_type_check check (task_type in ('scan', 'photo', 'text', 'manual'))
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  project_id uuid references public.event_projects(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  mode text not null,
  team_name text,
  captain_name text,
  captain_phone text,
  status text not null,
  checkin_status text not null,
  execution_status text not null,
  form_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint registrations_mode_check check (mode in ('team', 'individual')),
  constraint registrations_status_check check (
    status in ('draft', 'incomplete', 'pending_review', 'rejected', 'approved', 'registered')
  ),
  constraint registrations_checkin_status_check check (
    checkin_status in ('not_checked_in', 'checked_in', 'departed')
  ),
  constraint registrations_execution_status_check check (
    execution_status in ('not_started', 'in_progress', 'attention_needed', 'finished')
  )
);

create table if not exists public.registration_members (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  name text not null,
  phone text,
  role_type text,
  form_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  action text not null,
  operator text,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.checkpoint_progress (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  checkpoint_id uuid not null references public.event_checkpoints(id) on delete cascade,
  status text not null default 'not_arrived',
  submitted_at timestamptz,
  note text,
  evidence_file_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint checkpoint_progress_status_check check (status in ('not_arrived', 'arrived', 'submitted', 'approved')),
  constraint checkpoint_progress_unique unique (registration_id, checkpoint_id)
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  type_id text not null,
  title text not null,
  content text not null,
  severity text not null default 'info',
  target_scope text not null default 'all',
  target_filters jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint announcements_severity_check check (severity in ('info', 'warning', 'urgent')),
  constraint announcements_target_scope_check check (target_scope in ('all', 'projects', 'statuses')),
  constraint announcements_status_check check (status in ('draft', 'published', 'partially_confirmed', 'confirmed'))
);

create table if not exists public.announcement_confirmations (
  id uuid primary key default gen_random_uuid(),
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  registration_id uuid not null references public.registrations(id) on delete cascade,
  confirmed_at timestamptz not null default now(),
  confirmed_by text,
  note text,
  constraint announcement_confirmations_unique unique (announcement_id, registration_id)
);

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  registration_id uuid references public.registrations(id) on delete set null,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role text not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint ai_messages_role_check check (role in ('user', 'assistant', 'system'))
);

create index if not exists profiles_organization_id_idx on public.profiles(organization_id);
create index if not exists events_organization_id_idx on public.events(organization_id);
create index if not exists events_status_idx on public.events(status);
create index if not exists event_projects_event_id_idx on public.event_projects(event_id);
create index if not exists event_checkpoints_event_id_idx on public.event_checkpoints(event_id);
create index if not exists registrations_event_id_idx on public.registrations(event_id);
create index if not exists registrations_project_id_idx on public.registrations(project_id);
create index if not exists registrations_created_by_idx on public.registrations(created_by);
create index if not exists registrations_status_idx on public.registrations(status);
create index if not exists registrations_checkin_status_idx on public.registrations(checkin_status);
create index if not exists registrations_execution_status_idx on public.registrations(execution_status);
create index if not exists registration_members_registration_id_idx on public.registration_members(registration_id);
create index if not exists audit_logs_registration_id_idx on public.audit_logs(registration_id);
create index if not exists checkpoint_progress_registration_id_idx on public.checkpoint_progress(registration_id);
create index if not exists checkpoint_progress_checkpoint_id_idx on public.checkpoint_progress(checkpoint_id);
create index if not exists announcements_event_id_idx on public.announcements(event_id);
create index if not exists announcements_status_idx on public.announcements(status);
create index if not exists announcement_confirmations_announcement_id_idx on public.announcement_confirmations(announcement_id);
create index if not exists announcement_confirmations_registration_id_idx on public.announcement_confirmations(registration_id);
create index if not exists ai_conversations_user_id_idx on public.ai_conversations(user_id);
create index if not exists ai_conversations_event_id_idx on public.ai_conversations(event_id);
create index if not exists ai_messages_conversation_id_idx on public.ai_messages(conversation_id);

drop trigger if exists set_organizations_updated_at on public.organizations;
create trigger set_organizations_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists set_event_projects_updated_at on public.event_projects;
create trigger set_event_projects_updated_at
before update on public.event_projects
for each row execute function public.set_updated_at();

drop trigger if exists set_event_checkpoints_updated_at on public.event_checkpoints;
create trigger set_event_checkpoints_updated_at
before update on public.event_checkpoints
for each row execute function public.set_updated_at();

drop trigger if exists set_registrations_updated_at on public.registrations;
create trigger set_registrations_updated_at
before update on public.registrations
for each row execute function public.set_updated_at();

drop trigger if exists set_registration_members_updated_at on public.registration_members;
create trigger set_registration_members_updated_at
before update on public.registration_members
for each row execute function public.set_updated_at();

drop trigger if exists set_checkpoint_progress_updated_at on public.checkpoint_progress;
create trigger set_checkpoint_progress_updated_at
before update on public.checkpoint_progress
for each row execute function public.set_updated_at();

drop trigger if exists set_announcements_updated_at on public.announcements;
create trigger set_announcements_updated_at
before update on public.announcements
for each row execute function public.set_updated_at();

drop trigger if exists set_ai_conversations_updated_at on public.ai_conversations;
create trigger set_ai_conversations_updated_at
before update on public.ai_conversations
for each row execute function public.set_updated_at();

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_projects enable row level security;
alter table public.event_checkpoints enable row level security;
alter table public.registrations enable row level security;
alter table public.registration_members enable row level security;
alter table public.audit_logs enable row level security;
alter table public.checkpoint_progress enable row level security;
alter table public.announcements enable row level security;
alter table public.announcement_confirmations enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
