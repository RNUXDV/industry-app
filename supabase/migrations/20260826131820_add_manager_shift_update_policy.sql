create policy "Managers can update workplace shifts"
on public.shifts
for update
to authenticated
using (
  public.is_manager_for_workplace(workplace_id)
)
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