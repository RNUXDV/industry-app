create or replace function public.get_direct_release_coworkers()
returns table (
  profile_id uuid,
  full_name text,
  role text
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select distinct
    coworker.profile_id,
    coalesce(profile.full_name, 'Crew member')::text as full_name,
    coworker.role::text as role
  from public.workplace_members as me
  join public.workplace_members as coworker
    on coworker.workplace_id = me.workplace_id
  left join public.profiles as profile
    on profile.id = coworker.profile_id
  where me.profile_id = auth.uid()
    and coworker.profile_id <> auth.uid()
  order by coalesce(profile.full_name, 'Crew member');
$$;

revoke all
on function public.get_direct_release_coworkers()
from public;

grant execute
on function public.get_direct_release_coworkers()
to authenticated;