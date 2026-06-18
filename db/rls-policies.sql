-- EasyEvent / 易赛通 Supabase 最小 RLS 策略
-- 执行前请先执行 db/schema.sql。

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.current_profile_organization_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id from public.profiles where id = auth.uid()
$$;

create or replace function public.has_role(allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() = any(allowed_roles), false)
$$;

create or replace function public.can_manage_event(target_event_id uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.events e
    join public.profiles p on p.id = auth.uid()
    where e.id = target_event_id
      and p.organization_id is not distinct from e.organization_id
      and p.role = any(allowed_roles)
  )
$$;

-- organizations
drop policy if exists "read own organization" on public.organizations;
create policy "read own organization"
on public.organizations for select
using (id = public.current_profile_organization_id());

drop policy if exists "org admin update own organization" on public.organizations;
create policy "org admin update own organization"
on public.organizations for update
using (id = public.current_profile_organization_id() and public.has_role(array['org_admin']))
with check (id = public.current_profile_organization_id() and public.has_role(array['org_admin']));

-- profiles
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile"
on public.profiles for select
using (id = auth.uid());

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "insert own profile" on public.profiles;
create policy "insert own profile"
on public.profiles for insert
with check (id = auth.uid());

drop policy if exists "org admin read org profiles" on public.profiles;
create policy "org admin read org profiles"
on public.profiles for select
using (
  organization_id = public.current_profile_organization_id()
  and public.has_role(array['org_admin'])
);

-- events
drop policy if exists "members read org events" on public.events;
create policy "members read org events"
on public.events for select
using (
  organization_id = public.current_profile_organization_id()
  or status = 'published'
);

drop policy if exists "event admins insert events" on public.events;
create policy "event admins insert events"
on public.events for insert
with check (
  public.has_role(array['event_admin', 'org_admin'])
  and (
    organization_id is null
    or organization_id = public.current_profile_organization_id()
  )
);

drop policy if exists "event admins update events" on public.events;
create policy "event admins update events"
on public.events for update
using (
  organization_id = public.current_profile_organization_id()
  and public.has_role(array['event_admin', 'org_admin'])
)
with check (
  organization_id = public.current_profile_organization_id()
  and public.has_role(array['event_admin', 'org_admin'])
);

-- event_projects
drop policy if exists "members read org event projects" on public.event_projects;
create policy "members read org event projects"
on public.event_projects for select
using (
  exists (
    select 1
    from public.events e
    where e.id = event_id
      and (
        e.organization_id = public.current_profile_organization_id()
        or e.status = 'published'
      )
  )
);

drop policy if exists "event admins manage projects" on public.event_projects;
create policy "event admins manage projects"
on public.event_projects for all
using (public.can_manage_event(event_id, array['event_admin', 'org_admin']))
with check (public.can_manage_event(event_id, array['event_admin', 'org_admin']));

-- event_checkpoints
drop policy if exists "members read published event checkpoints" on public.event_checkpoints;
create policy "members read published event checkpoints"
on public.event_checkpoints for select
using (
  exists (
    select 1
    from public.events e
    where e.id = event_id
      and (
        e.organization_id = public.current_profile_organization_id()
        or e.status = 'published'
      )
  )
);

drop policy if exists "event admins manage checkpoints" on public.event_checkpoints;
create policy "event admins manage checkpoints"
on public.event_checkpoints for all
using (public.can_manage_event(event_id, array['event_admin', 'org_admin']))
with check (public.can_manage_event(event_id, array['event_admin', 'org_admin']));

-- registrations
drop policy if exists "participants read own registrations" on public.registrations;
create policy "participants read own registrations"
on public.registrations for select
using (created_by = auth.uid());

drop policy if exists "participants create registrations" on public.registrations;
create policy "participants create registrations"
on public.registrations for insert
with check (created_by = auth.uid());

drop policy if exists "participants update draft registrations" on public.registrations;
create policy "participants update draft registrations"
on public.registrations for update
using (created_by = auth.uid() and status in ('draft', 'incomplete'))
with check (created_by = auth.uid() and status in ('draft', 'incomplete', 'pending_review'));

