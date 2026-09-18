-- Pilot observer and durable privacy-safe audit gate.
-- Observer authorization is deliberately separate from workplace membership.
-- No production observer, retention date, or workplace is created here.

create extension if not exists pgcrypto with schema extensions;

create table public.workplace_observers (
  workplace_id uuid not null references public.workplaces(id) on delete restrict,
  observer_profile_id uuid not null references public.profiles(id) on delete cascade,
  observer_code text not null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  primary key (workplace_id, observer_profile_id),
  unique (workplace_id, observer_code),
  constraint workplace_observers_code_format
    check (observer_code ~ '^O-[A-F0-9]{12}$'),
  constraint workplace_observers_lifecycle
    check (revoked_at is null or revoked_at >= granted_at)
);

create table public.workplace_participant_codes (
  workplace_id uuid not null references public.workplaces(id) on delete restrict,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  participant_code text not null,
  created_at timestamptz not null default now(),
  primary key (workplace_id, profile_id),
  unique (workplace_id, participant_code),
  constraint workplace_participant_codes_format
    check (participant_code ~ '^P-[A-F0-9]{12}$')
);

-- This mapping intentionally has no shift foreign key. Its random code and the
-- audit ledger survive deletion of the operational shift row.
create table public.workplace_shift_codes (
  workplace_id uuid not null references public.workplaces(id) on delete restrict,
  shift_id uuid not null,
  shift_code text not null,
  created_at timestamptz not null default now(),
  primary key (workplace_id, shift_id),
  unique (workplace_id, shift_code),
  constraint workplace_shift_codes_format
    check (shift_code ~ '^S-[A-F0-9]{12}$')
);

create table public.workplace_pilot_settings (
  workplace_id uuid primary key references public.workplaces(id) on delete restrict,
  pilot_ends_at timestamptz,
  retention_days integer not null default 90
    check (retention_days between 90 and 365),
  configured_at timestamptz,
  configured_by uuid references public.profiles(id) on delete set null
);

create table public.pilot_audit_events (
  id uuid primary key default gen_random_uuid(),
  workplace_id uuid not null references public.workplaces(id) on delete restrict,
  event_type text not null check (event_type in (
    'invitation_created', 'invitation_replaced', 'invitation_revoked',
    'invitation_accepted',
    'participant_joined', 'participant_left', 'participant_removed',
    'shift_created', 'shift_updated', 'shift_released', 'shift_reassigned',
    'shift_cancelled', 'shift_deleted',
    'interest_expressed', 'interest_withdrawn', 'candidate_selected',
    'coverage_approved', 'coverage_cancelled',
    'direct_offer_sent', 'direct_offer_accepted', 'direct_offer_declined',
    'direct_offer_approved', 'direct_offer_cancelled',
    'observer_granted', 'observer_revoked', 'retention_configured'
  )),
  outcome text not null default 'success'
    check (outcome in ('success', 'blocked', 'info')),
  actor_category text not null
    check (actor_category in ('service', 'system', 'manager', 'participant', 'observer')),
  actor_code text,
  subject_code text,
  object_code text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  retention_eligible_at timestamptz,
  constraint pilot_audit_actor_code_safe
    check (actor_code is null or actor_code ~ '^[PO]-[A-F0-9]{12}$'),
  constraint pilot_audit_subject_code_safe
    check (subject_code is null or subject_code ~ '^[PO]-[A-F0-9]{12}$'),
  constraint pilot_audit_object_code_safe
    check (object_code is null or object_code ~ '^S-[A-F0-9]{12}$'),
  constraint pilot_audit_metadata_object check (jsonb_typeof(metadata) = 'object')
);

create index pilot_audit_events_workplace_time_idx
  on public.pilot_audit_events(workplace_id, occurred_at desc);
create index pilot_audit_events_workplace_type_idx
  on public.pilot_audit_events(workplace_id, event_type, occurred_at desc);

create table public.pilot_audit_aggregates (
  id uuid primary key default gen_random_uuid(),
  workplace_id uuid not null references public.workplaces(id) on delete restrict,
  event_type text not null,
  outcome text not null,
  event_count bigint not null check (event_count >= 0),
  period_started_at timestamptz not null,
  period_ended_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint pilot_audit_aggregate_period
    check (period_ended_at >= period_started_at)
);

