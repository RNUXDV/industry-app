-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

SET check_function_bodies = false;

CREATE FUNCTION public.confirm_shift_coverage (
  target_shift_id     uuid,
  selected_profile_id uuid
)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
declare
  target_workplace_id uuid;
begin
  -- Find the workplace for this shift.
  select workplace_id
  into target_workplace_id
  from public.shifts
  where id = target_shift_id;

  if target_workplace_id is null then
    raise exception 'Shift not found';
  end if;

  -- Only a manager at this workplace may approve coverage.
  if not exists (
    select 1
    from public.workplace_members
    where workplace_id = target_workplace_id
      and profile_id = auth.uid()
      and lower(role) = 'manager'
  ) then
    raise exception 'Not authorized to approve this shift';
  end if;

  -- The worker must actually be the selected candidate.
  if not exists (
    select 1
    from public.shift_interests
    where shift_id = target_shift_id
      and profile_id = selected_profile_id
      and status = 'selected'
  ) then
    raise exception 'Selected shift interest not found';
  end if;

  -- Confirm the worker.
  update public.shift_interests
  set status = 'confirmed'
  where shift_id = target_shift_id
    and profile_id = selected_profile_id
    and status = 'selected';

  -- Transfer the shift.
  update public.shifts
  set
    assigned_profile_id = selected_profile_id,
    status = 'scheduled'
  where id = target_shift_id;
end;
$function$;

REVOKE EXECUTE ON FUNCTION public.confirm_shift_coverage(uuid, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.confirm_shift_coverage(uuid, uuid) FROM anon;

GRANT EXECUTE ON FUNCTION public.confirm_shift_coverage(uuid, uuid)
TO authenticated;

CREATE FUNCTION public.is_manager_for_shift (
  target_shift_id uuid
)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
  select exists (
    select 1
    from public.shifts s
    join public.workplace_members wm
      on wm.workplace_id = s.workplace_id
    where s.id = target_shift_id
      and wm.profile_id = auth.uid()
      and lower(wm.role) = 'manager'
  );
$function$;

REVOKE EXECUTE ON FUNCTION public.is_manager_for_shift(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_manager_for_shift(uuid) FROM anon;

GRANT EXECUTE ON FUNCTION public.is_manager_for_shift(uuid)
TO authenticated;
CREATE FUNCTION public.is_same_workplace (
  other_profile_id uuid
)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
  select exists (
    select 1
    from public.workplace_members me
    join public.workplace_members coworker
      on coworker.workplace_id = me.workplace_id
    where me.profile_id = auth.uid()
      and coworker.profile_id = other_profile_id
  );
$function$;

REVOKE EXECUTE ON FUNCTION public.is_same_workplace(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_same_workplace(uuid) FROM anon;

GRANT EXECUTE ON FUNCTION public.is_same_workplace(uuid)
TO authenticated;

CREATE POLICY "workplace members can view coworker profiles" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (((id = auth.uid()) OR public.is_same_workplace(id)));

CREATE TABLE public.shift_interests (
  id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
  shift_id   uuid                     NOT NULL,
  profile_id uuid                     NOT NULL,
  status     text                     DEFAULT 'interested'::text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.shift_interests
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.shift_interests
  ADD CONSTRAINT shift_interests_pkey PRIMARY KEY (id);

ALTER TABLE public.shift_interests
  ADD CONSTRAINT shift_interests_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.shift_interests
  ADD CONSTRAINT shift_interests_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES public.shifts(id) ON DELETE CASCADE;

ALTER TABLE public.shift_interests
  ADD CONSTRAINT shift_interests_shift_id_profile_id_key UNIQUE (shift_id, profile_id);

ALTER TABLE public.shift_interests
  ADD CONSTRAINT shift_interests_status_check CHECK (status = ANY (ARRAY['interested'::text, 'selected'::text, 'confirmed'::text, 'declined'::text, 'withdrawn'::text]));

REVOKE ALL ON TABLE public.shift_interests FROM anon;

GRANT SELECT, INSERT, UPDATE
ON TABLE public.shift_interests
TO authenticated;

GRANT ALL
ON TABLE public.shift_interests
TO service_role;
CREATE POLICY "managers can view workplace shift interests" ON public.shift_interests
  FOR SELECT
  TO authenticated
  USING (public.is_manager_for_shift(shift_id));

CREATE POLICY "participants can view shift interests" ON public.shift_interests
  FOR SELECT
  TO authenticated
  USING (((profile_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.shifts s
  WHERE ((s.id = shift_interests.shift_id) AND (s.assigned_profile_id = auth.uid()))))));

CREATE POLICY "shift owners can update shift interests" ON public.shift_interests
  FOR UPDATE
  TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM public.shifts
  WHERE ((shifts.id = shift_interests.shift_id) AND (shifts.assigned_profile_id = auth.uid())))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.shifts
  WHERE ((shifts.id = shift_interests.shift_id) AND (shifts.assigned_profile_id = auth.uid())))));

CREATE POLICY "shift owners can view shift interests" ON public.shift_interests
  FOR SELECT
  TO authenticated
  USING (((profile_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.shifts
  WHERE ((shifts.id = shift_interests.shift_id) AND (shifts.assigned_profile_id = auth.uid()))))));

CREATE POLICY "workers can create their own shift interest" ON public.shift_interests
  FOR INSERT
  TO authenticated
  WITH CHECK (((profile_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM (public.shifts s
     JOIN public.workplace_members wm ON ((wm.workplace_id = s.workplace_id)))
  WHERE ((s.id = shift_interests.shift_id) AND (wm.profile_id = auth.uid()) AND (s.status = 'coverage_needed'::text) AND (s.assigned_profile_id <> auth.uid()))))));

GRANT UPDATE ON public.shifts TO authenticated;

CREATE POLICY "Workers can update their assigned shifts" ON public.shifts
  FOR UPDATE
  TO authenticated
  USING ((assigned_profile_id = auth.uid()))
  WITH CHECK ((assigned_profile_id = auth.uid()));

CREATE POLICY "workplace members can view coverage shifts" ON public.shifts
  FOR SELECT
  TO authenticated
  USING (((status = 'coverage_needed'::text) AND (EXISTS ( SELECT 1
   FROM public.workplace_members wm
  WHERE ((wm.workplace_id = shifts.workplace_id) AND (wm.profile_id = auth.uid()))))));