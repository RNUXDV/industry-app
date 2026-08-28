create or replace function public.release_shift_for_coverage(
  target_shift_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_profile_id uuid;
  released_shift jsonb;
begin
  current_profile_id := auth.uid();

  if current_profile_id is null then
    raise exception 'User not authenticated';
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

  select jsonb_build_object(
    'id', s.id,
    'assigned_profile_id', s.assigned_profile_id,
    'role', s.role,
    'starts_at', s.starts_at,
    'ends_at', s.ends_at,
    'end_label', s.end_label,
    'status', s.status,
    'workplace', jsonb_build_object(
      'name', w.name,
      'time_zone', w.time_zone
    )
  )
  into released_shift
  from shifts s
  left join workplaces w
    on w.id = s.workplace_id
  where s.id = target_shift_id;

  return released_shift;
end;
$$;

revoke all on function public.release_shift_for_coverage(uuid) from public;
grant execute on function public.release_shift_for_coverage(uuid) to authenticated;