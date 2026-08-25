alter table public.shifts
  add column if not exists reported_ended_at timestamptz,
  add column if not exists end_recorded_at timestamptz,
  add column if not exists end_time_source text;


create or replace function public.report_assigned_shift_end(
  target_shift_id uuid,
  reported_end_at timestamptz
)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  target_starts_at timestamptz;
begin
  if reported_end_at is null then
    raise exception 'Reported end time is required';
  end if;

  select starts_at
  into target_starts_at
  from public.shifts
  where id = target_shift_id
    and assigned_profile_id = auth.uid()
    and status = 'scheduled'
    and actual_ended_at is null;

  if target_starts_at is null then
    raise exception 'Shift not found, already ended, or not authorized';
  end if;

  if reported_end_at < target_starts_at then
    raise exception 'End time cannot be before the shift starts';
  end if;

  if reported_end_at > now() then
    raise exception 'End time cannot be in the future';
  end if;

  update public.shifts
  set
    reported_ended_at = reported_end_at,
    end_recorded_at = now(),
    end_time_source = 'worker_reported',

    -- Temporary compatibility field.
    -- Existing Industry UI currently reads actual_ended_at.
    actual_ended_at = reported_end_at

  where id = target_shift_id
    and assigned_profile_id = auth.uid();
end;
$function$;


revoke execute on function
  public.report_assigned_shift_end(uuid, timestamptz)
from public;

revoke execute on function
  public.report_assigned_shift_end(uuid, timestamptz)
from anon;

grant execute on function
  public.report_assigned_shift_end(uuid, timestamptz)
to authenticated;


-- Keep the current RPC working while the frontend is transitioned.
-- Calling the old End Shift flow will now produce transparent records too.
create or replace function public.end_assigned_shift(
  target_shift_id uuid
)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  perform public.report_assigned_shift_end(
    target_shift_id,
    now()
  );
end;
$function$;


revoke execute on function
  public.end_assigned_shift(uuid)
from public;

revoke execute on function
  public.end_assigned_shift(uuid)
from anon;

grant execute on function
  public.end_assigned_shift(uuid)
to authenticated;