create or replace function public.release_shift_for_coverage(
  target_shift_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_profile_id uuid := auth.uid();
  current_shift public.shifts%rowtype;
  released_shift jsonb;
begin
  if current_profile_id is null then
    raise exception 'Authentication required'
      using errcode = '42501';
  end if;

  select *
  into current_shift
  from public.shifts
  where id = target_shift_id
  for update;

  if not found then
    raise exception 'Shift not found'
      using errcode = 'P0002';
  end if;

  if current_shift.assigned_profile_id is distinct from current_profile_id then
    raise exception 'You are not assigned to this shift'
      using errcode = '42501';
  end if;

  if current_shift.status = 'completed' or current_shift.actual_ended_at is not null then
    raise exception 'Completed shifts cannot be released'
      using errcode = '22023';
  end if;

  if current_shift.status = 'coverage_needed' then
    raise exception 'This shift has already been released'
      using errcode = '22023';
  end if;

  if current_shift.status <> 'scheduled' then
    raise exception 'Only scheduled shifts can be released'
      using errcode = '22023';
  end if;

  if current_shift.actual_started_at is not null then
    raise exception 'Started shifts cannot be released'
      using errcode = '22023';
  end if;

  if current_shift.starts_at <= now() then
    raise exception 'Past shifts cannot be released'
      using errcode = '22023';
  end if;

  delete from public.shift_interests
  where shift_id = target_shift_id;

  update public.shifts
  set
    status = 'coverage_needed',
    coverage_stage = 'open'
  where id = target_shift_id;

  select jsonb_build_object(
    'id', s.id,
    'assigned_profile_id', s.assigned_profile_id,
    'role', s.role,
    'starts_at', s.starts_at,
    'ends_at', s.ends_at,
    'end_label', s.end_label,
    'status', s.status,
    'coverage_stage', s.coverage_stage,
    'workplace', jsonb_build_object(
      'name', w.name,
      'time_zone', w.time_zone
    )
  )
  into released_shift
  from public.shifts s
  left join public.workplaces w
    on w.id = s.workplace_id
  where s.id = target_shift_id;

  return released_shift;
end;
$$;

revoke all
on function public.release_shift_for_coverage(uuid)
from public;

grant execute
on function public.release_shift_for_coverage(uuid)
to authenticated;

drop policy if exists "workers can create initial shift interest"
on public.shift_interests;

create policy "workers can create initial shift interest"
on public.shift_interests
for insert
to authenticated
with check (
  profile_id = auth.uid()
  and status = 'interested'
  and exists (
    select 1
    from public.shifts s
    join public.workplace_members wm
      on wm.workplace_id = s.workplace_id
    where s.id = shift_interests.shift_id
      and wm.profile_id = auth.uid()
      and (
        (
          s.status = 'coverage_needed'
          and s.assigned_profile_id is distinct from auth.uid()
        )
        or (
          s.status = 'open'
          and s.assigned_profile_id is null
        )
      )
  )
);

comment on policy "workers can create initial shift interest"
on public.shift_interests is
  'Workers may create only their own interested response for an eligible same-workplace coverage or unassigned open shift.';
