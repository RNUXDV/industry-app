begin;

create extension if not exists pgtap with schema extensions;
select no_plan();

select has_column('public', 'pilot_invitations', 'volunteer_confirmed_at',
  'invitations record manager volunteer confirmation');
select has_column('public', 'workplace_members', 'membership_status',
  'memberships have an active/inactive lifecycle');
select has_column('public', 'workplace_members', 'pilot_consented_at',
  'memberships record participant consent time');
select has_function('public', 'leave_pilot', array[]::text[],
  'workers have a narrowly scoped leave operation');
select has_function('public', 'remove_workplace_member', array['uuid'],
  'managers have a narrowly scoped removal operation');

insert into public.workplaces (id, name, city, region, time_zone, created_by)
values
  ('91000000-0000-4000-8000-000000000001', 'Pilot Test One', 'Portland', 'OR', 'America/Los_Angeles', '4d842c8d-31d5-46d8-a628-b84ff4022210'),
  ('91000000-0000-4000-8000-000000000002', 'Pilot Test Two', 'Portland', 'OR', 'America/Los_Angeles', '4d842c8d-31d5-46d8-a628-b84ff4022210');

insert into public.pilot_invitations (
  id, workplace_id, email, role, token_hash, invited_by,
  volunteer_confirmed_at, created_at, expires_at
) values
  ('91000000-0000-4000-8000-000000000011', '91000000-0000-4000-8000-000000000001', 'invited@example.com', 'Server', encode(extensions.digest(convert_to('active-token-0000000000000000000000000000', 'UTF8'), 'sha256'), 'hex'), '4d842c8d-31d5-46d8-a628-b84ff4022210', now(), now(), now() + interval '1 day'),
  ('91000000-0000-4000-8000-000000000012', '91000000-0000-4000-8000-000000000001', 'expired@example.com', 'Server', encode(extensions.digest(convert_to('expired-token-00000000000000000000000000', 'UTF8'), 'sha256'), 'hex'), '4d842c8d-31d5-46d8-a628-b84ff4022210', now() - interval '2 days', now() - interval '2 days', now() - interval '1 day'),
  ('91000000-0000-4000-8000-000000000013', '91000000-0000-4000-8000-000000000001', 'revoked@example.com', 'Server', encode(extensions.digest(convert_to('revoked-token-00000000000000000000000000', 'UTF8'), 'sha256'), 'hex'), '4d842c8d-31d5-46d8-a628-b84ff4022210', now(), now(), now() + interval '1 day'),
  ('91000000-0000-4000-8000-000000000014', '91000000-0000-4000-8000-000000000001', 'nomanagerconfirm@example.com', 'Server', encode(extensions.digest(convert_to('unconfirmed-token-00000000000000000000000', 'UTF8'), 'sha256'), 'hex'), '4d842c8d-31d5-46d8-a628-b84ff4022210', null, now(), now() + interval '1 day');

update public.pilot_invitations set revoked_at = now()
where id = '91000000-0000-4000-8000-000000000013';

select is(
  public.enforce_pilot_invitation_before_user_created(
    '{"user":{"email":" INVITED@EXAMPLE.COM ","user_metadata":{"pilot_consent_acknowledged":true,"pilot_consent_version":"pilot-privacy-v1"}}}'::jsonb
  ),
  '{}'::jsonb,
  'the Auth hook uses normalized exact-email matching for an active invitation'
);

select ok(
  public.enforce_pilot_invitation_before_user_created(
    '{"user":{"email":"uninvited@example.com","user_metadata":{"pilot_consent_acknowledged":true,"pilot_consent_version":"pilot-privacy-v1"}}}'::jsonb
  ) ? 'error',
  'the Auth hook rejects an uninvited email'
);
select ok(
  public.enforce_pilot_invitation_before_user_created(
    '{"user":{"email":"invited@example.com","user_metadata":{"pilot_consent_acknowledged":false,"pilot_consent_version":"pilot-privacy-v1"}}}'::jsonb
  ) ? 'error',
  'the Auth hook rejects missing participant consent'
);
select ok(
  public.enforce_pilot_invitation_before_user_created(
    '{"user":{"email":"expired@example.com","user_metadata":{"pilot_consent_acknowledged":true,"pilot_consent_version":"pilot-privacy-v1"}}}'::jsonb
  ) ? 'error',
  'the Auth hook rejects an expired invitation'
);
select ok(
  public.enforce_pilot_invitation_before_user_created(
    '{"user":{"email":"revoked@example.com","user_metadata":{"pilot_consent_acknowledged":true,"pilot_consent_version":"pilot-privacy-v1"}}}'::jsonb
  ) ? 'error',
  'the Auth hook rejects a revoked invitation'
);
select ok(
  public.enforce_pilot_invitation_before_user_created(
    '{"user":{"email":"nomanagerconfirm@example.com","user_metadata":{"pilot_consent_acknowledged":true,"pilot_consent_version":"pilot-privacy-v1"}}}'::jsonb
  ) ? 'error',
  'the Auth hook rejects an invitation without manager volunteer confirmation'
);