drop policy if exists "reviewers read event registrations" on public.registrations;
create policy "reviewers read event registrations"
on public.registrations for select
using (
  public.can_manage_event(event_id, array['reviewer', 'checkin_staff', 'field_staff', 'event_admin', 'org_admin'])
);

drop policy if exists "reviewers update registration status" on public.registrations;
create policy "reviewers update registration status"
on public.registrations for update
using (
  public.can_manage_event(event_id, array['reviewer', 'event_admin', 'org_admin'])
)
with check (
  public.can_manage_event(event_id, array['reviewer', 'event_admin', 'org_admin'])
);

drop policy if exists "operations staff update registration operations" on public.registrations;
create policy "operations staff update registration operations"
on public.registrations for update
using (
  public.can_manage_event(event_id, array['checkin_staff', 'field_staff', 'event_admin', 'org_admin'])
)
with check (
  public.can_manage_event(event_id, array['checkin_staff', 'field_staff', 'event_admin', 'org_admin'])
);

-- registration_members
drop policy if exists "registration owner read members" on public.registration_members;
create policy "registration owner read members"
on public.registration_members for select
using (
  exists (
    select 1 from public.registrations r
    where r.id = registration_id and r.created_by = auth.uid()
  )
);

drop policy if exists "registration owner manage members" on public.registration_members;
create policy "registration owner manage members"
on public.registration_members for all
using (
  exists (
    select 1 from public.registrations r
    where r.id = registration_id and r.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.registrations r
    where r.id = registration_id and r.created_by = auth.uid()
  )
);

drop policy if exists "managers read registration members" on public.registration_members;
create policy "managers read registration members"
on public.registration_members for select
using (
  exists (
    select 1 from public.registrations r
    where r.id = registration_id
      and public.can_manage_event(r.event_id, array['reviewer', 'checkin_staff', 'field_staff', 'event_admin', 'org_admin'])
  )
);

-- audit_logs
drop policy if exists "registration owner read audit logs" on public.audit_logs;
create policy "registration owner read audit logs"
on public.audit_logs for select
using (
  exists (
    select 1 from public.registrations r
    where r.id = registration_id and r.created_by = auth.uid()
  )
);

drop policy if exists "managers read audit logs" on public.audit_logs;
create policy "managers read audit logs"
on public.audit_logs for select
using (
  exists (
    select 1 from public.registrations r
    where r.id = registration_id
      and public.can_manage_event(r.event_id, array['reviewer', 'checkin_staff', 'field_staff', 'event_admin', 'org_admin'])
  )
);

drop policy if exists "managers insert audit logs" on public.audit_logs;
create policy "managers insert audit logs"
on public.audit_logs for insert
with check (
  exists (
    select 1 from public.registrations r
    where r.id = registration_id
      and public.can_manage_event(r.event_id, array['reviewer', 'checkin_staff', 'field_staff', 'event_admin', 'org_admin'])
  )
);

drop policy if exists "registration owner insert audit logs" on public.audit_logs;
create policy "registration owner insert audit logs"
on public.audit_logs for insert
with check (
  exists (
    select 1 from public.registrations r
    where r.id = registration_id and r.created_by = auth.uid()
  )
);

-- 不开放 audit_logs delete。日志保留用于追踪审核和运营动作。

-- checkpoint_progress
drop policy if exists "registration owner read checkpoint progress" on public.checkpoint_progress;
create policy "registration owner read checkpoint progress"
on public.checkpoint_progress for select
using (
  exists (
    select 1 from public.registrations r
    where r.id = registration_id and r.created_by = auth.uid()
  )
);

drop policy if exists "registration owner submit checkpoint progress" on public.checkpoint_progress;
create policy "registration owner submit checkpoint progress"
on public.checkpoint_progress for insert
with check (
  status in ('not_arrived', 'arrived', 'submitted')
  and
  exists (
    select 1 from public.registrations r
    where r.id = registration_id and r.created_by = auth.uid()
  )
);

drop policy if exists "registration owner update own checkpoint progress" on public.checkpoint_progress;
create policy "registration owner update own checkpoint progress"
on public.checkpoint_progress for update
using (
  exists (
    select 1 from public.registrations r
    where r.id = registration_id
      and r.created_by = auth.uid()
      and r.execution_status in ('in_progress', 'attention_needed')
  )
)
with check (
  status in ('not_arrived', 'arrived', 'submitted')
  and
  exists (
    select 1 from public.registrations r
    where r.id = registration_id
      and r.created_by = auth.uid()
  )
);

