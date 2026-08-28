create or replace function public.release_shift_for_coverage(
  target_shift_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_profile_id uuid;
begin
  select id
  into current_profile_id
  from profiles
  where user_id = auth.uid();

  if current_profile_id is null then
    raise exception 'Profile not found';
  end if;

  if not exists (
    select 1
    from shifts
    where id = target_shift_id
      and assigned_profile_id = current_profile_id
  ) then
    raise exception 'You are not assigned to this shift';
  end if;

  delete from shift_interests
  where shift_id = target_shift_id;

  update shifts
  set status = 'coverage_needed'
  where id = target_shift_id
    and assigned_profile_id = current_profile_id;
end;
$$;