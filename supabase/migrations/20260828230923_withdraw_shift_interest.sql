create or replace function public.withdraw_shift_interest(
  p_shift_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_interest public.shift_interests%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Authentication required'
      using errcode = '42501';
  end if;

  select *
  into current_interest
  from public.shift_interests
  where shift_id = p_shift_id
    and profile_id = auth.uid()
  for update;

  if not found then
    raise exception 'No shift interest found'
      using errcode = 'P0002';
  end if;

  if current_interest.status <> 'interested' then
    raise exception 'Only an interested shift request can be withdrawn'
      using errcode = '22023';
  end if;

  delete from public.shift_interests
  where id = current_interest.id;
end;
$$;

revoke all
on function public.withdraw_shift_interest(uuid)
from public;

grant execute
on function public.withdraw_shift_interest(uuid)
to authenticated;