select ok(
  not has_function_privilege('authenticated', 'public.create_pilot_manager_invitation(uuid,text,boolean)', 'EXECUTE')
    and not has_function_privilege('anon', 'public.create_pilot_manager_invitation(uuid,text,boolean)', 'EXECUTE'),
  'browser users cannot create Manager invitations'
);
select ok(
  has_function_privilege('service_role', 'public.create_pilot_manager_invitation(uuid,text,boolean)', 'EXECUTE'),
  'Manager invitation creation remains service-only'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"4d842c8d-31d5-46d8-a628-b84ff4022210","role":"authenticated","email":"manager+c-local@example.com"}', true);
select set_config('request.jwt.claim.sub', '4d842c8d-31d5-46d8-a628-b84ff4022210', true);

select throws_ok(
  $$ select public.create_pilot_manager_invitation(
       '91000000-0000-4000-8000-000000000001',
       'browser-manager-attempt@example.com',
       true
     ) $$,
  '42501', null,
  'an authenticated browser cannot invoke service-only Manager invitation creation'
);
reset role;
select is(
  (select count(*)::integer from public.pilot_invitations
    where email = 'browser-manager-attempt@example.com'),
  0,
  'a denied browser Manager-invitation attempt creates no invitation row'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"4d842c8d-31d5-46d8-a628-b84ff4022210","role":"authenticated","email":"manager+c-local@example.com"}', true);
select set_config('request.jwt.claim.sub', '4d842c8d-31d5-46d8-a628-b84ff4022210', true);

select throws_ok(
  $$ select public.create_workplace_invitation('volunteer@example.com', 'Server', false) $$,
  '22023', 'Volunteer confirmation required',
  'a manager must confirm voluntary participation before inviting'
);
select throws_ok(
  $$ select public.create_workplace_invitation('volunteer@example.com', 'Manager', true) $$,
  '22023', 'Approved worker role required',
  'a browser manager cannot create a Manager invitation'
);
select lives_ok(
  $$ select public.create_workplace_invitation('  VOLUNTEER@EXAMPLE.COM ', 'server', true) $$,
  'an active manager can create a volunteer-confirmed worker invitation'
);
reset role;

select is(
  (select count(*)::integer from public.pilot_invitations
    where email = 'volunteer@example.com' and lower(role) = 'manager'),
  0,
  'the worker-invitation RPC cannot indirectly create a Manager invitation'
);
select is(
  (select email from public.pilot_invitations where email = 'volunteer@example.com' order by created_at desc limit 1),
  'volunteer@example.com',
  'worker invitation email is normalized'
);
select is(
  (select role from public.pilot_invitations where email = 'volunteer@example.com' order by created_at desc limit 1),
  'Server',
  'worker invitation role comes from the allowlist'
);
select throws_ok(
  $$ insert into public.pilot_invitations (
       workplace_id, email, role, token_hash, invited_by, volunteer_confirmed_at
     ) values (
       '61c73d13-6c59-4031-a512-b38c570921b1',
       'volunteer@example.com', 'Server',
       encode(extensions.digest(convert_to('concurrent-token-00000000000000000000000', 'UTF8'), 'sha256'), 'hex'),
       '4d842c8d-31d5-46d8-a628-b84ff4022210', now()
     ) $$,
  '23505',
  'duplicate key value violates unique constraint "pilot_invitations_one_unresolved_email_per_workplace_idx"',
  'only one unresolved invitation can exist for an email in a workplace'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"79e3858d-923d-473a-b1ad-b2965c32231d","role":"authenticated","email":"worker+b-local@example.com"}', true);
