-- Allow authenticated workplace managers to view
-- every shift belonging to the workplace they manage.

create policy "Managers can view workplace shifts"
on public.shifts
for select
to authenticated
using (
  public.is_manager_for_shift(id)
);