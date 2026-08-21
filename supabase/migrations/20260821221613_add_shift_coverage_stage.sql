-- Add a workplace-visible stage for the Catch coverage process.
-- The shift itself remains coverage_needed until manager approval.

alter table public.shifts
add column if not exists coverage_stage text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'shifts_coverage_stage_check'
      and conrelid = 'public.shifts'::regclass
  ) then
    alter table public.shifts
    add constraint shifts_coverage_stage_check
    check (
      coverage_stage is null
      or coverage_stage in (
        'open',
        'interest',
        'selected',
        'confirmed'
      )
    );
  end if;
end
$$;


-- Backfill existing coverage requests based on their current interests.
update public.shifts s
set coverage_stage =
  case
    when exists (
      select 1
      from public.shift_interests si
      where si.shift_id = s.id
        and si.status = 'confirmed'
    ) then 'confirmed'

    when exists (
      select 1
      from public.shift_interests si
      where si.shift_id = s.id
        and si.status = 'selected'
    ) then 'selected'

    when exists (
      select 1
      from public.shift_interests si
      where si.shift_id = s.id
        and si.status = 'interested'
    ) then 'interest'

    else 'open'
  end
where s.status = 'coverage_needed';


-- Keep the public shift-wide coverage stage synchronized
-- whenever an individual worker's interest changes.
create or replace function public.sync_shift_coverage_stage()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_shift_id uuid;
  target_stage text;
begin
  if tg_op = 'DELETE' then
    target_shift_id := old.shift_id;
  else
    target_shift_id := new.shift_id;
  end if;

  select
    case
      when exists (
        select 1
        from public.shift_interests
        where shift_id = target_shift_id
          and status = 'confirmed'
      ) then 'confirmed'

      when exists (
        select 1
        from public.shift_interests
        where shift_id = target_shift_id
          and status = 'selected'
      ) then 'selected'

      when exists (
        select 1
        from public.shift_interests
        where shift_id = target_shift_id
          and status = 'interested'
      ) then 'interest'

      else 'open'
    end
  into target_stage;

  update public.shifts
  set coverage_stage = target_stage
  where id = target_shift_id
    and status = 'coverage_needed';

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;


drop trigger if exists sync_shift_coverage_stage_after_interest_change
on public.shift_interests;

create trigger sync_shift_coverage_stage_after_interest_change
after insert or update or delete
on public.shift_interests
for each row
execute function public.sync_shift_coverage_stage();