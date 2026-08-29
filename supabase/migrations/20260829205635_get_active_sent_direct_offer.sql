create or replace function public.get_my_active_direct_shift_offer(
  target_shift_id uuid
)
returns table (
  offer_id uuid,
  recipient_profile_id uuid,
  recipient_name text,
  offer_status text
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    offer.id as offer_id,
    offer.recipient_profile_id,
    coalesce(profile.full_name, 'Coworker')::text as recipient_name,
    offer.status::text as offer_status
  from public.direct_shift_offers offer
  left join public.profiles profile
    on profile.id = offer.recipient_profile_id
  where offer.shift_id = target_shift_id
    and offer.sender_profile_id = auth.uid()
    and offer.status in ('pending', 'accepted')
  order by offer.created_at desc
  limit 1;
$$;

revoke all
on function public.get_my_active_direct_shift_offer(uuid)
from public;

grant execute
on function public.get_my_active_direct_shift_offer(uuid)
to authenticated;