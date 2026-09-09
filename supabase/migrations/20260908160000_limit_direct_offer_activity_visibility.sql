drop policy if exists "workplace members can view coverage events"
on public.coverage_events;

create policy "members can view permitted coverage events"
on public.coverage_events
for select
to authenticated
using (
  exists (
    select 1
    from public.workplace_members as membership
    where membership.workplace_id = coverage_events.workplace_id
      and membership.profile_id = auth.uid()
  )
  and (
    coverage_events.event_type not in (
      'direct_offer_sent',
      'direct_offer_accepted',
      'direct_offer_approved',
      'direct_offer_declined',
      'direct_offer_canceled'
    )
    or coverage_events.previous_profile_id = auth.uid()
    or coverage_events.new_profile_id = auth.uid()
    or exists (
      select 1
      from public.workplace_members as manager_membership
      where manager_membership.workplace_id = coverage_events.workplace_id
        and manager_membership.profile_id = auth.uid()
        and lower(manager_membership.role) = 'manager'
    )
  )
);

comment on policy "members can view permitted coverage events"
on public.coverage_events is
  'Workplace members can view general Schedule activity. Direct Send activity is limited to the sender, recipient, and workplace managers.';
