create or replace function public.sync_shift_coverage_stage()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
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
    and status in ('coverage_needed', 'open');

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$function$;

-- Bring existing active Catch shifts into sync immediately.
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
where s.status in ('coverage_needed', 'open');