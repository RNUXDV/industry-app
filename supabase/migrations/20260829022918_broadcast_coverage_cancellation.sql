create or replace function public.cancel_coverage_request(
  p_shift_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_shift public.shifts%rowtype;
  restored_shift jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required'
      using errcode = '42501';
  end if;

  select *
  into current_shift
  from public.shifts
  where id = p_shift_id
  for update;

  if not found then
    raise exception 'Shift not found'
      using errcode = 'P0002';
  end if;

  if current_shift.assigned_profile_id <> auth.uid() then
    raise exception 'You are not assigned to this shift'
      using errcode = '42501';
  end if;

  if current_shift.status <> 'coverage_needed' then
    raise exception 'This shift does not have an active coverage request'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from public.shift_interests
    where shift_id = p_shift_id
      and status in ('selected', 'confirmed')
  ) then
    raise exception 'Coverage cannot be canceled after a worker has been selected'
      using errcode = '22023';
  end if;

  delete from public.shift_interests
  where shift_id = p_shift_id;

  update public.shifts
  set
    status = 'scheduled',
    coverage_stage = null
  where id = p_shift_id;

  -- Workplace-wide realtime signal.
  -- The frontend intentionally hides this event from Activity.
  insert into public.coverage_events (
    shift_id,
    workplace_id,
    event_type,
    previous_profile_id,
    new_profile_id
  )
  values (
    p_shift_id,
    current_shift.workplace_id,
    'coverage_canceled',
    current_shift.assigned_profile_id,
    null
  );

  select jsonb_build_object(
    'id', s.id,
    'assigned_profile_id', s.assigned_profile_id,
    'status', s.status,
    'coverage_stage', s.coverage_stage
  )
  into restored_shift
  from public.shifts s
  where s.id = p_shift_id;

  return restored_shift;
end;
$$;

revoke all
on function public.cancel_coverage_request(uuid)
from public;

grant execute
on function public.cancel_coverage_request(uuid)
to authenticated;