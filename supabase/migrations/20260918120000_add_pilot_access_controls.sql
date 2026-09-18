-- Pilot access gate: invitation-bound Auth signup, voluntary consent, and
-- reversible workplace membership deactivation. This migration intentionally
-- preserves operational history and does not delete Auth users or memberships.

alter table public.pilot_invitations
  add column volunteer_confirmed_at timestamptz;

alter table public.workplace_members
  add column membership_status text not null default 'active',
  add column deactivated_at timestamptz,
  add column deactivated_by uuid references public.profiles(id) on delete set null,
  add column deactivation_reason text,
  add column pilot_consented_at timestamptz,
  add column pilot_consent_version text;

alter table public.workplace_members
  add constraint workplace_members_status_check
    check (membership_status in ('active', 'inactive')),
  add constraint workplace_members_deactivation_complete
    check (
      (membership_status = 'active'
        and deactivated_at is null
        and deactivated_by is null
        and deactivation_reason is null)
      or
      (membership_status = 'inactive'
        and deactivated_at is not null
        and deactivation_reason in ('voluntary', 'manager_removed'))
    ),
  add constraint workplace_members_consent_complete
    check (
      (pilot_consented_at is null and pilot_consent_version is null)
      or
      (pilot_consented_at is not null and char_length(trim(pilot_consent_version)) > 0)
    );

-- Membership authorization state is changed only by the narrowly scoped
-- SECURITY DEFINER operations below. RLS alone can turn an unauthorized UPDATE
-- into a silent zero-row update, so table privileges are also removed to make
-- every browser-originated mutation fail closed before policy evaluation.
revoke insert, update, delete on table public.workplace_members
  from anon, authenticated;
grant select on table public.workplace_members to authenticated;

-- Invitations contain authorization decisions and token hashes. Reassert the
-- existing deny-by-default table boundary here so a later role/default-grant
-- change cannot provide a browser client with a direct mutation path.
revoke all on table public.pilot_invitations from anon, authenticated;

create unique index workplace_members_one_active_workplace_per_profile_idx
  on public.workplace_members(profile_id)
  where membership_status = 'active';

create index workplace_members_active_workplace_idx
  on public.workplace_members(workplace_id, profile_id)
  where membership_status = 'active';

-- The older invitation function revoked a previous link before creating a new
-- one, but concurrent requests could still leave more than one unresolved
-- invitation. Retain only the newest such link before enforcing the invariant.
with ranked_invitations as (
  select id, row_number() over (
    partition by workplace_id, email
    order by created_at desc, id desc
  ) as invitation_rank
  from public.pilot_invitations
  where accepted_at is null and revoked_at is null
)
update public.pilot_invitations as invitation
set revoked_at = now()
from ranked_invitations
where invitation.id = ranked_invitations.id
  and ranked_invitations.invitation_rank > 1;

create unique index pilot_invitations_one_unresolved_email_per_workplace_idx
  on public.pilot_invitations(workplace_id, email)
  where accepted_at is null and revoked_at is null;

comment on column public.pilot_invitations.volunteer_confirmed_at is
  'Timestamp recording the manager or service organizer confirmation that participation was voluntary.';

comment on column public.workplace_members.membership_status is
  'Soft membership lifecycle. Inactive members retain historical references but have no workplace authorization.';

comment on column public.workplace_members.pilot_consented_at is
  'Timestamp recording the participant acknowledgment of the optional pilot and short privacy notice.';

-- Central membership helpers are SECURITY DEFINER so RLS policies can evaluate
-- membership without recursive workplace_members policy checks.
create or replace function public.is_active_workplace_member(
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
    select 1
    from public.workplace_members as membership
    where membership.workplace_id = target_workplace_id
      and membership.profile_id = target_profile_id
      and membership.membership_status = 'active'
  );
$$;

revoke all on function public.is_active_workplace_member(uuid, uuid) from public;
grant execute on function public.is_active_workplace_member(uuid, uuid) to authenticated;

create or replace function public.is_manager_for_workplace(target_workplace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.workplace_members as membership
    where membership.workplace_id = target_workplace_id
      and membership.profile_id = auth.uid()
      and membership.membership_status = 'active'
      and lower(membership.role) = 'manager'
  );
$$;

