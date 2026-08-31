create or replace function public.manager_update_shift(
  target_shift_id uuid,
  target_assigned_profile_id uuid,
  target_role text,
  target_starts_at timestamptz,
  target_ends_at timestamptz,
  target_end_label text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_profile_id uuid;
  target_workplace_id uuid;
  previous_profile_id uuid;
begin
  current_profile_id := auth.uid();

  if current_profile_id is null then
    raise exception 'User not authenticated';
  end if;

  -- Lock the shift and capture its current owner/workplace
  -- before anything changes.
  select
    workplace_id,
    assigned_profile_id
  into
    target_workplace_id,
    previous_profile_id
  from public.shifts
  where id = target_shift_id
  for update;

  if not found then
    raise exception 'Shift not found';
  end if;

  -- Only a manager at this workplace may edit the shift.
  if not exists (
    select 1
    from public.workplace_members wm
    where wm.workplace_id = target_workplace_id
      and wm.profile_id = current_profile_id
      and lower(wm.role::text) = 'manager'
  ) then
    raise exception 'Only a workplace manager may update this shift';
  end if;

  -- If assigning the shift to somebody, that person must
  -- belong to the same workplace.
  if target_assigned_profile_id is not null
    and not exists (
      select 1
      from public.workplace_members wm
      where wm.workplace_id = target_workplace_id
        and wm.profile_id = target_assigned_profile_id
    )
  then
    raise exception 'Assigned worker is not a workplace member';
  end if;

  update public.shifts
  set
    assigned_profile_id = target_assigned_profile_id,
    role = target_role,
    starts_at = target_starts_at,
    ends_at = target_ends_at,
    end_label = target_end_label,
    status = case
      when target_assigned_profile_id is null then 'open'
      else 'scheduled'
    end,
    coverage_stage = case
      when target_assigned_profile_id is null then 'open'
      else null
    end
  where id = target_shift_id
    and workplace_id = target_workplace_id;

  -- Broadcast ownership changes through coverage_events.
  -- All workplace members can see these events, including the
  -- worker who just lost access to the shift row under RLS.
  if previous_profile_id is distinct from target_assigned_profile_id then
    insert into public.coverage_events (
      shift_id,
      workplace_id,
      event_type,
      previous_profile_id,
      new_profile_id
    )
    values (
      target_shift_id,
      target_workplace_id,
      'manager_reassigned',
      previous_profile_id,
      target_assigned_profile_id
    );
  end if;

  return target_shift_id;
end;
$$;

revoke all
on function public.manager_update_shift(
  uuid,
  uuid,
  text,
  timestamptz,
  timestamptz,
  text
)
from public;

grant execute
on function public.manager_update_shift(
  uuid,
  uuid,
  text,
  timestamptz,
  timestamptz,
  text
)
to authenticated;