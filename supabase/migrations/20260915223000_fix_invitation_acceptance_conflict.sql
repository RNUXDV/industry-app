-- Avoid a PL/pgSQL output-column name collision in invitation acceptance.

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
  on conflict on constraint workplace_members_pkey
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

revoke all on function public.accept_pilot_invitation(text) from public;
grant execute on function public.accept_pilot_invitation(text)
  to authenticated;
