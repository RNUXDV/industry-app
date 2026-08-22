create or replace function public.is_manager_for_workplace(
  target_workplace_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $function$
  select exists (
    select 1
    from public.workplace_members
    where workplace_id = target_workplace_id
      and profile_id = auth.uid()
      and lower(role) = 'manager'
  );
$function$;

revoke execute on function public.is_manager_for_workplace(uuid) from public;
revoke execute on function public.is_manager_for_workplace(uuid) from anon;
grant execute on function public.is_manager_for_workplace(uuid) to authenticated;

create policy "Managers can view workplace members"
on public.workplace_members
for select
to authenticated
using (
  public.is_manager_for_workplace(workplace_id)
);