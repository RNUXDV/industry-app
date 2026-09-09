-- Remove the superseded coworker lookup that remained in the hosted project
-- outside the reviewed migration history. Schedule uses
-- get_direct_release_coworkers() instead.
drop function if exists public.list_workplace_coworkers();
