create or replace function public.select_shift_interest(
  p_interest_id uuid
)
returns table (
  id uuid,
  shift_id uuid,
  profile_id uuid,
  status text
)
language plpgsql
security definer
set search_path = public
as $function$
declare
  target_interest public.shift_interests%rowtype;
  target_shift public.shifts%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Authentication required'
      using errcode = '42501';
  end if;

  select *
  into target_interest
  from public.shift_interests
  where shift_interests.id = p_interest_id
  for update;

  if not found then
    raise exception 'Shift interest not found'
      using errcode = 'P0002';
  end if;

  select *
  into target_shift
  from public.shifts
  where shifts.id = target_interest.shift_id
  for update;

  if not found then
    raise exception 'Shift not found'
      using errcode = 'P0002';
  end if;

  -- Managers select coworkers for both released coverage-needed
  -- shifts and unassigned open shifts.
  if not (
    public.is_manager_for_shift(target_shift.id)
    and (
      target_shift.status = 'coverage_needed'
      or (
        target_shift.status = 'open'
        and target_shift.assigned_profile_id is null
      )
    )
  ) then
    raise exception 'Not authorized to select this shift interest'
      using errcode = '42501';
  end if;

  -- Make repeat clicks on the already-selected worker harmless.
  if target_interest.status = 'selected' then
    return query
    select
      si.id,
      si.shift_id,
      si.profile_id,
      si.status
    from public.shift_interests si
    where si.id = p_interest_id;

    return;
  end if;

  if target_interest.status <> 'interested' then
    raise exception 'Only an interested coworker can be selected'
      using errcode = '22023';
  end if;

  -- Guarantee only one selected coworker for the shift.
  update public.shift_interests
  set status = 'interested'
  where shift_interests.shift_id = target_interest.shift_id
    and shift_interests.status = 'selected'
    and shift_interests.id <> p_interest_id;

  update public.shift_interests
  set status = 'selected'
  where shift_interests.id = p_interest_id;

  return query
  select
    si.id,
    si.shift_id,
    si.profile_id,
    si.status
  from public.shift_interests si
  where si.id = p_interest_id;
end;
$function$;

revoke all
on function public.select_shift_interest(uuid)
from public;

grant execute
on function public.select_shift_interest(uuid)
to authenticated;