create or replace function public.is_manager_for_shift(target_shift_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.shifts as shift_row
    join public.workplace_members as membership
      on membership.workplace_id = shift_row.workplace_id
    where shift_row.id = target_shift_id
      and membership.profile_id = auth.uid()
      and membership.membership_status = 'active'
      and lower(membership.role) = 'manager'
  );
$$;

create or replace function public.is_same_workplace(other_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.workplace_members as me
    join public.workplace_members as coworker
      on coworker.workplace_id = me.workplace_id
    where me.profile_id = auth.uid()
      and me.membership_status = 'active'
      and coworker.profile_id = other_profile_id
      and coworker.membership_status = 'active'
  );
$$;

-- Rebuild every workplace-data policy so an inactive membership grants no
-- direct or Realtime read/write authorization.
drop policy if exists "Users can view own workplace memberships" on public.workplace_members;
drop policy if exists "Managers can view workplace members" on public.workplace_members;

create policy "Users can view own active workplace membership"
on public.workplace_members for select to authenticated
using (profile_id = auth.uid() and membership_status = 'active');

create policy "Managers can view active workplace members"
on public.workplace_members for select to authenticated
using (
  membership_status = 'active'
  and public.is_manager_for_workplace(workplace_id)
);

drop policy if exists "Users can view their workplaces" on public.workplaces;
create policy "Active members can view their workplaces"
on public.workplaces for select to authenticated
using (public.is_active_workplace_member(id));

drop policy if exists "Users can view relevant shifts" on public.shifts;
drop policy if exists "workplace members can view coverage shifts" on public.shifts;
drop policy if exists "Managers can view workplace shifts" on public.shifts;
drop policy if exists "Managers can create workplace shifts" on public.shifts;
drop policy if exists "Managers can update workplace shifts" on public.shifts;

create policy "Active members can view relevant shifts"
on public.shifts for select to authenticated
using (
  public.is_active_workplace_member(workplace_id)
  and (assigned_profile_id = auth.uid() or status in ('open', 'coverage_needed'))
);

create policy "Active managers can view workplace shifts"
on public.shifts for select to authenticated
using (public.is_manager_for_workplace(workplace_id));

create policy "Active managers can create workplace shifts"
on public.shifts for insert to authenticated
with check (
  public.is_manager_for_workplace(workplace_id)
  and (
    assigned_profile_id is null
    or public.is_active_workplace_member(workplace_id, assigned_profile_id)
  )
);

create policy "Active managers can update workplace shifts"
on public.shifts for update to authenticated
using (public.is_manager_for_workplace(workplace_id))
with check (
  public.is_manager_for_workplace(workplace_id)
  and (
    assigned_profile_id is null
    or public.is_active_workplace_member(workplace_id, assigned_profile_id)
  )
);

drop policy if exists "workplace members can view coworker profiles" on public.profiles;
create policy "Active workplace members can view coworker profiles"
on public.profiles for select to authenticated
using (id = auth.uid() or public.is_same_workplace(id));

drop policy if exists "managers can view workplace shift interests" on public.shift_interests;
drop policy if exists "participants can view shift interests" on public.shift_interests;
drop policy if exists "shift owners can view shift interests" on public.shift_interests;
drop policy if exists "workers can create initial shift interest" on public.shift_interests;

create policy "Active managers can view workplace shift interests"
on public.shift_interests for select to authenticated
using (public.is_manager_for_shift(shift_id));

create policy "Active participants can view shift interests"
on public.shift_interests for select to authenticated
using (
  exists (
    select 1 from public.shifts as shift_row
    where shift_row.id = shift_interests.shift_id
      and public.is_active_workplace_member(shift_row.workplace_id)
      and (
        shift_interests.profile_id = auth.uid()
        or shift_row.assigned_profile_id = auth.uid()
      )
  )
);

create policy "workers can create initial shift interest"
on public.shift_interests for insert to authenticated
with check (
  profile_id = auth.uid()
  and status = 'interested'
  and exists (
    select 1 from public.shifts as shift_row
    where shift_row.id = shift_interests.shift_id
      and public.is_active_workplace_member(shift_row.workplace_id)
      and (
        (shift_row.status = 'coverage_needed'
          and shift_row.assigned_profile_id is distinct from auth.uid())
        or
        (shift_row.status = 'open' and shift_row.assigned_profile_id is null)
      )
  )
);

