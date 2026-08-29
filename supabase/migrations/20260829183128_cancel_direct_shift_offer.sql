create or replace function public.cancel_direct_shift_offer(
  target_offer_id uuid
)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_sender uuid := auth.uid();
  v_offer public.direct_shift_offers%rowtype;
begin
  if v_sender is null then
    raise exception 'Authentication required';
  end if;

  select *
  into v_offer
  from public.direct_shift_offers
  where id = target_offer_id
  for update;

  if not found then
    raise exception 'Direct offer not found';
  end if;

  if v_offer.sender_profile_id <> v_sender then
    raise exception 'Only the sender can cancel this direct offer';
  end if;

  if v_offer.status <> 'pending' then
    raise exception 'Only a pending direct offer can be canceled';
  end if;

  update public.direct_shift_offers
  set
    status = 'canceled',
    updated_at = now()
  where id = target_offer_id;

  insert into public.coverage_events (
    shift_id,
    workplace_id,
    event_type,
    previous_profile_id,
    new_profile_id
  )
  values (
    v_offer.shift_id,
    v_offer.workplace_id,
    'direct_offer_canceled',
    v_offer.sender_profile_id,
    v_offer.recipient_profile_id
  );

  return 'canceled';
end;
$$;

revoke all
on function public.cancel_direct_shift_offer(uuid)
from public;

grant execute
on function public.cancel_direct_shift_offer(uuid)
to authenticated;