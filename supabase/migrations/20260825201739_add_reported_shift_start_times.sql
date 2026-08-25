alter table public.shifts
  add column if not exists reported_started_at timestamptz,
  add column if not exists start_recorded_at timestamptz,
  add column if not exists start_time_source text;


create or replace function public.report_assigned_shift_start(
  target_shift_id uuid,
  reported_start_at timestamptz
)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if reported_start_at is null then
    raise exception 'Clock-in time is required';
  end if;

  if reported_start_at > now() then
    raise exception 'Clock-in time cannot be in the future';
  end if;

  if not exists (
    select 1
    from public.shifts
    where id = target_shift_id
      and assigned_profile_id = auth.uid()
      and status = 'scheduled'
      and actual_started_at is null
      and actual_ended_at is null
  ) then
    raise exception 'Shift not found, already started, ended, or not authorized';
  end if;

  update public.shifts
  set
    reported_started_at = reported_start_at,
    start_recorded_at = now(),
    start_time_source = 'worker_reported',

    -- Temporary compatibility field.
    -- Existing Industry UI already reads actual_started_at.
    actual_started_at = reported_start_at

  where id = target_shift_id
    and assigned_profile_id = auth.uid();
end;
$function$;


revoke execute on function
  public.report_assigned_shift_start(uuid, timestamptz)
from public;

revoke execute on function
  public.report_assigned_shift_start(uuid, timestamptz)
from anon;

grant execute on function
  public.report_assigned_shift_start(uuid, timestamptz)
to authenticated;