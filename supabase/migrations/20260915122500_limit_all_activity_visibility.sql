drop policy if exists "members can view permitted coverage events"
on public.coverage_events;

create policy "participants and managers can view coverage events"
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
    coverage_events.previous_profile_id = auth.uid()
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

comment on policy "participants and managers can view coverage events"
on public.coverage_events is
  'Coverage Activity is limited to the previous worker, new worker, and workplace managers. Realtime shift and interest subscriptions keep the shared Catch board synchronized.';
