alter table public.coverage_events
  add column shift_starts_at timestamptz,
  add column shift_ends_at timestamptz,
  add column shift_role text;

-- Preserve enough non-sensitive shift context for Activity to remain useful
-- after row-level security removes a member's access to the live shift.
update public.coverage_events as coverage_event
set
  shift_starts_at = shift.starts_at,
  shift_ends_at = shift.ends_at,
  shift_role = shift.role
from public.shifts as shift
where shift.id = coverage_event.shift_id;

alter table public.coverage_events
  alter column shift_starts_at set not null;

create or replace function public.capture_coverage_event_shift_snapshot()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  select
    shift.starts_at,
    shift.ends_at,
    shift.role
  into
    new.shift_starts_at,
    new.shift_ends_at,
    new.shift_role
  from public.shifts as shift
  where shift.id = new.shift_id;

  if not found then
    raise exception 'Shift not found';
  end if;

  return new;
end;
$$;

revoke all
on function public.capture_coverage_event_shift_snapshot()
from public;

create trigger capture_coverage_event_shift_snapshot
before insert on public.coverage_events
for each row
execute function public.capture_coverage_event_shift_snapshot();

comment on column public.coverage_events.shift_starts_at is
  'Shift start time captured when the activity event is created.';

comment on column public.coverage_events.shift_ends_at is
  'Shift end time captured when the activity event is created.';

comment on column public.coverage_events.shift_role is
  'Shift role captured when the activity event is created.';