select set_config('request.jwt.claim.sub', '79e3858d-923d-473a-b1ad-b2965c32231d', true);
select throws_ok(
  $$ select public.create_workplace_invitation('other@example.com', 'Server', true) $$,
  '42501', 'Manager permission required',
  'a worker cannot create workplace invitations'
);
select throws_ok(
  $$ update public.workplace_members set role = 'Manager' where profile_id = '79e3858d-923d-473a-b1ad-b2965c32231d' $$,
  '42501', null,
  'a worker cannot self-promote by editing membership role'
);
reset role;
select is(
  (select role from public.workplace_members
    where workplace_id = '61c73d13-6c59-4031-a512-b38c570921b1'
      and profile_id = '79e3858d-923d-473a-b1ad-b2965c32231d'),
  'Server',
  'a denied self-promotion leaves the stored membership role unchanged'
);
select ok(
  not has_table_privilege('authenticated', 'public.workplace_members', 'INSERT')
    and not has_table_privilege('authenticated', 'public.workplace_members', 'UPDATE')
    and not has_table_privilege('authenticated', 'public.workplace_members', 'DELETE')
    and not has_any_column_privilege('authenticated', 'public.workplace_members', 'INSERT')
    and not has_any_column_privilege('authenticated', 'public.workplace_members', 'UPDATE'),
  'browser membership mutations are available only through approved RPCs'
);
select ok(
  not has_table_privilege('authenticated', 'public.pilot_invitations', 'INSERT')
    and not has_table_privilege('authenticated', 'public.pilot_invitations', 'UPDATE')
    and not has_table_privilege('authenticated', 'public.pilot_invitations', 'DELETE')
    and not has_any_column_privilege('authenticated', 'public.pilot_invitations', 'INSERT')
    and not has_any_column_privilege('authenticated', 'public.pilot_invitations', 'UPDATE'),
  'browser clients cannot directly mutate invitation authorization records'
);

-- Use an existing Auth identity with no active membership to verify that
-- invitation acceptance remains supported independently of new-user signup.
update public.workplace_members set
  membership_status = 'inactive',
  deactivated_at = now(),
  deactivated_by = profile_id,
  deactivation_reason = 'voluntary'
where profile_id = '3de89e73-85a9-43d2-a76c-599c90ae1634';

insert into public.pilot_invitations (
  workplace_id, email, role, token_hash, invited_by, volunteer_confirmed_at, expires_at
) values (
  '91000000-0000-4000-8000-000000000001',
  'robert+local@example.com',
  'Bartender',
  encode(extensions.digest(convert_to('existing-user-token-000000000000000000000', 'UTF8'), 'sha256'), 'hex'),
  '4d842c8d-31d5-46d8-a628-b84ff4022210',
  now(),
  now() + interval '1 day'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"3de89e73-85a9-43d2-a76c-599c90ae1634","role":"authenticated","email":"robert+local@example.com"}', true);
select set_config('request.jwt.claim.sub', '3de89e73-85a9-43d2-a76c-599c90ae1634', true);
select lives_ok(
  $$ select public.accept_pilot_invitation('existing-user-token-000000000000000000000', true, 'pilot-privacy-v1') $$,
  'an invited existing Auth user can accept with consent'
);
reset role;

select is(
  (select role from public.workplace_members where workplace_id = '91000000-0000-4000-8000-000000000001' and profile_id = '3de89e73-85a9-43d2-a76c-599c90ae1634'),
  'Bartender',
  'accepted worker authorization comes from the invitation'
);
select is(
  (select pilot_consent_version from public.workplace_members where workplace_id = '91000000-0000-4000-8000-000000000001' and profile_id = '3de89e73-85a9-43d2-a76c-599c90ae1634'),
  'pilot-privacy-v1',
  'acceptance records only the consent version and timestamp'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"3de89e73-85a9-43d2-a76c-599c90ae1634","role":"authenticated","email":"robert+local@example.com"}', true);
select set_config('request.jwt.claim.sub', '3de89e73-85a9-43d2-a76c-599c90ae1634', true);
select throws_ok(
  $$ select public.accept_pilot_invitation('existing-user-token-000000000000000000000', true, 'pilot-privacy-v1') $$,
  '22023', 'Invitation is not available',
  'an accepted invitation cannot be reused'
);
reset role;

insert into public.pilot_invitations (
  workplace_id, email, role, token_hash, invited_by, volunteer_confirmed_at, expires_at
) values (
  '91000000-0000-4000-8000-000000000002',
  'robert+local@example.com',
  'Server',
  encode(extensions.digest(convert_to('cross-workplace-token-0000000000000000000', 'UTF8'), 'sha256'), 'hex'),
  '4d842c8d-31d5-46d8-a628-b84ff4022210',
  now(),
  now() + interval '1 day'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"3de89e73-85a9-43d2-a76c-599c90ae1634","role":"authenticated","email":"robert+local@example.com"}', true);
