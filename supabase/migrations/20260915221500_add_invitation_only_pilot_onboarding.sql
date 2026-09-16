-- Invitation-only onboarding for controlled Industry pilots.
-- Raw invite tokens are returned once and never stored in the database.

create extension if not exists pgcrypto with schema extensions;

create table public.pilot_invitations (
  id uuid primary key default gen_random_uuid(),
  workplace_id uuid not null
    references public.workplaces(id)
    on delete cascade,
  email text not null,
  role text not null,
  token_hash text not null unique,
  invited_by uuid
    references public.profiles(id)
    on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  accepted_profile_id uuid
    references public.profiles(id)
    on delete set null,
  revoked_at timestamptz,
  constraint pilot_invitations_email_normalized
    check (email = lower(trim(email)) and email like '%@%'),
  constraint pilot_invitations_role_present
    check (char_length(trim(role)) > 0),
  constraint pilot_invitations_expiry_after_creation
    check (expires_at > created_at),
  constraint pilot_invitations_acceptance_complete
    check (
      (accepted_at is null and accepted_profile_id is null)
      or (accepted_at is not null and accepted_profile_id is not null)
    )
);

create index pilot_invitations_workplace_created_at_idx
  on public.pilot_invitations(workplace_id, created_at desc);

create index pilot_invitations_active_email_idx
  on public.pilot_invitations(workplace_id, email)
  where accepted_at is null and revoked_at is null;

alter table public.pilot_invitations enable row level security;

revoke all on table public.pilot_invitations from anon, authenticated;

