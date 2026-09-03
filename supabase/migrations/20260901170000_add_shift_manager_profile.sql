alter table public.shifts
add column if not exists manager_profile_id uuid
references public.profiles(id)
on delete set null;

create index if not exists shifts_manager_profile_id_idx
on public.shifts(manager_profile_id);

alter policy "Managers can create workplace shifts"
on public.shifts
with check (
  public.is_manager_for_workplace(workplace_id)
  and manager_profile_id = auth.uid()
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