drop policy if exists "field staff manage checkpoint progress" on public.checkpoint_progress;
create policy "field staff manage checkpoint progress"
on public.checkpoint_progress for all
using (
  exists (
    select 1 from public.registrations r
    where r.id = registration_id
      and public.can_manage_event(r.event_id, array['field_staff', 'event_admin', 'org_admin'])
  )
)
with check (
  exists (
    select 1 from public.registrations r
    where r.id = registration_id
      and public.can_manage_event(r.event_id, array['field_staff', 'event_admin', 'org_admin'])
  )
);

-- announcements
drop policy if exists "participants read published relevant announcements" on public.announcements;
create policy "participants read published relevant announcements"
on public.announcements for select
using (
  status <> 'draft'
  and exists (
    select 1 from public.registrations r
    where r.event_id = announcements.event_id
      and r.created_by = auth.uid()
      and (
        target_scope = 'all'
        or (
          target_scope = 'projects'
          and coalesce(target_filters -> 'targetProjectIds', '[]'::jsonb) ? r.project_id::text
        )
        or (
          target_scope = 'statuses'
          and coalesce(target_filters -> 'targetRegistrationStatuses', '[]'::jsonb) ? r.status
        )
      )
  )
);

drop policy if exists "event admins manage announcements" on public.announcements;
create policy "event admins manage announcements"
on public.announcements for all
using (public.can_manage_event(event_id, array['event_admin', 'org_admin']))
with check (public.can_manage_event(event_id, array['event_admin', 'org_admin']));

-- announcement_confirmations
drop policy if exists "registration owner read own announcement confirmations" on public.announcement_confirmations;
create policy "registration owner read own announcement confirmations"
on public.announcement_confirmations for select
using (
  exists (
    select 1 from public.registrations r
    where r.id = registration_id and r.created_by = auth.uid()
  )
);

drop policy if exists "registration owner confirm announcements" on public.announcement_confirmations;
create policy "registration owner confirm announcements"
on public.announcement_confirmations for insert
with check (
  exists (
    select 1 from public.registrations r
    join public.announcements a on a.id = announcement_id
    where r.id = registration_id
      and r.created_by = auth.uid()
      and r.event_id = a.event_id
      and a.status <> 'draft'
      and (
        a.target_scope = 'all'
        or (
          a.target_scope = 'projects'
          and coalesce(a.target_filters -> 'targetProjectIds', '[]'::jsonb) ? r.project_id::text
        )
        or (
          a.target_scope = 'statuses'
          and coalesce(a.target_filters -> 'targetRegistrationStatuses', '[]'::jsonb) ? r.status
        )
      )
  )
);

drop policy if exists "event admins read announcement confirmations" on public.announcement_confirmations;
create policy "event admins read announcement confirmations"
on public.announcement_confirmations for select
using (
  exists (
    select 1 from public.announcements a
    where a.id = announcement_id
      and public.can_manage_event(a.event_id, array['event_admin', 'org_admin'])
  )
);

-- ai_conversations
drop policy if exists "users read own ai conversations" on public.ai_conversations;
create policy "users read own ai conversations"
on public.ai_conversations for select
using (user_id = auth.uid());

drop policy if exists "users create own ai conversations" on public.ai_conversations;
create policy "users create own ai conversations"
on public.ai_conversations for insert
with check (user_id = auth.uid());

drop policy if exists "users update own ai conversations" on public.ai_conversations;
create policy "users update own ai conversations"
on public.ai_conversations for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- ai_messages
drop policy if exists "users read own ai messages" on public.ai_messages;
create policy "users read own ai messages"
on public.ai_messages for select
using (
  exists (
    select 1 from public.ai_conversations c
    where c.id = conversation_id and c.user_id = auth.uid()
  )
);

drop policy if exists "users create own ai messages" on public.ai_messages;
create policy "users create own ai messages"
on public.ai_messages for insert
with check (
  exists (
    select 1 from public.ai_conversations c
    where c.id = conversation_id and c.user_id = auth.uid()
  )
);

-- 不开放 ai_messages delete。对话记录默认保留，后续可补充用户清理策略。