select set_config('request.jwt.claim.sub', '3de89e73-85a9-43d2-a76c-599c90ae1634', true);
select throws_ok(
  $$ select public.accept_pilot_invitation('cross-workplace-token-0000000000000000000', true, 'pilot-privacy-v1') $$,
  '23505', 'Account already has an active workplace membership',
  'an account cannot accept a cross-workplace invitation while active elsewhere'
);
reset role;

select throws_ok(
  $$ insert into public.workplace_members (workplace_id, profile_id, role) values ('91000000-0000-4000-8000-000000000002', '3de89e73-85a9-43d2-a76c-599c90ae1634', 'Server') $$,
  '23505', 'duplicate key value violates unique constraint "workplace_members_one_active_workplace_per_profile_idx"',
  'the partial unique index enforces one active workplace per profile'
);

update public.workplace_members set
  membership_status = 'inactive', deactivated_at = now(),
  deactivated_by = profile_id, deactivation_reason = 'voluntary'
where profile_id = 'ecb9476f-b075-4b54-96f9-a0073d82d96e';
insert into public.pilot_invitations (
  workplace_id, email, role, token_hash, invited_by, volunteer_confirmed_at, expires_at
) values (
  '91000000-0000-4000-8000-000000000001',
  'worker+c-local@example.com',
  'Manager',
  encode(extensions.digest(convert_to('tampered-manager-token-000000000000000000', 'UTF8'), 'sha256'), 'hex'),
  '4d842c8d-31d5-46d8-a628-b84ff4022210',
  now(),
  now() + interval '1 day'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"ecb9476f-b075-4b54-96f9-a0073d82d96e","role":"authenticated","email":"worker+c-local@example.com"}', true);
select set_config('request.jwt.claim.sub', 'ecb9476f-b075-4b54-96f9-a0073d82d96e', true);
select throws_ok(
  $$ select public.accept_pilot_invitation('tampered-manager-token-000000000000000000', true, 'pilot-privacy-v1') $$,
  '42501', 'Manager invitations require service authorization',
  'a worker invitation cannot be tampered into Manager access'
);
reset role;

update public.workplace_members set
  membership_status = 'active', deactivated_at = null,
  deactivated_by = null, deactivation_reason = null
where workplace_id = '61c73d13-6c59-4031-a512-b38c570921b1'
  and profile_id = 'ecb9476f-b075-4b54-96f9-a0073d82d96e';

-- Lifecycle blockers and manager removal use only stable result codes.
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claims', '{}', true);
delete from public.direct_shift_offers
where sender_profile_id = 'ecb9476f-b075-4b54-96f9-a0073d82d96e'
   or recipient_profile_id = 'ecb9476f-b075-4b54-96f9-a0073d82d96e';
delete from public.shift_interests where profile_id = 'ecb9476f-b075-4b54-96f9-a0073d82d96e';
delete from public.shifts where assigned_profile_id = 'ecb9476f-b075-4b54-96f9-a0073d82d96e';

insert into public.shifts (
  id, workplace_id, assigned_profile_id, manager_profile_id, role,
  starts_at, ends_at, status
) values (
  '91000000-0000-4000-8000-000000000101',
  '61c73d13-6c59-4031-a512-b38c570921b1',
  'ecb9476f-b075-4b54-96f9-a0073d82d96e',
  '4d842c8d-31d5-46d8-a628-b84ff4022210',
  'Server', now() + interval '3 days', now() + interval '3 days 8 hours', 'scheduled'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"4d842c8d-31d5-46d8-a628-b84ff4022210","role":"authenticated","email":"manager+c-local@example.com"}', true);
select set_config('request.jwt.claim.sub', '4d842c8d-31d5-46d8-a628-b84ff4022210', true);
select is(
  (select reason from public.remove_workplace_member('ecb9476f-b075-4b54-96f9-a0073d82d96e')),
  'future_shift',
  'manager removal is blocked by an unresolved future shift'
);
reset role;