alter table public.workplace_observers enable row level security;
alter table public.workplace_participant_codes enable row level security;
alter table public.workplace_shift_codes enable row level security;
alter table public.workplace_pilot_settings enable row level security;
alter table public.pilot_audit_events enable row level security;
alter table public.pilot_audit_aggregates enable row level security;

revoke all on table public.workplace_observers from public, anon, authenticated, service_role;
revoke all on table public.workplace_participant_codes from public, anon, authenticated, service_role;
revoke all on table public.workplace_shift_codes from public, anon, authenticated, service_role;
revoke all on table public.workplace_pilot_settings from public, anon, authenticated, service_role;
revoke all on table public.pilot_audit_events from public, anon, authenticated, service_role;
revoke all on table public.pilot_audit_aggregates from public, anon, authenticated, service_role;

create or replace function public.is_active_pilot_observer(
  target_workplace_id uuid,
  target_profile_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.workplace_observers as observer_access
    where observer_access.workplace_id = target_workplace_id
      and observer_access.observer_profile_id = target_profile_id
      and observer_access.revoked_at is null
  );
$$;

revoke all on function public.is_active_pilot_observer(uuid, uuid)
  from public, anon, authenticated, service_role;

create or replace function public.is_current_user_active_pilot_observer(
  target_workplace_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.is_active_pilot_observer(target_workplace_id, auth.uid());
$$;

revoke all on function public.is_current_user_active_pilot_observer(uuid)
  from public, anon, authenticated;
grant execute on function public.is_current_user_active_pilot_observer(uuid)
  to authenticated;

create policy "Active pilot observers can read privacy-safe audit events"
on public.pilot_audit_events for select to authenticated
using (public.is_current_user_active_pilot_observer(workplace_id));

create policy "Active workplace managers can read privacy-safe audit events"
on public.pilot_audit_events for select to authenticated
using (public.is_manager_for_workplace(workplace_id));

grant select on table public.pilot_audit_events to authenticated;

create or replace function public.new_private_workplace_code(code_prefix text)
returns text
language sql
volatile
security definer
set search_path = public, extensions, pg_temp
as $$
  select upper(code_prefix || '-' || encode(extensions.gen_random_bytes(6), 'hex'));
$$;

revoke all on function public.new_private_workplace_code(text)
  from public, anon, authenticated, service_role;

create or replace function public.ensure_participant_code(
  target_workplace_id uuid,
  target_profile_id uuid
)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  selected_code text;
begin
  select participant_code into selected_code
  from public.workplace_participant_codes
  where workplace_id = target_workplace_id and profile_id = target_profile_id;

  while selected_code is null loop
    begin
      selected_code := public.new_private_workplace_code('P');
      insert into public.workplace_participant_codes (
        workplace_id, profile_id, participant_code
      ) values (target_workplace_id, target_profile_id, selected_code);
    exception when unique_violation then
      select participant_code into selected_code
      from public.workplace_participant_codes
      where workplace_id = target_workplace_id and profile_id = target_profile_id;
    end;
  end loop;
  return selected_code;
end;
$$;

create or replace function public.ensure_shift_code(
  target_workplace_id uuid,
  target_shift_id uuid
)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  selected_code text;
begin
  select shift_code into selected_code
  from public.workplace_shift_codes
  where workplace_id = target_workplace_id and shift_id = target_shift_id;

  while selected_code is null loop
    begin
      selected_code := public.new_private_workplace_code('S');
      insert into public.workplace_shift_codes (
        workplace_id, shift_id, shift_code
      ) values (target_workplace_id, target_shift_id, selected_code);
    exception when unique_violation then
      select shift_code into selected_code
      from public.workplace_shift_codes
      where workplace_id = target_workplace_id and shift_id = target_shift_id;
    end;
  end loop;
  return selected_code;
end;
$$;

revoke all on function public.ensure_participant_code(uuid, uuid)
  from public, anon, authenticated, service_role;
revoke all on function public.ensure_shift_code(uuid, uuid)
  from public, anon, authenticated, service_role;

create or replace function public.safe_pilot_audit_metadata(input jsonb)
returns jsonb
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  item record;
  result jsonb := '{}'::jsonb;
  safe_keys constant text[] := array[
    'source', 'status', 'previous_status', 'stage', 'previous_stage',
    'assignment', 'previous_assignment', 'invitation_kind'
  ];
begin
  if input is null or jsonb_typeof(input) <> 'object' then
    return result;
  end if;
  for item in select key, value from jsonb_each(input) loop
    if item.key = any(safe_keys)
      and jsonb_typeof(item.value) = 'string'
      and trim(both '"' from item.value::text) ~ '^[A-Za-z0-9_-]{1,40}$' then
      result := result || jsonb_build_object(item.key, item.value);
    end if;
  end loop;
  return result;
end;
$$;

revoke all on function public.safe_pilot_audit_metadata(jsonb)
  from public, anon, authenticated, service_role;

create or replace function public.pilot_audit_actor_category(target_workplace_id uuid)
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select case
    when auth.role() = 'service_role' or auth.uid() is null then 'service'
    when public.is_active_pilot_observer(target_workplace_id, auth.uid()) then 'observer'
    when exists (
      select 1 from public.workplace_members
      where workplace_id = target_workplace_id
        and profile_id = auth.uid()
        and membership_status = 'active'
        and lower(role) = 'manager'
    ) then 'manager'
    when exists (
      select 1 from public.workplace_members
      where workplace_id = target_workplace_id
        and profile_id = auth.uid()
        and membership_status = 'active'
    ) then 'participant'
    else 'system'
  end;
$$;

revoke all on function public.pilot_audit_actor_category(uuid)
  from public, anon, authenticated, service_role;

create or replace function public.append_pilot_audit_event(
  target_workplace_id uuid,
  target_event_type text,
  target_outcome text default 'success',
  target_subject_code text default null,
  target_object_code text default null,
  target_metadata jsonb default '{}'::jsonb,
  target_actor_code text default null,
  target_actor_category text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  new_id uuid;
  selected_actor_code text := target_actor_code;
  eligible_at timestamptz;
begin
  if selected_actor_code is null and auth.uid() is not null then
    select participant_code into selected_actor_code
    from public.workplace_participant_codes
    where workplace_id = target_workplace_id and profile_id = auth.uid();
  end if;

  select pilot_ends_at + make_interval(days => retention_days)
  into eligible_at
  from public.workplace_pilot_settings
  where workplace_id = target_workplace_id and pilot_ends_at is not null;

  insert into public.pilot_audit_events (
    workplace_id, event_type, outcome, actor_category, actor_code,
    subject_code, object_code, metadata, retention_eligible_at
  ) values (
    target_workplace_id, target_event_type, target_outcome,
    coalesce(
      target_actor_category,
      public.pilot_audit_actor_category(target_workplace_id)
    ), selected_actor_code,
    target_subject_code, target_object_code,
    public.safe_pilot_audit_metadata(target_metadata), eligible_at
  ) returning id into new_id;
  return new_id;
end;
$$;

revoke all on function public.append_pilot_audit_event(uuid, text, text, text, text, jsonb, text, text)
  from public, anon, authenticated, service_role;

create or replace function public.guard_pilot_audit_immutability()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if current_setting('industry.audit_retention_operation', true)
      is distinct from 'allowed'
    or auth.role() is distinct from 'service_role' then
    raise exception 'Pilot audit records are append-only' using errcode = '42501';
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger guard_pilot_audit_event_changes
before update or delete on public.pilot_audit_events
for each row execute function public.guard_pilot_audit_immutability();

create trigger guard_pilot_audit_aggregate_changes
before update or delete on public.pilot_audit_aggregates
for each row execute function public.guard_pilot_audit_immutability();

revoke all on function public.guard_pilot_audit_immutability()
  from public, anon, authenticated, service_role;

-- Existing and future active memberships receive opaque, workplace-scoped
-- participant labels. The mapping table is never readable by observers.
do $$
declare membership record;
begin
  for membership in
    select workplace_id, profile_id from public.workplace_members
  loop
    perform public.ensure_participant_code(membership.workplace_id, membership.profile_id);
  end loop;
end;
$$;

do $$
declare shift_row record;
begin
  for shift_row in select workplace_id, id from public.shifts loop
    perform public.ensure_shift_code(shift_row.workplace_id, shift_row.id);
  end loop;
end;
$$;

create or replace function public.audit_membership_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare subject_label text;
begin
  subject_label := public.ensure_participant_code(new.workplace_id, new.profile_id);
  if tg_op = 'INSERT' and new.membership_status = 'active' then
    perform public.append_pilot_audit_event(
      new.workplace_id, 'participant_joined', 'success', subject_label
    );
  elsif tg_op = 'UPDATE'
    and old.membership_status = 'inactive' and new.membership_status = 'active' then
    perform public.append_pilot_audit_event(
      new.workplace_id, 'participant_joined', 'success', subject_label,
      null, jsonb_build_object('source', 'reactivated')
    );
  elsif tg_op = 'UPDATE'
    and old.membership_status = 'active' and new.membership_status = 'inactive' then
    perform public.append_pilot_audit_event(
      new.workplace_id,
      case when new.deactivation_reason = 'manager_removed'
        then 'participant_removed' else 'participant_left' end,
      'success', subject_label, null, '{}'::jsonb, null,
      case when new.deactivation_reason = 'voluntary' then 'participant' else null end
    );
  end if;
  return new;
end;
$$;

create trigger audit_workplace_membership_lifecycle
after insert or update of membership_status on public.workplace_members
for each row execute function public.audit_membership_lifecycle();

create or replace function public.audit_invitation_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  accepted_label text;
  invitation_source text := 'new';
begin
  if tg_op = 'INSERT' then
    if exists (
      select 1 from public.pilot_invitations as older
      where older.workplace_id = new.workplace_id
        and older.email = new.email
        and older.id <> new.id
        and older.revoked_at is not null
    ) then invitation_source := 'replacement'; end if;
    perform public.append_pilot_audit_event(
      new.workplace_id,
      case when invitation_source = 'replacement'
        then 'invitation_replaced' else 'invitation_created' end,
      'success', null, null,
      jsonb_build_object(
        'source', invitation_source,
        'invitation_kind', case when lower(new.role) = 'manager' then 'manager' else 'worker' end
      )
    );
  elsif old.revoked_at is null and new.revoked_at is not null then
    perform public.append_pilot_audit_event(
      new.workplace_id, 'invitation_revoked', 'success'
    );
  elsif old.accepted_at is null and new.accepted_at is not null then
    accepted_label := public.ensure_participant_code(
      new.workplace_id, new.accepted_profile_id
    );
    perform public.append_pilot_audit_event(
      new.workplace_id, 'invitation_accepted', 'success', accepted_label
    );
  end if;
  return new;
end;
$$;

create trigger audit_pilot_invitation_lifecycle
after insert or update of accepted_at, revoked_at on public.pilot_invitations
for each row execute function public.audit_invitation_lifecycle();

create or replace function public.audit_shift_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  shift_label text;
  subject_label text;
  previous_label text;
  selected_event text;
  selected_workplace_id uuid;
  selected_shift_id uuid;
  selected_profile_id uuid;
  selected_status text;
  prior_status text;
begin
  if tg_op = 'DELETE' then
    selected_workplace_id := old.workplace_id;
    selected_shift_id := old.id;
    selected_profile_id := old.assigned_profile_id;
    selected_status := old.status;
    prior_status := old.status;
  else
    selected_workplace_id := new.workplace_id;
    selected_shift_id := new.id;
    selected_profile_id := new.assigned_profile_id;
    selected_status := new.status;
    prior_status := case when tg_op = 'UPDATE' then old.status else new.status end;
  end if;

  shift_label := public.ensure_shift_code(selected_workplace_id, selected_shift_id);
  if selected_profile_id is not null then
    subject_label := public.ensure_participant_code(
      selected_workplace_id, selected_profile_id
    );
  end if;

  if tg_op = 'INSERT' then
    selected_event := 'shift_created';
  elsif tg_op = 'DELETE' then
    selected_event := 'shift_deleted';
  elsif old.status <> new.status and new.status = 'coverage_needed' then
    selected_event := 'shift_released';
  elsif old.status <> new.status and new.status = 'cancelled' then
    selected_event := 'shift_cancelled';
  elsif old.assigned_profile_id is distinct from new.assigned_profile_id then
    selected_event := 'shift_reassigned';
    if old.assigned_profile_id is not null then
      previous_label := public.ensure_participant_code(
        old.workplace_id, old.assigned_profile_id
      );
    end if;
  else
    selected_event := 'shift_updated';
  end if;

  perform public.append_pilot_audit_event(
    selected_workplace_id, selected_event, 'success',
    subject_label, shift_label,
    jsonb_build_object(
      'status', selected_status,
      'previous_status', prior_status,
      'assignment', case when subject_label is null then 'unassigned' else 'assigned' end,
      'previous_assignment', case when previous_label is null then 'unassigned' else 'assigned' end
    )
  );
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger audit_shift_lifecycle_changes
after insert or update or delete on public.shifts
for each row execute function public.audit_shift_lifecycle();

create or replace function public.audit_interest_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  selected_workplace uuid;
  participant_label text;
  shift_label text;
  selected_event text;
  selected_shift_id uuid;
  selected_profile_id uuid;
begin
  if tg_op = 'DELETE' then
    selected_shift_id := old.shift_id;
    selected_profile_id := old.profile_id;
  else
    selected_shift_id := new.shift_id;
    selected_profile_id := new.profile_id;
  end if;
  select workplace_id into selected_workplace from public.shifts
  where id = selected_shift_id;
  if selected_workplace is null then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;
  participant_label := public.ensure_participant_code(
    selected_workplace, selected_profile_id
  );
  shift_label := public.ensure_shift_code(
    selected_workplace, selected_shift_id
  );
  if tg_op = 'INSERT' then
    if new.status <> 'interested' then return new; end if;
    selected_event := 'interest_expressed';
  elsif tg_op = 'DELETE' then
    selected_event := 'interest_withdrawn';
  elsif old.status <> new.status and new.status = 'withdrawn' then
    selected_event := 'interest_withdrawn';
  elsif old.status <> new.status and new.status = 'selected' then
    selected_event := 'candidate_selected';
  else
    return new;
  end if;
  perform public.append_pilot_audit_event(
    selected_workplace, selected_event, 'success', participant_label, shift_label
  );
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger audit_shift_interest_lifecycle
after insert or update or delete on public.shift_interests
for each row execute function public.audit_interest_lifecycle();

create or replace function public.audit_direct_offer_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  subject_label text;
  shift_label text;
  selected_event text;
begin
  subject_label := public.ensure_participant_code(
    coalesce(new.workplace_id, old.workplace_id),
    coalesce(new.recipient_profile_id, old.recipient_profile_id)
  );
  shift_label := public.ensure_shift_code(
    coalesce(new.workplace_id, old.workplace_id), coalesce(new.shift_id, old.shift_id)
  );
  if tg_op = 'INSERT' then selected_event := 'direct_offer_sent';
  elsif old.status is not distinct from new.status then return new;
  else selected_event := case new.status
    when 'accepted' then 'direct_offer_accepted'
    when 'declined' then 'direct_offer_declined'
    when 'approved' then 'direct_offer_approved'
    when 'canceled' then 'direct_offer_cancelled'
    else null end;
  end if;
  if selected_event is not null then
    perform public.append_pilot_audit_event(
      coalesce(new.workplace_id, old.workplace_id), selected_event, 'success',
      subject_label, shift_label,
      jsonb_build_object('status', coalesce(new.status, old.status))
    );
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger audit_direct_shift_offer_lifecycle
after insert or update on public.direct_shift_offers
for each row execute function public.audit_direct_offer_lifecycle();

create or replace function public.audit_coverage_event_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  selected_event text;
  subject_label text;
begin
  selected_event := case new.event_type
    when 'coverage_confirmed' then 'coverage_approved'
    when 'coverage_canceled' then 'coverage_cancelled'
    when 'manager_reassigned' then 'shift_reassigned'
    else null end;
  if selected_event is null then return new; end if;
  if new.new_profile_id is not null then
    subject_label := public.ensure_participant_code(
      new.workplace_id, new.new_profile_id
    );
  end if;
  perform public.append_pilot_audit_event(
    new.workplace_id, selected_event, 'success', subject_label,
    public.ensure_shift_code(new.workplace_id, new.shift_id)
  );
  return new;
end;
$$;

create trigger audit_coverage_event_lifecycle
after insert on public.coverage_events
for each row execute function public.audit_coverage_event_lifecycle();

revoke all on function public.audit_membership_lifecycle()
  from public, anon, authenticated, service_role;
revoke all on function public.audit_invitation_lifecycle()
  from public, anon, authenticated, service_role;
revoke all on function public.audit_shift_lifecycle()
  from public, anon, authenticated, service_role;
revoke all on function public.audit_interest_lifecycle()
  from public, anon, authenticated, service_role;
revoke all on function public.audit_direct_offer_lifecycle()
  from public, anon, authenticated, service_role;
revoke all on function public.audit_coverage_event_lifecycle()
  from public, anon, authenticated, service_role;

create or replace function public.audit_observer_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' or (old.revoked_at is not null and new.revoked_at is null) then
    perform public.append_pilot_audit_event(
      new.workplace_id, 'observer_granted', 'success', new.observer_code
    );
  elsif old.revoked_at is null and new.revoked_at is not null then
    perform public.append_pilot_audit_event(
      new.workplace_id, 'observer_revoked', 'success', new.observer_code
    );
  end if;
  return new;
end;
$$;

create trigger audit_workplace_observer_lifecycle
after insert or update of revoked_at on public.workplace_observers
for each row execute function public.audit_observer_lifecycle();

revoke all on function public.audit_observer_lifecycle()
  from public, anon, authenticated, service_role;

create or replace function public.grant_pilot_observer(
  target_workplace_id uuid,
  target_profile_id uuid
)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare selected_code text;
begin
  if not exists (select 1 from public.workplaces where id = target_workplace_id) then
    raise exception 'Workplace not found' using errcode = 'P0002';
  end if;
  if not exists (select 1 from public.profiles where id = target_profile_id) then
    raise exception 'Observer profile not found' using errcode = 'P0002';
  end if;
  if exists (
    select 1 from public.workplace_members
    where workplace_id = target_workplace_id
      and profile_id = target_profile_id
      and membership_status = 'active'
  ) then
    raise exception 'Observer authorization must be separate from membership'
      using errcode = '23514';
  end if;

  select observer_code into selected_code from public.workplace_observers
  where workplace_id = target_workplace_id
    and observer_profile_id = target_profile_id;
  if selected_code is null then
    loop
      begin
        selected_code := public.new_private_workplace_code('O');
        insert into public.workplace_observers (
          workplace_id, observer_profile_id, observer_code
        ) values (target_workplace_id, target_profile_id, selected_code);
        exit;
      exception when unique_violation then
        select observer_code into selected_code
        from public.workplace_observers
        where workplace_id = target_workplace_id
          and observer_profile_id = target_profile_id;
        if selected_code is not null then
          update public.workplace_observers
          set revoked_at = null, granted_at = now()
          where workplace_id = target_workplace_id
            and observer_profile_id = target_profile_id;
          exit;
        end if;
      end;
    end loop;
  else
    update public.workplace_observers set revoked_at = null, granted_at = now()
    where workplace_id = target_workplace_id
      and observer_profile_id = target_profile_id;
  end if;
  return selected_code;
end;
$$;

create or replace function public.revoke_pilot_observer(
  target_workplace_id uuid,
  target_profile_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare changed_rows integer;
begin
  update public.workplace_observers set revoked_at = now()
  where workplace_id = target_workplace_id
    and observer_profile_id = target_profile_id
    and revoked_at is null;
  get diagnostics changed_rows = row_count;
  return changed_rows = 1;
end;
$$;

revoke all on function public.grant_pilot_observer(uuid, uuid)
  from public, anon, authenticated, service_role;
revoke all on function public.revoke_pilot_observer(uuid, uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.grant_pilot_observer(uuid, uuid) to service_role;
grant execute on function public.revoke_pilot_observer(uuid, uuid) to service_role;

create or replace function public.list_my_observer_workplaces()
returns table (
  workplace_id uuid,
  workplace_name text,
  observer_code text,
  pilot_ends_at timestamptz,
  retention_days integer
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select access.workplace_id, workplace.name, access.observer_code,
    settings.pilot_ends_at, coalesce(settings.retention_days, 90)
  from public.workplace_observers as access
  join public.workplaces as workplace on workplace.id = access.workplace_id
  left join public.workplace_pilot_settings as settings
    on settings.workplace_id = access.workplace_id
  where access.observer_profile_id = auth.uid()
    and access.revoked_at is null
  order by workplace.name;
$$;

create or replace function public.get_pilot_monitor_summary(target_workplace_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare result jsonb;
begin
  if not public.is_active_pilot_observer(target_workplace_id) then
    raise exception 'Observer authorization required' using errcode = '42501';
  end if;
  select jsonb_build_object(
    'invitations', jsonb_build_object(
      'pending', count(*) filter (where accepted_at is null and revoked_at is null and expires_at > now()),
      'accepted', count(*) filter (where accepted_at is not null),
      'revoked', count(*) filter (where revoked_at is not null),
      'expired', count(*) filter (where accepted_at is null and revoked_at is null and expires_at <= now())
    )
  ) into result
  from public.pilot_invitations where workplace_id = target_workplace_id;

  result := result || jsonb_build_object(
    'participants', (select jsonb_build_object(
      'active', count(*) filter (where membership_status = 'active'),
      'inactive', count(*) filter (where membership_status = 'inactive')
    ) from public.workplace_members where workplace_id = target_workplace_id),
    'shifts', (select jsonb_build_object(
      'scheduled', count(*) filter (where status = 'scheduled'),
      'open', count(*) filter (where status = 'open'),
      'coverage_needed', count(*) filter (where status = 'coverage_needed'),
      'completed', count(*) filter (where status = 'completed'),
      'cancelled', count(*) filter (where status = 'cancelled')
    ) from public.shifts where workplace_id = target_workplace_id),
    'coverage', jsonb_build_object(
      'interested', (select count(*) from public.shift_interests as interest
        join public.shifts as shift_row on shift_row.id = interest.shift_id
        where shift_row.workplace_id = target_workplace_id and interest.status = 'interested'),
      'selected', (select count(*) from public.shift_interests as interest
        join public.shifts as shift_row on shift_row.id = interest.shift_id
        where shift_row.workplace_id = target_workplace_id and interest.status = 'selected'),
      'confirmed', (select count(*) from public.shift_interests as interest
        join public.shifts as shift_row on shift_row.id = interest.shift_id
        where shift_row.workplace_id = target_workplace_id and interest.status = 'confirmed'),
      'direct_offers_open', (select count(*) from public.direct_shift_offers
        where workplace_id = target_workplace_id and status in ('pending', 'accepted'))
    ),
    'audit', jsonb_build_object(
      'recent_events', (select count(*) from public.pilot_audit_events
        where workplace_id = target_workplace_id and occurred_at >= now() - interval '7 days')
    )
  );
  return result;
end;
$$;

create or replace function public.list_pilot_monitor_events(
  target_workplace_id uuid,
  event_type_filter text default null,
  outcome_filter text default null,
  since_filter timestamptz default null,
  result_limit integer default 100
)
returns table (
  event_id uuid,
  event_type text,
  outcome text,
  actor_category text,
  actor_code text,
  subject_code text,
  object_code text,
  metadata jsonb,
  occurred_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_active_pilot_observer(target_workplace_id) then
    raise exception 'Observer authorization required' using errcode = '42501';
  end if;
  return query
  select event.id, event.event_type, event.outcome, event.actor_category,
    event.actor_code, event.subject_code, event.object_code,
    event.metadata, event.occurred_at
  from public.pilot_audit_events as event
  where event.workplace_id = target_workplace_id
    and (event_type_filter is null or event.event_type = event_type_filter)
    and (outcome_filter is null or event.outcome = outcome_filter)
    and (since_filter is null or event.occurred_at >= since_filter)
  order by event.occurred_at desc, event.id desc
  limit least(greatest(coalesce(result_limit, 100), 1), 250);
end;
$$;

revoke all on function public.list_my_observer_workplaces()
  from public, anon, authenticated;
revoke all on function public.get_pilot_monitor_summary(uuid)
  from public, anon, authenticated;
revoke all on function public.list_pilot_monitor_events(uuid, text, text, timestamptz, integer)
  from public, anon, authenticated;
grant execute on function public.list_my_observer_workplaces() to authenticated;
grant execute on function public.get_pilot_monitor_summary(uuid) to authenticated;
grant execute on function public.list_pilot_monitor_events(uuid, text, text, timestamptz, integer)
  to authenticated;

create or replace function public.configure_pilot_audit_retention(
  target_workplace_id uuid,
  target_pilot_ends_at timestamptz,
  target_retention_days integer default 90
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if target_pilot_ends_at is null or target_retention_days < 90
    or target_retention_days > 365 then
    raise exception 'Valid pilot end and retention period required' using errcode = '22023';
  end if;
  insert into public.workplace_pilot_settings (
    workplace_id, pilot_ends_at, retention_days, configured_at, configured_by
  ) values (
    target_workplace_id, target_pilot_ends_at, target_retention_days, now(), auth.uid()
  ) on conflict (workplace_id) do update set
    pilot_ends_at = excluded.pilot_ends_at,
    retention_days = excluded.retention_days,
    configured_at = excluded.configured_at,
    configured_by = excluded.configured_by;

  perform set_config('industry.audit_retention_operation', 'allowed', true);
  update public.pilot_audit_events
  set retention_eligible_at = target_pilot_ends_at
    + make_interval(days => target_retention_days)
  where workplace_id = target_workplace_id;
  perform set_config('industry.audit_retention_operation', 'off', true);

  perform public.append_pilot_audit_event(
    target_workplace_id, 'retention_configured', 'info', null, null,
    jsonb_build_object('source', 'service')
  );
end;
$$;

create or replace function public.cleanup_eligible_pilot_audit(
  target_workplace_id uuid
)
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  setting public.workplace_pilot_settings%rowtype;
  removed_count bigint;
begin
  select * into setting from public.workplace_pilot_settings
  where workplace_id = target_workplace_id for update;
  if not found or setting.pilot_ends_at is null
    or now() < setting.pilot_ends_at + make_interval(days => setting.retention_days) then
    raise exception 'Pilot audit retention period has not elapsed'
      using errcode = '55000';
  end if;

  insert into public.pilot_audit_aggregates (
    workplace_id, event_type, outcome, event_count,
    period_started_at, period_ended_at
  )
  select workplace_id, event_type, outcome, count(*), min(occurred_at), max(occurred_at)
  from public.pilot_audit_events
  where workplace_id = target_workplace_id
    and retention_eligible_at is not null
    and retention_eligible_at <= now()
  group by workplace_id, event_type, outcome;

  perform set_config('industry.audit_retention_operation', 'allowed', true);
  delete from public.pilot_audit_events
  where workplace_id = target_workplace_id
    and retention_eligible_at is not null
    and retention_eligible_at <= now();
  get diagnostics removed_count = row_count;
  delete from public.workplace_participant_codes
  where workplace_id = target_workplace_id;
  delete from public.workplace_shift_codes
  where workplace_id = target_workplace_id;
  perform set_config('industry.audit_retention_operation', 'off', true);
  return removed_count;
end;
$$;

revoke all on function public.configure_pilot_audit_retention(uuid, timestamptz, integer)
  from public, anon, authenticated, service_role;
revoke all on function public.cleanup_eligible_pilot_audit(uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.configure_pilot_audit_retention(uuid, timestamptz, integer)
  to service_role;
grant execute on function public.cleanup_eligible_pilot_audit(uuid)
  to service_role;

alter publication supabase_realtime add table public.pilot_audit_events;

comment on table public.workplace_observers is
  'Service-managed, workplace-scoped read-only pilot observer authorization. Not a workplace membership.';
comment on table public.pilot_audit_events is
  'Append-only privacy-safe lifecycle events. Contains opaque codes and allowlisted metadata, never participant identity fields.';
comment on function public.cleanup_eligible_pilot_audit(uuid) is
  'Service-only retention cleanup. It refuses to run before pilot end plus the configured retention period and preserves aggregate counts.';
