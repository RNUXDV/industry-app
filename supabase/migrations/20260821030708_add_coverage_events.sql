create table public.coverage_events (
  id uuid primary key default gen_random_uuid(),

  shift_id uuid not null
    references public.shifts(id)
    on delete cascade,

  workplace_id uuid not null,

  event_type text not null,

  previous_profile_id uuid
    references public.profiles(id)
    on delete set null,

  new_profile_id uuid
    references public.profiles(id)
    on delete set null,

  created_at timestamptz not null default now()
);

create index coverage_events_workplace_id_idx
  on public.coverage_events(workplace_id);

create index coverage_events_shift_id_idx
  on public.coverage_events(shift_id);


alter table public.coverage_events
enable row level security;


create policy "workplace members can view coverage events"
on public.coverage_events
for select
to authenticated
using (
  exists (
    select 1
    from public.workplace_members wm
    where wm.workplace_id = coverage_events.workplace_id
      and wm.profile_id = auth.uid()
  )
);


revoke all on table public.coverage_events from anon;

grant select
on table public.coverage_events
to authenticated;


alter publication supabase_realtime
add table public.coverage_events;

create or replace function public.confirm_shift_coverage (
  target_shift_id uuid,
  selected_profile_id uuid
)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  target_workplace_id uuid;
  target_previous_profile_id uuid;
begin
  -- Capture both the workplace and the worker releasing the shift
  -- before ownership changes.
  select
    workplace_id,
    assigned_profile_id
  into
    target_workplace_id,
    target_previous_profile_id
  from public.shifts
  where id = target_shift_id;

  if target_workplace_id is null then
    raise exception 'Shift not found';
  end if;

  -- Only a manager at this workplace may approve coverage.
  if not exists (
    select 1
    from public.workplace_members
    where workplace_id = target_workplace_id
      and profile_id = auth.uid()
      and lower(role) = 'manager'
  ) then
    raise exception 'Not authorized to approve this shift';
  end if;

  -- The worker must actually be the selected candidate.
  if not exists (
    select 1
    from public.shift_interests
    where shift_id = target_shift_id
      and profile_id = selected_profile_id
      and status = 'selected'
  ) then
    raise exception 'Selected shift interest not found';
  end if;

  -- Confirm the selected worker.
  update public.shift_interests
  set status = 'confirmed'
  where shift_id = target_shift_id
    and profile_id = selected_profile_id
    and status = 'selected';

  -- Transfer the shift.
  update public.shifts
  set
    assigned_profile_id = selected_profile_id,
    status = 'scheduled'
  where id = target_shift_id;

  -- Leave behind a workplace-visible event after ownership changes.
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
    'coverage_confirmed',
    target_previous_profile_id,
    selected_profile_id
  );
end;
$function$;