delete from public.shifts where id = '91000000-0000-4000-8000-000000000101';
insert into public.shifts (
  id, workplace_id, assigned_profile_id, manager_profile_id, role,
  starts_at, ends_at, status, coverage_stage
) values (
  '91000000-0000-4000-8000-000000000102',
  '61c73d13-6c59-4031-a512-b38c570921b1', null,
  '4d842c8d-31d5-46d8-a628-b84ff4022210',
  'Server', now() + interval '4 days', now() + interval '4 days 8 hours', 'open', 'open'
);
insert into public.shift_interests (shift_id, profile_id, status)
values ('91000000-0000-4000-8000-000000000102', 'ecb9476f-b075-4b54-96f9-a0073d82d96e', 'interested');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"4d842c8d-31d5-46d8-a628-b84ff4022210","role":"authenticated","email":"manager+c-local@example.com"}', true);
select set_config('request.jwt.claim.sub', '4d842c8d-31d5-46d8-a628-b84ff4022210', true);
select is(
  (select reason from public.remove_workplace_member('ecb9476f-b075-4b54-96f9-a0073d82d96e')),
  'shift_interest',
  'manager removal is blocked by unresolved shift interest'
);
reset role;

delete from public.shift_interests where shift_id = '91000000-0000-4000-8000-000000000102';
delete from public.shifts where id = '91000000-0000-4000-8000-000000000102';
insert into public.direct_shift_offers (
  shift_id, workplace_id, sender_profile_id, recipient_profile_id, status
)
select shift_row.id, shift_row.workplace_id,
  '79e3858d-923d-473a-b1ad-b2965c32231d',
  'ecb9476f-b075-4b54-96f9-a0073d82d96e', 'pending'
from public.shifts as shift_row
where shift_row.assigned_profile_id = '79e3858d-923d-473a-b1ad-b2965c32231d'
limit 1;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"4d842c8d-31d5-46d8-a628-b84ff4022210","role":"authenticated","email":"manager+c-local@example.com"}', true);
select set_config('request.jwt.claim.sub', '4d842c8d-31d5-46d8-a628-b84ff4022210', true);
select is(
  (select reason from public.remove_workplace_member('ecb9476f-b075-4b54-96f9-a0073d82d96e')),
  'direct_offer',
  'manager removal is blocked by an unresolved direct offer'
);
reset role;

delete from public.direct_shift_offers
where recipient_profile_id = 'ecb9476f-b075-4b54-96f9-a0073d82d96e';
insert into public.shifts (
  id, workplace_id, assigned_profile_id, manager_profile_id, role,
  starts_at, ends_at, status, coverage_stage
) values (
  '91000000-0000-4000-8000-000000000103',
  '61c73d13-6c59-4031-a512-b38c570921b1',
  'ecb9476f-b075-4b54-96f9-a0073d82d96e',
  '4d842c8d-31d5-46d8-a628-b84ff4022210',
  'Server', now() - interval '1 day', now() - interval '16 hours',
  'coverage_needed', 'open'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"4d842c8d-31d5-46d8-a628-b84ff4022210","role":"authenticated","email":"manager+c-local@example.com"}', true);
select set_config('request.jwt.claim.sub', '4d842c8d-31d5-46d8-a628-b84ff4022210', true);
select is(
  (select reason from public.remove_workplace_member('ecb9476f-b075-4b54-96f9-a0073d82d96e')),
  'coverage_responsibility',
  'manager removal is blocked by unresolved coverage responsibility'
);
reset role;

delete from public.shifts where id = '91000000-0000-4000-8000-000000000103';
insert into public.shifts (
  id, workplace_id, assigned_profile_id, manager_profile_id, role,
  starts_at, ends_at, status, actual_started_at
) values (
  '91000000-0000-4000-8000-000000000104',
  '61c73d13-6c59-4031-a512-b38c570921b1',
  'ecb9476f-b075-4b54-96f9-a0073d82d96e',
  '4d842c8d-31d5-46d8-a628-b84ff4022210',
  'Server', now() - interval '1 hour', now() + interval '7 hours',
  'scheduled', now() - interval '1 hour'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"4d842c8d-31d5-46d8-a628-b84ff4022210","role":"authenticated","email":"manager+c-local@example.com"}', true);
select set_config('request.jwt.claim.sub', '4d842c8d-31d5-46d8-a628-b84ff4022210', true);
select is(
  (select reason from public.remove_workplace_member('ecb9476f-b075-4b54-96f9-a0073d82d96e')),
  'active_shift',
  'manager removal is blocked during an active shift'
);
reset role;

delete from public.shifts where id = '91000000-0000-4000-8000-000000000104';

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"4d842c8d-31d5-46d8-a628-b84ff4022210","role":"authenticated","email":"manager+c-local@example.com"}', true);
select set_config('request.jwt.claim.sub', '4d842c8d-31d5-46d8-a628-b84ff4022210', true);
select is(
  (select outcome from public.remove_workplace_member('ecb9476f-b075-4b54-96f9-a0073d82d96e')),
  'deactivated',
  'an active manager can remove a participant with no unresolved responsibilities'
);
reset role;