drop policy if exists "participants and managers can view coverage events" on public.coverage_events;
create policy "Active participants and managers can view coverage events"
on public.coverage_events for select to authenticated
using (
  public.is_active_workplace_member(workplace_id)
  and (
    previous_profile_id = auth.uid()
    or new_profile_id = auth.uid()
    or public.is_manager_for_workplace(workplace_id)
  )
);

-- All approved schedule mutation RPCs ultimately write one of these tables.
-- These triggers add a final active-membership boundary even for SECURITY
-- DEFINER functions that bypass RLS.
create or replace function public.enforce_active_shift_write()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  actor_id uuid := auth.uid();
  target_row public.shifts%rowtype;
begin
  if actor_id is null then
    return case when tg_op = 'DELETE' then old else new end;
  end if;
  target_row := case when tg_op = 'DELETE' then old else new end;
  if not public.is_active_workplace_member(target_row.workplace_id, actor_id) then
    raise exception 'Active workplace membership required' using errcode = '42501';
  end if;
  if target_row.assigned_profile_id is not null
    and not public.is_active_workplace_member(target_row.workplace_id, target_row.assigned_profile_id) then
    raise exception 'Assigned participant is not an active workplace member' using errcode = '23514';
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create or replace function public.enforce_active_interest_write()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  actor_id uuid := auth.uid();
  target_row public.shift_interests%rowtype;
  target_workplace_id uuid;
begin
  if actor_id is null then
    return case when tg_op = 'DELETE' then old else new end;
  end if;
  target_row := case when tg_op = 'DELETE' then old else new end;
  select workplace_id into target_workplace_id
  from public.shifts where id = target_row.shift_id;
  if not public.is_active_workplace_member(target_workplace_id, actor_id) then
    raise exception 'Active workplace membership required' using errcode = '42501';
  end if;
  if not public.is_active_workplace_member(target_workplace_id, target_row.profile_id) then
    raise exception 'Interested participant is not an active workplace member' using errcode = '23514';
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create or replace function public.enforce_active_offer_write()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  actor_id uuid := auth.uid();
  target_row public.direct_shift_offers%rowtype;
begin
  if actor_id is null then
    return case when tg_op = 'DELETE' then old else new end;
  end if;
  target_row := case when tg_op = 'DELETE' then old else new end;
  if not public.is_active_workplace_member(target_row.workplace_id, actor_id) then
    raise exception 'Active workplace membership required' using errcode = '42501';
  end if;
  if not public.is_active_workplace_member(target_row.workplace_id, target_row.sender_profile_id)
    or not public.is_active_workplace_member(target_row.workplace_id, target_row.recipient_profile_id) then
    raise exception 'Direct-offer participants must be active workplace members' using errcode = '23514';
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create or replace function public.enforce_active_coverage_event_write()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if auth.uid() is not null
    and not public.is_active_workplace_member(new.workplace_id, auth.uid()) then
    raise exception 'Active workplace membership required' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger require_active_membership_for_shift_writes
before insert or update or delete on public.shifts
for each row execute function public.enforce_active_shift_write();
create trigger require_active_membership_for_interest_writes
before insert or update or delete on public.shift_interests
for each row execute function public.enforce_active_interest_write();
create trigger require_active_membership_for_offer_writes
before insert or update or delete on public.direct_shift_offers
for each row execute function public.enforce_active_offer_write();
create trigger require_active_membership_for_coverage_event_writes
before insert or update on public.coverage_events
for each row execute function public.enforce_active_coverage_event_write();

revoke all on function public.enforce_active_shift_write()
  from public, anon, authenticated;
revoke all on function public.enforce_active_interest_write()
  from public, anon, authenticated;
revoke all on function public.enforce_active_offer_write()
  from public, anon, authenticated;
revoke all on function public.enforce_active_coverage_event_write()
  from public, anon, authenticated;

