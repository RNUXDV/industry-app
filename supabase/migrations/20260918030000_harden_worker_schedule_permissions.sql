-- Pilot security gate: worker schedule changes must use the narrowly scoped
-- SECURITY DEFINER functions already provided for release, cancellation,
-- clock-in, clock-out, and interest withdrawal.
drop policy if exists "Workers can update their assigned shifts"
on public.shifts;

-- A worker may express initial interest only. Selection and confirmation are
-- privileged transitions handled by their existing guarded database functions.
drop policy if exists "workers can create their own shift interest"
on public.shift_interests;

create policy "workers can create initial shift interest"
on public.shift_interests
for insert
to authenticated
with check (
  profile_id = auth.uid()
  and status = 'interested'
  and exists (
    select 1
    from public.shifts s
    join public.workplace_members wm
      on wm.workplace_id = s.workplace_id
    where s.id = shift_interests.shift_id
      and wm.profile_id = auth.uid()
      and s.status = 'coverage_needed'
      and s.assigned_profile_id <> auth.uid()
  )
);

comment on policy "workers can create initial shift interest"
on public.shift_interests is
  'Workers may create only their own initial interested record; privileged transitions use guarded functions.';