select is(
  (select membership_status from public.workplace_members
    where workplace_id = '61c73d13-6c59-4031-a512-b38c570921b1'
      and profile_id = 'ecb9476f-b075-4b54-96f9-a0073d82d96e'),
  'inactive',
  'manager removal soft-deactivates rather than deleting membership history'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"ecb9476f-b075-4b54-96f9-a0073d82d96e","role":"authenticated","email":"worker+c-local@example.com"}', true);
select set_config('request.jwt.claim.sub', 'ecb9476f-b075-4b54-96f9-a0073d82d96e', true);
select is((select count(*)::integer from public.workplaces), 0,
  'an inactive member immediately loses workplace read access');
select is((select count(*)::integer from public.shifts), 0,
  'an inactive member immediately loses shift read access');
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"4d842c8d-31d5-46d8-a628-b84ff4022210","role":"authenticated","email":"manager+c-local@example.com"}', true);
select set_config('request.jwt.claim.sub', '4d842c8d-31d5-46d8-a628-b84ff4022210', true);
select is((select reason from public.leave_pilot()), 'last_manager',
  'the last active Manager cannot voluntarily leave');
reset role;

-- Clean Worker B responsibilities, then verify voluntary withdrawal.
delete from public.direct_shift_offers
where sender_profile_id = '79e3858d-923d-473a-b1ad-b2965c32231d'
   or recipient_profile_id = '79e3858d-923d-473a-b1ad-b2965c32231d';
delete from public.shift_interests where profile_id = '79e3858d-923d-473a-b1ad-b2965c32231d';
delete from public.shifts where assigned_profile_id = '79e3858d-923d-473a-b1ad-b2965c32231d';
insert into public.shifts (
  id, workplace_id, assigned_profile_id, manager_profile_id, role,
  starts_at, ends_at, status
) values (
  '91000000-0000-4000-8000-000000000105',
  '61c73d13-6c59-4031-a512-b38c570921b1',
  '79e3858d-923d-473a-b1ad-b2965c32231d',
  '4d842c8d-31d5-46d8-a628-b84ff4022210',
  'Server', now() - interval '2 days', now() - interval '1 day', 'scheduled'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"79e3858d-923d-473a-b1ad-b2965c32231d","role":"authenticated","email":"worker+b-local@example.com"}', true);
select set_config('request.jwt.claim.sub', '79e3858d-923d-473a-b1ad-b2965c32231d', true);
select is((select outcome from public.leave_pilot()), 'deactivated',
  'a worker can voluntarily leave after resolving responsibilities');
select throws_ok(
  $$ select public.report_assigned_shift_start('91000000-0000-4000-8000-000000000105', now() - interval '2 days') $$,
  '42501', 'Active workplace membership required',
  'approved worker RPCs reject authorization after membership deactivation'
);
reset role;

select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claims', '{}', true);
insert into public.shifts (
  id, workplace_id, assigned_profile_id, manager_profile_id, role,
  starts_at, ends_at, status
) values (
  '91000000-0000-4000-8000-000000000106',
  '61c73d13-6c59-4031-a512-b38c570921b1',
  '79e3858d-923d-473a-b1ad-b2965c32231d',
  '4d842c8d-31d5-46d8-a628-b84ff4022210',
  'Server', now() + interval '5 days', now() + interval '5 days 8 hours', 'scheduled'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"79e3858d-923d-473a-b1ad-b2965c32231d","role":"authenticated","email":"worker+b-local@example.com"}', true);
select set_config('request.jwt.claim.sub', '79e3858d-923d-473a-b1ad-b2965c32231d', true);
select throws_ok(
  $$ select public.release_shift_for_coverage('91000000-0000-4000-8000-000000000106') $$,
  '42501', 'Active workplace membership required',
  'inactive workers cannot use the future-shift release RPC'
);
select is((select count(*)::integer from public.get_direct_release_coworkers()), 0,
  'inactive workers cannot read coworkers through a SECURITY DEFINER RPC');
reset role;

select is(
  (select deactivation_reason from public.workplace_members
    where workplace_id = '61c73d13-6c59-4031-a512-b38c570921b1'
      and profile_id = '79e3858d-923d-473a-b1ad-b2965c32231d'),
  'voluntary',
  'voluntary withdrawal records lifecycle state without deleting history'
);

select * from finish();
rollback;