create or replace function public.get_pilot_invitation(invite_token text)
returns table (
  invitation_id uuid,
  workplace_name text,
  invited_email text,
  invited_role text,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  normalized_token text := trim(coalesce(invite_token, ''));
begin
  if char_length(normalized_token) < 32 then
    return;
  end if;

  return query
  select
    invitation.id,
    workplace.name,
    invitation.email,
    invitation.role,
    invitation.expires_at
  from public.pilot_invitations as invitation
  join public.workplaces as workplace
    on workplace.id = invitation.workplace_id
  where invitation.token_hash = encode(
    extensions.digest(convert_to(normalized_token, 'UTF8'), 'sha256'),
    'hex'
  )
    and invitation.accepted_at is null
    and invitation.revoked_at is null
    and invitation.expires_at > now()
  limit 1;
end;
$$;

create or replace function public.accept_pilot_invitation(invite_token text)
returns table (
  workplace_id uuid,
  workplace_name text,
  member_role text
)
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
    raise exception 'Sign in before accepting this invitation.';
  end if;

  select *
  into invitation
  from public.pilot_invitations
  where token_hash = encode(
    extensions.digest(convert_to(normalized_token, 'UTF8'), 'sha256'),
    'hex'
  )
  for update;

  if invitation.id is null
    or invitation.accepted_at is not null
    or invitation.revoked_at is not null
    or invitation.expires_at <= now() then
    raise exception 'This invitation is invalid or has expired.';
  end if;

  if current_email = '' or current_email <> invitation.email then
    raise exception 'Sign in with the email address that received this invitation.';
  end if;

  if exists (
    select 1
    from public.workplace_members as membership
    where membership.profile_id = current_profile_id
      and membership.workplace_id <> invitation.workplace_id
  ) then
    raise exception 'This account is already connected to another workplace.';
  end if;

  insert into public.workplace_members (
    workplace_id,
    profile_id,
    role
  )
  values (
    invitation.workplace_id,
    current_profile_id,
    invitation.role
  )
  on conflict (workplace_id, profile_id)
  do update set role = excluded.role;

  update public.pilot_invitations
  set
    accepted_at = now(),
    accepted_profile_id = current_profile_id
  where id = invitation.id;

  return query
  select
    workplace.id,
    workplace.name,
    invitation.role
  from public.workplaces as workplace
  where workplace.id = invitation.workplace_id;
end;
$$;

create or replace function public.create_workplace_invitation(
  target_email text,
  target_role text
)
returns table (
  invitation_id uuid,
  invited_email text,
  invited_role text,
  expires_at timestamptz,
  invite_token text
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
  select membership.workplace_id
  into manager_workplace_id
  from public.workplace_members as membership
  where membership.profile_id = current_profile_id
    and lower(membership.role) = 'manager'
  limit 1;

  if manager_workplace_id is null then
    raise exception 'Only a workplace manager can invite crew.';
  end if;

  if normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Enter a valid email address.';
  end if;

  if normalized_role not in (
    'Server',
    'Bartender',
    'Host',
    'Busser',
    'Cook',
    'Dishwasher',
    'Barback',
    'Other'
  ) then
    raise exception 'Choose an approved worker role.';
  end if;

  if exists (
    select 1
    from auth.users as existing_user
    join public.workplace_members as existing_membership
      on existing_membership.profile_id = existing_user.id
    where lower(existing_user.email) = normalized_email
      and existing_membership.workplace_id = manager_workplace_id
  ) then
    raise exception 'That person is already connected to this workplace.';
  end if;

  update public.pilot_invitations
  set revoked_at = now()
  where workplace_id = manager_workplace_id
    and email = normalized_email
    and accepted_at is null
    and revoked_at is null;

  insert into public.pilot_invitations (
    workplace_id,
    email,
    role,
    token_hash,
    invited_by
  )
  values (
    manager_workplace_id,
    normalized_email,
    normalized_role,
    encode(
      extensions.digest(convert_to(raw_token, 'UTF8'), 'sha256'),
      'hex'
    ),
    current_profile_id
  )
  returning * into new_invitation;

  return query
  select
    new_invitation.id,
    new_invitation.email,
    new_invitation.role,
    new_invitation.expires_at,
    raw_token;
end;
$$;

create or replace function public.list_workplace_invitations()
returns table (
  invitation_id uuid,
  invited_email text,
  invited_role text,
  invited_by_name text,
  created_at timestamptz,
  expires_at timestamptz,
  invitation_status text
)
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  current_profile_id uuid := auth.uid();
  manager_workplace_id uuid;
begin
  select membership.workplace_id
  into manager_workplace_id
  from public.workplace_members as membership
  where membership.profile_id = current_profile_id
    and lower(membership.role) = 'manager'
  limit 1;

  if manager_workplace_id is null then
    raise exception 'Only a workplace manager can view invitations.';
  end if;

  return query
  select
    invitation.id,
    invitation.email,
    invitation.role,
    coalesce(inviter.full_name, 'Pilot organizer'),
    invitation.created_at,
    invitation.expires_at,
    case
      when invitation.accepted_at is not null then 'accepted'
      when invitation.revoked_at is not null then 'revoked'
      when invitation.expires_at <= now() then 'expired'
      else 'pending'
    end
  from public.pilot_invitations as invitation
  left join public.profiles as inviter
    on inviter.id = invitation.invited_by
  where invitation.workplace_id = manager_workplace_id
  order by invitation.created_at desc;
end;
$$;

create or replace function public.revoke_workplace_invitation(
  target_invitation_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  current_profile_id uuid := auth.uid();
  changed_rows integer;
begin
  update public.pilot_invitations as invitation
  set revoked_at = now()
  where invitation.id = target_invitation_id
    and invitation.accepted_at is null
    and invitation.revoked_at is null
    and exists (
      select 1
      from public.workplace_members as membership
      where membership.workplace_id = invitation.workplace_id
        and membership.profile_id = current_profile_id
        and lower(membership.role) = 'manager'
    );

  get diagnostics changed_rows = row_count;
  return changed_rows = 1;
end;
$$;

-- Pilot organizers use this service-only function to create the first manager
-- invitation for an existing workplace. It is intentionally unavailable to
-- browsers and authenticated participants.
create or replace function public.create_pilot_manager_invitation(
  target_workplace_id uuid,
  target_email text
)
returns table (
  invitation_id uuid,
  invited_email text,
  expires_at timestamptz,
  invite_token text
)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  normalized_email text := lower(trim(coalesce(target_email, '')));
  raw_token text := encode(extensions.gen_random_bytes(32), 'hex');
  new_invitation public.pilot_invitations%rowtype;
begin
  if not exists (
    select 1 from public.workplaces where id = target_workplace_id
  ) then
    raise exception 'Workplace not found.';
  end if;

  if normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Enter a valid email address.';
  end if;

  update public.pilot_invitations
  set revoked_at = now()
  where workplace_id = target_workplace_id
    and email = normalized_email
    and accepted_at is null
    and revoked_at is null;

  insert into public.pilot_invitations (
    workplace_id,
    email,
    role,
    token_hash,
    invited_by
  )
  values (
    target_workplace_id,
    normalized_email,
    'Manager',
    encode(
      extensions.digest(convert_to(raw_token, 'UTF8'), 'sha256'),
      'hex'
    ),
    null
  )
  returning * into new_invitation;

  return query
  select
    new_invitation.id,
    new_invitation.email,
    new_invitation.expires_at,
    raw_token;
end;
$$;

revoke all on function public.get_pilot_invitation(text) from public;
revoke all on function public.accept_pilot_invitation(text) from public;
revoke all on function public.create_workplace_invitation(text, text) from public;
revoke all on function public.list_workplace_invitations() from public;
revoke all on function public.revoke_workplace_invitation(uuid) from public;
revoke all on function public.create_pilot_manager_invitation(uuid, text) from public;

grant execute on function public.get_pilot_invitation(text)
  to anon, authenticated;
grant execute on function public.accept_pilot_invitation(text)
  to authenticated;
grant execute on function public.create_workplace_invitation(text, text)
  to authenticated;
grant execute on function public.list_workplace_invitations()
  to authenticated;
grant execute on function public.revoke_workplace_invitation(uuid)
  to authenticated;
grant execute on function public.create_pilot_manager_invitation(uuid, text)
  to service_role;