-- The Auth hook allows a new Auth identity only for a normalized email with an
-- active invitation and both required consent confirmations. It never assigns
-- a workplace or role; acceptance does that later from the locked invitation.
create or replace function public.enforce_pilot_invitation_before_user_created(input jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  normalized_email text := lower(trim(coalesce(input -> 'user' ->> 'email', '')));
  consent_acknowledged boolean := coalesce(
    (input -> 'user' -> 'user_metadata' ->> 'pilot_consent_acknowledged')::boolean,
    false
  );
  consent_version text := coalesce(input -> 'user' -> 'user_metadata' ->> 'pilot_consent_version', '');
begin
  if normalized_email = ''
    or not consent_acknowledged
    or consent_version <> 'pilot-privacy-v1'
    or not exists (
      select 1 from public.pilot_invitations as invitation
      where invitation.email = normalized_email
        and invitation.volunteer_confirmed_at is not null
        and invitation.accepted_at is null
        and invitation.revoked_at is null
        and invitation.expires_at > now()
    ) then
    return jsonb_build_object('error', jsonb_build_object(
      'http_code', 403,
      'message', 'A valid private pilot invitation and consent are required.'
    ));
  end if;
  return '{}'::jsonb;
exception when others then
  return jsonb_build_object('error', jsonb_build_object(
    'http_code', 403,
    'message', 'A valid private pilot invitation and consent are required.'
  ));
end;
$$;

revoke all on function public.enforce_pilot_invitation_before_user_created(jsonb)
  from public, anon, authenticated, service_role;
grant usage on schema public to supabase_auth_admin;
grant execute on function public.enforce_pilot_invitation_before_user_created(jsonb) to supabase_auth_admin;

create or replace function public.get_pilot_invitation(invite_token text)
returns table (
  invitation_id uuid, workplace_name text, invited_email text,
  invited_role text, expires_at timestamptz
)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare normalized_token text := trim(coalesce(invite_token, ''));
begin
  if char_length(normalized_token) < 32 then return; end if;
  return query
  select invitation.id, workplace.name, invitation.email,
    invitation.role, invitation.expires_at
  from public.pilot_invitations as invitation
  join public.workplaces as workplace on workplace.id = invitation.workplace_id
  where invitation.token_hash = encode(
      extensions.digest(convert_to(normalized_token, 'UTF8'), 'sha256'), 'hex'
    )
    and invitation.volunteer_confirmed_at is not null
    and invitation.accepted_at is null
    and invitation.revoked_at is null
    and invitation.expires_at > now()
  limit 1;
end;
$$;

drop function public.accept_pilot_invitation(text);
create function public.accept_pilot_invitation(
  invite_token text,
  consent_acknowledged boolean,
  consent_version text
)
returns table (workplace_id uuid, workplace_name text, member_role text)
language plpgsql
security definer
set search_path = public, auth, extensions, pg_temp
as $$
declare
  current_profile_id uuid := auth.uid();
  current_email text := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  normalized_token text := trim(coalesce(invite_token, ''));
  invitation public.pilot_invitations%rowtype;
begin
  if current_profile_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if consent_acknowledged is distinct from true or consent_version <> 'pilot-privacy-v1' then
    raise exception 'Pilot consent acknowledgment required' using errcode = '22023';
  end if;
  select * into invitation from public.pilot_invitations
  where token_hash = encode(
    extensions.digest(convert_to(normalized_token, 'UTF8'), 'sha256'), 'hex'
  ) for update;
  if invitation.id is null
    or invitation.volunteer_confirmed_at is null
    or invitation.accepted_at is not null
    or invitation.revoked_at is not null
    or invitation.expires_at <= now() then
    raise exception 'Invitation is not available' using errcode = '22023';
  end if;
  if current_email = '' or current_email <> invitation.email then
    raise exception 'Invitation email does not match' using errcode = '42501';
  end if;
  if lower(invitation.role) = 'manager' and invitation.invited_by is not null then
    raise exception 'Manager invitations require service authorization' using errcode = '42501';
  end if;
  if exists (
    select 1 from public.workplace_members as membership
    where membership.profile_id = current_profile_id
      and membership.membership_status = 'active'
  ) then
    raise exception 'Account already has an active workplace membership' using errcode = '23505';
  end if;

  insert into public.workplace_members (
    workplace_id, profile_id, role, membership_status, joined_at,
    pilot_consented_at, pilot_consent_version
  ) values (
    invitation.workplace_id, current_profile_id, invitation.role, 'active', now(),
    now(), consent_version
  )
  on conflict on constraint workplace_members_pkey do update set
    role = excluded.role,
    membership_status = 'active',
    joined_at = excluded.joined_at,
    deactivated_at = null,
    deactivated_by = null,
    deactivation_reason = null,
    pilot_consented_at = excluded.pilot_consented_at,
    pilot_consent_version = excluded.pilot_consent_version;

  update public.pilot_invitations
  set accepted_at = now(), accepted_profile_id = current_profile_id
  where id = invitation.id;

  return query select workplace.id, workplace.name, invitation.role
  from public.workplaces as workplace where workplace.id = invitation.workplace_id;
end;
$$;

revoke all on function public.accept_pilot_invitation(text, boolean, text)
  from public, anon, authenticated;
grant execute on function public.accept_pilot_invitation(text, boolean, text) to authenticated;

drop function public.create_workplace_invitation(text, text);
create function public.create_workplace_invitation(
  target_email text,
  target_role text,
  volunteer_confirmed boolean
)
returns table (
  invitation_id uuid, invited_email text, invited_role text,
  expires_at timestamptz, invite_token text
)
language plpgsql
security definer
set search_path = public, auth, extensions, pg_temp
as $$
declare
  current_profile_id uuid := auth.uid();
  manager_workplace_id uuid;
  normalized_email text := lower(trim(coalesce(target_email, '')));
  normalized_role text := initcap(lower(trim(coalesce(target_role, ''))));
  raw_token text := encode(extensions.gen_random_bytes(32), 'hex');
  new_invitation public.pilot_invitations%rowtype;
begin
  select membership.workplace_id into manager_workplace_id
  from public.workplace_members as membership
  where membership.profile_id = current_profile_id
    and membership.membership_status = 'active'
    and lower(membership.role) = 'manager'
  limit 1;
  if manager_workplace_id is null then
    raise exception 'Manager permission required' using errcode = '42501';
  end if;
  if volunteer_confirmed is distinct from true then
    raise exception 'Volunteer confirmation required' using errcode = '22023';
  end if;
  if normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Invalid email address' using errcode = '22023';
  end if;
  if normalized_role not in (
    'Server', 'Bartender', 'Host', 'Busser', 'Cook',
    'Dishwasher', 'Barback', 'Other'
  ) then
    raise exception 'Approved worker role required' using errcode = '22023';
  end if;
  if exists (
    select 1 from auth.users as existing_user
    join public.workplace_members as existing_membership
      on existing_membership.profile_id = existing_user.id
    where lower(trim(existing_user.email)) = normalized_email
      and existing_membership.workplace_id = manager_workplace_id
      and existing_membership.membership_status = 'active'
  ) then
    raise exception 'Participant is already active in this workplace' using errcode = '23505';
  end if;
  update public.pilot_invitations set revoked_at = now()
  where workplace_id = manager_workplace_id
    and email = normalized_email
    and accepted_at is null
    and revoked_at is null;
  insert into public.pilot_invitations (
    workplace_id, email, role, token_hash, invited_by, volunteer_confirmed_at
  ) values (
    manager_workplace_id, normalized_email, normalized_role,
    encode(extensions.digest(convert_to(raw_token, 'UTF8'), 'sha256'), 'hex'),
    current_profile_id, now()
  ) returning * into new_invitation;
  return query select new_invitation.id, new_invitation.email,
    new_invitation.role, new_invitation.expires_at, raw_token;
end;
$$;

revoke all on function public.create_workplace_invitation(text, text, boolean)
  from public, anon, authenticated;
grant execute on function public.create_workplace_invitation(text, text, boolean) to authenticated;

drop function public.create_pilot_manager_invitation(uuid, text);
create function public.create_pilot_manager_invitation(
  target_workplace_id uuid,
  target_email text,
  volunteer_confirmed boolean
)
returns table (invitation_id uuid, invited_email text, expires_at timestamptz, invite_token text)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  normalized_email text := lower(trim(coalesce(target_email, '')));
  raw_token text := encode(extensions.gen_random_bytes(32), 'hex');
  new_invitation public.pilot_invitations%rowtype;
begin
  if volunteer_confirmed is distinct from true then
    raise exception 'Volunteer confirmation required' using errcode = '22023';
  end if;
  if not exists (select 1 from public.workplaces where id = target_workplace_id) then
    raise exception 'Workplace not found' using errcode = 'P0002';
  end if;
  if normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Invalid email address' using errcode = '22023';
  end if;
  update public.pilot_invitations set revoked_at = now()
  where workplace_id = target_workplace_id
    and email = normalized_email
    and accepted_at is null
    and revoked_at is null;
  insert into public.pilot_invitations (
    workplace_id, email, role, token_hash, invited_by, volunteer_confirmed_at
  ) values (
    target_workplace_id, normalized_email, 'Manager',
    encode(extensions.digest(convert_to(raw_token, 'UTF8'), 'sha256'), 'hex'),
    null, now()
  ) returning * into new_invitation;
  return query select new_invitation.id, new_invitation.email,
    new_invitation.expires_at, raw_token;
end;
$$;

revoke all on function public.create_pilot_manager_invitation(uuid, text, boolean)
  from public, anon, authenticated;
grant execute on function public.create_pilot_manager_invitation(uuid, text, boolean) to service_role;

create or replace function public.list_workplace_invitations()
returns table (
  invitation_id uuid, invited_email text, invited_role text,
  invited_by_name text, created_at timestamptz, expires_at timestamptz,
  invitation_status text
)
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare manager_workplace_id uuid;
begin
  select membership.workplace_id into manager_workplace_id
  from public.workplace_members as membership
  where membership.profile_id = auth.uid()
    and membership.membership_status = 'active'
    and lower(membership.role) = 'manager'
  limit 1;
  if manager_workplace_id is null then
    raise exception 'Manager permission required' using errcode = '42501';
  end if;
  return query
  select invitation.id, invitation.email, invitation.role,
    coalesce(inviter.full_name, 'Pilot organizer'), invitation.created_at,
    invitation.expires_at,
    case
      when invitation.accepted_at is not null then 'accepted'
      when invitation.revoked_at is not null then 'revoked'
      when invitation.expires_at <= now() then 'expired'
      else 'pending'
    end
  from public.pilot_invitations as invitation
  left join public.profiles as inviter on inviter.id = invitation.invited_by
  where invitation.workplace_id = manager_workplace_id
  order by invitation.created_at desc;
end;
$$;

create or replace function public.revoke_workplace_invitation(target_invitation_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare changed_rows integer;
begin
  update public.pilot_invitations as invitation set revoked_at = now()
  where invitation.id = target_invitation_id
    and invitation.accepted_at is null
    and invitation.revoked_at is null
    and public.is_manager_for_workplace(invitation.workplace_id);
  get diagnostics changed_rows = row_count;
  return changed_rows = 1;
end;
$$;

-- Active-member-only data returned by SECURITY DEFINER readers.
create or replace function public.get_direct_release_coworkers()
returns table (profile_id uuid, full_name text, role text)
language sql stable security definer set search_path = public, pg_temp
as $$
  select distinct coworker.profile_id,
    coalesce(profile.full_name, 'Crew member')::text, coworker.role::text
  from public.workplace_members as me
  join public.workplace_members as coworker on coworker.workplace_id = me.workplace_id
  left join public.profiles as profile on profile.id = coworker.profile_id
  where me.profile_id = auth.uid() and me.membership_status = 'active'
    and coworker.membership_status = 'active'
    and coworker.profile_id <> auth.uid()
  order by coalesce(profile.full_name, 'Crew member');
$$;

create or replace function public.list_my_direct_shift_offers()
returns table (
  offer_id uuid, shift_id uuid, sender_profile_id uuid, sender_name text,
  offer_status text, created_at timestamptz, shift_data jsonb
)
language sql stable security definer set search_path = public, pg_temp
as $$
  select offer.id, offer.shift_id, offer.sender_profile_id,
    coalesce(profile.full_name, 'Coworker')::text, offer.status::text,
    offer.created_at, to_jsonb(shift_row)
  from public.direct_shift_offers as offer
  join public.shifts as shift_row on shift_row.id = offer.shift_id
  left join public.profiles as profile on profile.id = offer.sender_profile_id
  where offer.recipient_profile_id = auth.uid()
    and offer.status in ('pending', 'accepted')
    and public.is_active_workplace_member(offer.workplace_id)
  order by offer.created_at desc;
$$;

create or replace function public.get_my_active_direct_shift_offer(target_shift_id uuid)
returns table (offer_id uuid, recipient_profile_id uuid, recipient_name text, offer_status text)
language sql stable security definer set search_path = public, pg_temp
as $$
  select offer.id, offer.recipient_profile_id,
    coalesce(profile.full_name, 'Coworker')::text, offer.status::text
  from public.direct_shift_offers as offer
  left join public.profiles as profile on profile.id = offer.recipient_profile_id
  where offer.shift_id = target_shift_id
    and offer.sender_profile_id = auth.uid()
    and offer.status in ('pending', 'accepted')
    and public.is_active_workplace_member(offer.workplace_id)
  order by offer.created_at desc limit 1;
$$;

create or replace function public.list_direct_offer_approvals()
returns table (
  offer_id uuid, shift_id uuid, sender_profile_id uuid, sender_name text,
  recipient_profile_id uuid, recipient_name text, offer_status text,
  created_at timestamptz, responded_at timestamptz, shift_data jsonb
)
language sql stable security definer set search_path = public, pg_temp
as $$
  select offer.id, offer.shift_id, offer.sender_profile_id,
    coalesce(sender.full_name, 'Coworker')::text, offer.recipient_profile_id,
    coalesce(recipient.full_name, 'Coworker')::text, offer.status::text,
    offer.created_at, offer.responded_at, to_jsonb(shift_row)
  from public.direct_shift_offers as offer
  join public.shifts as shift_row on shift_row.id = offer.shift_id
  left join public.profiles as sender on sender.id = offer.sender_profile_id
  left join public.profiles as recipient on recipient.id = offer.recipient_profile_id
  where offer.status = 'accepted'
    and public.is_manager_for_workplace(offer.workplace_id)
  order by offer.responded_at desc nulls last;
$$;

-- Departure is blocked while operational responsibilities remain. The helper
-- returns only a stable reason code so clients never receive participant data.
create or replace function public.pilot_membership_deactivation_blocker(
  target_workplace_id uuid,
  target_profile_id uuid
)
returns text
language plpgsql stable security definer set search_path = public, pg_temp
as $$
begin
  if exists (
    select 1 from public.shifts as shift_row
    where shift_row.workplace_id = target_workplace_id
      and shift_row.assigned_profile_id = target_profile_id
      and shift_row.actual_started_at is not null
      and shift_row.actual_ended_at is null
      and shift_row.status <> 'cancelled'
  ) then return 'active_shift'; end if;
  if exists (
    select 1 from public.shifts as shift_row
    where shift_row.workplace_id = target_workplace_id
      and shift_row.assigned_profile_id = target_profile_id
      and shift_row.starts_at > now()
      and shift_row.status in ('scheduled', 'coverage_needed')
  ) then return 'future_shift'; end if;
  if exists (
    select 1 from public.shifts as shift_row
    where shift_row.workplace_id = target_workplace_id
      and shift_row.assigned_profile_id = target_profile_id
      and shift_row.status = 'coverage_needed'
      and shift_row.coverage_stage in ('open', 'interest', 'selected')
      and shift_row.actual_ended_at is null
  ) then return 'coverage_responsibility'; end if;
  if exists (
    select 1 from public.shift_interests as interest
    join public.shifts as shift_row on shift_row.id = interest.shift_id
    where shift_row.workplace_id = target_workplace_id
      and interest.profile_id = target_profile_id
      and interest.status in ('interested', 'selected', 'confirmed')
      and shift_row.status not in ('completed', 'cancelled')
      and (shift_row.starts_at > now() or shift_row.actual_ended_at is null)
  ) then return 'shift_interest'; end if;
  if exists (
    select 1 from public.direct_shift_offers as offer
    where offer.workplace_id = target_workplace_id
      and (offer.sender_profile_id = target_profile_id
        or offer.recipient_profile_id = target_profile_id)
      and offer.status in ('pending', 'accepted')
  ) then return 'direct_offer'; end if;
  return null;
end;
$$;

revoke all on function public.pilot_membership_deactivation_blocker(uuid, uuid)
  from public, anon, authenticated;

create or replace function public.leave_pilot()
returns table (outcome text, reason text, workplace_name text)
language plpgsql security definer set search_path = public, auth, pg_temp
as $$
declare
  current_profile_id uuid := auth.uid();
  membership public.workplace_members%rowtype;
  blocker text;
  selected_workplace_name text;
begin
  select * into membership from public.workplace_members
  where profile_id = current_profile_id and membership_status = 'active'
  for update;
  if not found then
    return query select 'not_active'::text, 'no_active_membership'::text, null::text;
    return;
  end if;
  -- Serialize departures within the workplace so two Managers cannot both
  -- observe another active Manager and concurrently remove the final pair.
  perform 1 from public.workplaces
  where id = membership.workplace_id for update;
  select name into selected_workplace_name from public.workplaces
  where id = membership.workplace_id;
  if lower(membership.role) = 'manager' and (
    select count(*) from public.workplace_members
    where workplace_id = membership.workplace_id
      and membership_status = 'active' and lower(role) = 'manager'
  ) <= 1 then
    return query select 'blocked'::text, 'last_manager'::text, selected_workplace_name;
    return;
  end if;
  blocker := public.pilot_membership_deactivation_blocker(
    membership.workplace_id, current_profile_id
  );
  if blocker is not null then
    return query select 'blocked'::text, blocker, selected_workplace_name;
    return;
  end if;
  update public.workplace_members set
    membership_status = 'inactive', deactivated_at = now(),
    deactivated_by = current_profile_id, deactivation_reason = 'voluntary'
  where workplace_id = membership.workplace_id and profile_id = current_profile_id;
  return query select 'deactivated'::text, null::text, selected_workplace_name;
end;
$$;

create or replace function public.remove_workplace_member(target_profile_id uuid)
returns table (outcome text, reason text, participant_name text)
language plpgsql security definer set search_path = public, auth, pg_temp
as $$
declare
  manager_profile_id uuid := auth.uid();
  manager_workplace_id uuid;
  target_membership public.workplace_members%rowtype;
  blocker text;
  selected_participant_name text;
begin
  select workplace_id into manager_workplace_id from public.workplace_members
  where profile_id = manager_profile_id and membership_status = 'active'
    and lower(role) = 'manager' limit 1;
  if manager_workplace_id is null then
    raise exception 'Manager permission required' using errcode = '42501';
  end if;
  -- Share the same workplace lock as leave_pilot() for atomic last-Manager
  -- protection across voluntary departures and manager removals.
  perform 1 from public.workplaces
  where id = manager_workplace_id for update;
  if target_profile_id = manager_profile_id then
    return query select 'blocked'::text, 'use_leave_pilot'::text, null::text;
    return;
  end if;
  select * into target_membership from public.workplace_members
  where workplace_id = manager_workplace_id and profile_id = target_profile_id
    and membership_status = 'active' for update;
  if not found then
    return query select 'not_active'::text, 'no_active_membership'::text, null::text;
    return;
  end if;
  select coalesce(full_name, 'Participant') into selected_participant_name
  from public.profiles where id = target_profile_id;
  if lower(target_membership.role) = 'manager' and (
    select count(*) from public.workplace_members
    where workplace_id = manager_workplace_id
      and membership_status = 'active' and lower(role) = 'manager'
  ) <= 1 then
    return query select 'blocked'::text, 'last_manager'::text, selected_participant_name;
    return;
  end if;
  blocker := public.pilot_membership_deactivation_blocker(
    manager_workplace_id, target_profile_id
  );
  if blocker is not null then
    return query select 'blocked'::text, blocker, selected_participant_name;
    return;
  end if;
  update public.workplace_members set
    membership_status = 'inactive', deactivated_at = now(),
    deactivated_by = manager_profile_id, deactivation_reason = 'manager_removed'
  where workplace_id = manager_workplace_id and profile_id = target_profile_id;
  return query select 'deactivated'::text, null::text, selected_participant_name;
end;
$$;

revoke all on function public.leave_pilot() from public, anon, authenticated;
revoke all on function public.remove_workplace_member(uuid)
  from public, anon, authenticated;
grant execute on function public.leave_pilot() to authenticated;
grant execute on function public.remove_workplace_member(uuid) to authenticated;

comment on function public.leave_pilot() is
  'Soft-deactivates the caller membership when no unresolved pilot responsibilities remain. Does not delete the Auth account.';
comment on function public.remove_workplace_member(uuid) is
  'Allows an active workplace manager to soft-deactivate another active member when no unresolved responsibilities remain.';
