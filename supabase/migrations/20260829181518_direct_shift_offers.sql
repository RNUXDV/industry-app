create table public.direct_shift_offers (
  id uuid primary key default gen_random_uuid(),

  shift_id uuid not null
    references public.shifts(id)
    on delete cascade,

  workplace_id uuid not null,

  sender_profile_id uuid not null
    references public.profiles(id),

  recipient_profile_id uuid not null
    references public.profiles(id),

  status text not null default 'pending'
    check (
      status in (
        'pending',
        'accepted',
        'declined',
        'canceled',
        'approved'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  responded_at timestamptz,
  approved_at timestamptz,

  constraint direct_shift_offer_not_to_self
    check (sender_profile_id <> recipient_profile_id)
);

create index direct_shift_offers_shift_idx
  on public.direct_shift_offers(shift_id);

create index direct_shift_offers_recipient_idx
  on public.direct_shift_offers(recipient_profile_id);

create index direct_shift_offers_workplace_idx
  on public.direct_shift_offers(workplace_id);

create unique index direct_shift_offers_one_active_per_shift
  on public.direct_shift_offers(shift_id)
  where status in ('pending', 'accepted');

alter table public.direct_shift_offers
enable row level security;


-- =========================================================
-- SEND DIRECT OFFER
-- =========================================================

create or replace function public.send_direct_shift_offer(
  target_shift_id uuid,
  target_recipient_profile_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_sender uuid := auth.uid();
  v_workplace_id uuid;
  v_offer_id uuid;
begin
  if v_sender is null then
    raise exception 'Authentication required';
  end if;

  if target_recipient_profile_id = v_sender then
    raise exception 'Cannot send a shift offer to yourself';
  end if;

  select workplace_id
  into v_workplace_id
  from public.shifts
  where id = target_shift_id
    and assigned_profile_id = v_sender
    and status = 'scheduled'
  for update;

  if v_workplace_id is null then
    raise exception 'Shift not found or unavailable for direct offer';
  end if;

  if not exists (
    select 1
    from public.workplace_members
    where workplace_id = v_workplace_id
      and profile_id = target_recipient_profile_id
  ) then
    raise exception 'Recipient is not a member of this workplace';
  end if;

  if exists (
    select 1
    from public.direct_shift_offers
    where shift_id = target_shift_id
      and status in ('pending', 'accepted')
  ) then
    raise exception 'This shift already has an active direct offer';
  end if;

  insert into public.direct_shift_offers (
    shift_id,
    workplace_id,
    sender_profile_id,
    recipient_profile_id,
    status
  )
  values (
    target_shift_id,
    v_workplace_id,
    v_sender,
    target_recipient_profile_id,
    'pending'
  )
  returning id into v_offer_id;

  insert into public.coverage_events (
    shift_id,
    workplace_id,
    event_type,
    previous_profile_id,
    new_profile_id
  )
  values (
    target_shift_id,
    v_workplace_id,
    'direct_offer_sent',
    v_sender,
    target_recipient_profile_id
  );

  return v_offer_id;
end;
$$;

revoke all
on function public.send_direct_shift_offer(uuid, uuid)
from public;

grant execute
on function public.send_direct_shift_offer(uuid, uuid)
to authenticated;


-- =========================================================
-- RECIPIENT: LIST MY DIRECT OFFERS
-- =========================================================

create or replace function public.list_my_direct_shift_offers()
returns table (
  offer_id uuid,
  shift_id uuid,
  sender_profile_id uuid,
  sender_name text,
  offer_status text,
  created_at timestamptz,
  shift_data jsonb
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select
    offer.id as offer_id,
    offer.shift_id,
    offer.sender_profile_id,
    coalesce(profile.full_name, 'Coworker')::text as sender_name,
    offer.status::text as offer_status,
    offer.created_at,
    to_jsonb(shift_row) as shift_data
  from public.direct_shift_offers offer
  join public.shifts shift_row
    on shift_row.id = offer.shift_id
  left join public.profiles profile
    on profile.id = offer.sender_profile_id
  where offer.recipient_profile_id = auth.uid()
    and offer.status in ('pending', 'accepted')
  order by offer.created_at desc;
$$;

revoke all
on function public.list_my_direct_shift_offers()
from public;

grant execute
on function public.list_my_direct_shift_offers()
to authenticated;


-- =========================================================
-- RECIPIENT: ACCEPT / DECLINE
-- =========================================================

create or replace function public.respond_to_direct_shift_offer(
  target_offer_id uuid,
  response_action text
)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_offer public.direct_shift_offers%rowtype;
  v_new_status text;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if response_action not in ('accept', 'decline') then
    raise exception 'Response must be accept or decline';
  end if;

  select *
  into v_offer
  from public.direct_shift_offers
  where id = target_offer_id
  for update;

  if not found then
    raise exception 'Direct offer not found';
  end if;

  if v_offer.recipient_profile_id <> v_user_id then
    raise exception 'You are not the recipient of this offer';
  end if;

  if v_offer.status <> 'pending' then
    raise exception 'This offer is no longer pending';
  end if;

  v_new_status :=
    case
      when response_action = 'accept' then 'accepted'
      else 'declined'
    end;

  update public.direct_shift_offers
  set
    status = v_new_status,
    responded_at = now(),
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
    case
      when response_action = 'accept'
        then 'direct_offer_accepted'
      else 'direct_offer_declined'
    end,
    v_offer.sender_profile_id,
    v_offer.recipient_profile_id
  );

  return v_new_status;
end;
$$;

revoke all
on function public.respond_to_direct_shift_offer(uuid, text)
from public;

grant execute
on function public.respond_to_direct_shift_offer(uuid, text)
to authenticated;


-- =========================================================
-- MANAGER: LIST ACCEPTED OFFERS AWAITING APPROVAL
-- =========================================================

create or replace function public.list_direct_offer_approvals()
returns table (
  offer_id uuid,
  shift_id uuid,
  sender_profile_id uuid,
  sender_name text,
  recipient_profile_id uuid,
  recipient_name text,
  offer_status text,
  created_at timestamptz,
  responded_at timestamptz,
  shift_data jsonb
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select
    offer.id,
    offer.shift_id,
    offer.sender_profile_id,
    coalesce(sender.full_name, 'Coworker')::text,
    offer.recipient_profile_id,
    coalesce(recipient.full_name, 'Coworker')::text,
    offer.status::text,
    offer.created_at,
    offer.responded_at,
    to_jsonb(shift_row)
  from public.direct_shift_offers offer
  join public.shifts shift_row
    on shift_row.id = offer.shift_id
  left join public.profiles sender
    on sender.id = offer.sender_profile_id
  left join public.profiles recipient
    on recipient.id = offer.recipient_profile_id
  where offer.status = 'accepted'
    and exists (
      select 1
      from public.workplace_members manager_membership
      where manager_membership.profile_id = auth.uid()
        and manager_membership.workplace_id = offer.workplace_id
        and lower(manager_membership.role::text) = 'manager'
    )
  order by offer.responded_at desc nulls last;
$$;

revoke all
on function public.list_direct_offer_approvals()
from public;

grant execute
on function public.list_direct_offer_approvals()
to authenticated;


-- =========================================================
-- MANAGER: APPROVE DIRECT OFFER
-- =========================================================

create or replace function public.approve_direct_shift_offer(
  target_offer_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_manager_id uuid := auth.uid();
  v_offer public.direct_shift_offers%rowtype;
begin
  if v_manager_id is null then
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

  if v_offer.status <> 'accepted' then
    raise exception 'Direct offer is not awaiting manager approval';
  end if;

  if not exists (
    select 1
    from public.workplace_members
    where profile_id = v_manager_id
      and workplace_id = v_offer.workplace_id
      and lower(role::text) = 'manager'
  ) then
    raise exception 'Manager permission required';
  end if;

  if not exists (
    select 1
    from public.workplace_members
    where profile_id = v_offer.recipient_profile_id
      and workplace_id = v_offer.workplace_id
  ) then
    raise exception 'Recipient is no longer a workplace member';
  end if;

  update public.shifts
  set
    assigned_profile_id = v_offer.recipient_profile_id,
    status = 'scheduled'
  where id = v_offer.shift_id
    and workplace_id = v_offer.workplace_id
    and assigned_profile_id = v_offer.sender_profile_id;

  if not found then
    raise exception 'Shift is no longer available for this transfer';
  end if;

  update public.direct_shift_offers
  set
    status = 'approved',
    approved_at = now(),
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
    'direct_offer_approved',
    v_offer.sender_profile_id,
    v_offer.recipient_profile_id
  );

  return v_offer.shift_id;
end;
$$;

revoke all
on function public.approve_direct_shift_offer(uuid)
from public;

grant execute
on function public.approve_direct_shift_offer(uuid)
to authenticated;