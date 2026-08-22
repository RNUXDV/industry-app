create policy "Managers can create workplace shifts"
on public.shifts
for insert
to authenticated
with check (
  public.is_manager_for_workplace(workplace_id)
  and (
    assigned_profile_id is null
    or exists (
      select 1
      from public.workplace_members wm
      where wm.workplace_id = shifts.workplace_id
        and wm.profile_id = shifts.assigned_profile_id
    )
  )
);