begin;

create extension if not exists pgtap with schema extensions;

select plan(40);

select is(
  (
    select count(*)::integer
    from pg_policies
    where schemaname = 'public'
      and tablename = 'shifts'
      and policyname = 'Workers can update their assigned shifts'
  ),
  0,
  'the broad worker shift-update policy is removed'
);

select is(
  (
    select count(*)::integer
    from pg_policies
    where schemaname = 'public'
      and tablename = 'shift_interests'
      and policyname = 'workers can create initial shift interest'
  ),
  1,
  'the initial-interest insert policy exists'
);

insert into public.workplaces (
  id,
  name,
  city,
  region,
  time_zone,
  created_by
)
values (
  '90000000-0000-4000-8000-0000000000b1',
  'Test Workplace B',
  'Portland',
  'OR',
  'America/Los_Angeles',
  '4d842c8d-31d5-46d8-a628-b84ff4022210'
);

insert into public.workplace_members (workplace_id, profile_id, role)
values (
  '90000000-0000-4000-8000-0000000000b1',
  'ecb9476f-b075-4b54-96f9-a0073d82d96e',
  'Server'
);

insert into public.shifts (
  id,
  workplace_id,
  assigned_profile_id,
  manager_profile_id,
  role,
  starts_at,
  ends_at,
  status,
  coverage_stage,
  actual_started_at,
  actual_ended_at
)
values
  ('90000000-0000-4000-8000-000000000001', '61c73d13-6c59-4031-a512-b38c570921b1', '79e3858d-923d-473a-b1ad-b2965c32231d', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() + interval '2 days', now() + interval '2 days 8 hours', 'scheduled', null, null, null),
  ('90000000-0000-4000-8000-000000000002', '61c73d13-6c59-4031-a512-b38c570921b1', '79e3858d-923d-473a-b1ad-b2965c32231d', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() + interval '2 days', now() + interval '2 days 8 hours', 'completed', null, now() - interval '9 hours', now() - interval '1 hour'),
  ('90000000-0000-4000-8000-000000000003', '61c73d13-6c59-4031-a512-b38c570921b1', '79e3858d-923d-473a-b1ad-b2965c32231d', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() - interval '2 days', now() - interval '1 day', 'scheduled', null, null, null),
  ('90000000-0000-4000-8000-000000000004', '61c73d13-6c59-4031-a512-b38c570921b1', '79e3858d-923d-473a-b1ad-b2965c32231d', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() + interval '2 days', now() + interval '2 days 8 hours', 'coverage_needed', 'open', null, null),
  ('90000000-0000-4000-8000-000000000005', '61c73d13-6c59-4031-a512-b38c570921b1', '79e3858d-923d-473a-b1ad-b2965c32231d', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() + interval '2 days', now() + interval '2 days 8 hours', 'open', 'open', null, null),
  ('90000000-0000-4000-8000-000000000006', '61c73d13-6c59-4031-a512-b38c570921b1', '3de89e73-85a9-43d2-a76c-599c90ae1634', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() + interval '2 days', now() + interval '2 days 8 hours', 'scheduled', null, null, null),
  ('90000000-0000-4000-8000-000000000007', '61c73d13-6c59-4031-a512-b38c570921b1', '79e3858d-923d-473a-b1ad-b2965c32231d', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() + interval '2 days', now() + interval '2 days 8 hours', 'scheduled', null, now(), null),
  ('90000000-0000-4000-8000-000000000008', '61c73d13-6c59-4031-a512-b38c570921b1', '3de89e73-85a9-43d2-a76c-599c90ae1634', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() + interval '3 days', now() + interval '3 days 8 hours', 'coverage_needed', 'open', null, null),
  ('90000000-0000-4000-8000-000000000009', '61c73d13-6c59-4031-a512-b38c570921b1', '79e3858d-923d-473a-b1ad-b2965c32231d', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() + interval '3 days', now() + interval '3 days 8 hours', 'coverage_needed', 'open', null, null),
  ('90000000-0000-4000-8000-000000000010', '61c73d13-6c59-4031-a512-b38c570921b1', null, '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() + interval '4 days', now() + interval '4 days 8 hours', 'open', 'open', null, null),
  ('90000000-0000-4000-8000-000000000011', '90000000-0000-4000-8000-0000000000b1', 'ecb9476f-b075-4b54-96f9-a0073d82d96e', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() + interval '4 days', now() + interval '4 days 8 hours', 'coverage_needed', 'open', null, null),
  ('90000000-0000-4000-8000-000000000012', '61c73d13-6c59-4031-a512-b38c570921b1', '79e3858d-923d-473a-b1ad-b2965c32231d', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() - interval '1 hour', now() + interval '7 hours', 'scheduled', null, null, null),
  ('90000000-0000-4000-8000-000000000013', '61c73d13-6c59-4031-a512-b38c570921b1', '3de89e73-85a9-43d2-a76c-599c90ae1634', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() - interval '1 hour', now() + interval '7 hours', 'scheduled', null, null, null),
  ('90000000-0000-4000-8000-000000000014', '61c73d13-6c59-4031-a512-b38c570921b1', '79e3858d-923d-473a-b1ad-b2965c32231d', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() - interval '1 hour', now() + interval '7 hours', 'scheduled', null, null, null),
  ('90000000-0000-4000-8000-000000000015', '61c73d13-6c59-4031-a512-b38c570921b1', '79e3858d-923d-473a-b1ad-b2965c32231d', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() - interval '8 hours', now() + interval '1 hour', 'scheduled', null, now() - interval '8 hours', null),
  ('90000000-0000-4000-8000-000000000016', '61c73d13-6c59-4031-a512-b38c570921b1', '3de89e73-85a9-43d2-a76c-599c90ae1634', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() - interval '8 hours', now() + interval '1 hour', 'scheduled', null, now() - interval '8 hours', null),
  ('90000000-0000-4000-8000-000000000017', '61c73d13-6c59-4031-a512-b38c570921b1', '79e3858d-923d-473a-b1ad-b2965c32231d', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() - interval '1 hour', now() + interval '7 hours', 'scheduled', null, now() - interval '1 hour', null),
  ('90000000-0000-4000-8000-000000000018', '61c73d13-6c59-4031-a512-b38c570921b1', '3de89e73-85a9-43d2-a76c-599c90ae1634', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() + interval '5 days', now() + interval '5 days 8 hours', 'coverage_needed', 'interest', null, null),
  ('90000000-0000-4000-8000-000000000019', '61c73d13-6c59-4031-a512-b38c570921b1', '3de89e73-85a9-43d2-a76c-599c90ae1634', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() + interval '5 days', now() + interval '5 days 8 hours', 'coverage_needed', 'selected', null, null),
  ('90000000-0000-4000-8000-000000000020', '61c73d13-6c59-4031-a512-b38c570921b1', 'ecb9476f-b075-4b54-96f9-a0073d82d96e', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() + interval '5 days', now() + interval '5 days 8 hours', 'coverage_needed', 'interest', null, null),
  ('90000000-0000-4000-8000-000000000021', '61c73d13-6c59-4031-a512-b38c570921b1', '79e3858d-923d-473a-b1ad-b2965c32231d', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() + interval '6 days', now() + interval '6 days 8 hours', 'coverage_needed', 'interest', null, null),
  ('90000000-0000-4000-8000-000000000022', '61c73d13-6c59-4031-a512-b38c570921b1', '3de89e73-85a9-43d2-a76c-599c90ae1634', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() + interval '6 days', now() + interval '6 days 8 hours', 'coverage_needed', 'open', null, null),
  ('90000000-0000-4000-8000-000000000023', '61c73d13-6c59-4031-a512-b38c570921b1', '79e3858d-923d-473a-b1ad-b2965c32231d', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() + interval '6 days', now() + interval '6 days 8 hours', 'coverage_needed', 'selected', null, null),
  ('90000000-0000-4000-8000-000000000024', '61c73d13-6c59-4031-a512-b38c570921b1', '79e3858d-923d-473a-b1ad-b2965c32231d', '4d842c8d-31d5-46d8-a628-b84ff4022210', 'Server', now() + interval '6 days', now() + interval '6 days 8 hours', 'scheduled', null, null, null);

insert into public.shift_interests (shift_id, profile_id, status)
values
  ('90000000-0000-4000-8000-000000000018', '79e3858d-923d-473a-b1ad-b2965c32231d', 'interested'),
  ('90000000-0000-4000-8000-000000000019', '79e3858d-923d-473a-b1ad-b2965c32231d', 'selected'),
  ('90000000-0000-4000-8000-000000000020', '3de89e73-85a9-43d2-a76c-599c90ae1634', 'interested'),
  ('90000000-0000-4000-8000-000000000021', 'ecb9476f-b075-4b54-96f9-a0073d82d96e', 'interested'),
  ('90000000-0000-4000-8000-000000000023', 'ecb9476f-b075-4b54-96f9-a0073d82d96e', 'selected');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"79e3858d-923d-473a-b1ad-b2965c32231d","role":"authenticated"}', true);
select set_config('request.jwt.claim.sub', '79e3858d-923d-473a-b1ad-b2965c32231d', true);

update public.shifts
set role = 'Owner', status = 'cancelled', assigned_profile_id = 'ecb9476f-b075-4b54-96f9-a0073d82d96e'
where id = '90000000-0000-4000-8000-000000000001';

reset role;

select is(
  (select jsonb_build_object('role', role, 'status', status, 'assigned_profile_id', assigned_profile_id) from public.shifts where id = '90000000-0000-4000-8000-000000000001'),
  jsonb_build_object('role', 'Server', 'status', 'scheduled', 'assigned_profile_id', '79e3858d-923d-473a-b1ad-b2965c32231d'::uuid),
  'a worker cannot directly change protected shift fields'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"4d842c8d-31d5-46d8-a628-b84ff4022210","role":"authenticated"}', true);
select set_config('request.jwt.claim.sub', '4d842c8d-31d5-46d8-a628-b84ff4022210', true);
update public.shifts set role = 'Lead Server' where id = '90000000-0000-4000-8000-000000000006';
reset role;

select is((select role from public.shifts where id = '90000000-0000-4000-8000-000000000006'), 'Lead Server', 'a workplace manager retains direct shift-management access');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"79e3858d-923d-473a-b1ad-b2965c32231d","role":"authenticated"}', true);
select set_config('request.jwt.claim.sub', '79e3858d-923d-473a-b1ad-b2965c32231d', true);

select lives_ok($$ select public.release_shift_for_coverage('90000000-0000-4000-8000-000000000001') $$, 'an owner can release an eligible future shift');
reset role;
select is((select status from public.shifts where id = '90000000-0000-4000-8000-000000000001'), 'coverage_needed', 'a valid release transitions the shift to coverage needed');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"79e3858d-923d-473a-b1ad-b2965c32231d","role":"authenticated"}', true);
select set_config('request.jwt.claim.sub', '79e3858d-923d-473a-b1ad-b2965c32231d', true);

select throws_ok($$ select public.release_shift_for_coverage('90000000-0000-4000-8000-000000000002') $$, '22023', 'Completed shifts cannot be released', 'a completed shift cannot be released');
select throws_ok($$ select public.release_shift_for_coverage('90000000-0000-4000-8000-000000000003') $$, '22023', 'Past shifts cannot be released', 'a past shift cannot be released');
select throws_ok($$ select public.release_shift_for_coverage('90000000-0000-4000-8000-000000000004') $$, '22023', 'This shift has already been released', 'an already-released shift cannot be released again');
select throws_ok($$ select public.release_shift_for_coverage('90000000-0000-4000-8000-000000000005') $$, '22023', 'Only scheduled shifts can be released', 'a non-scheduled shift cannot be released');
select throws_ok($$ select public.release_shift_for_coverage('90000000-0000-4000-8000-000000000006') $$, '42501', 'You are not assigned to this shift', 'a non-owner cannot release a shift');
select throws_ok($$ select public.release_shift_for_coverage('90000000-0000-4000-8000-000000000007') $$, '22023', 'Started shifts cannot be released', 'a started shift cannot be released');

select throws_ok($$ insert into public.shift_interests (shift_id, profile_id, status) values ('90000000-0000-4000-8000-000000000008', '79e3858d-923d-473a-b1ad-b2965c32231d', 'selected') $$, '42501', 'new row violates row-level security policy for table "shift_interests"', 'workers cannot create selected interests');
select throws_ok($$ insert into public.shift_interests (shift_id, profile_id, status) values ('90000000-0000-4000-8000-000000000008', '79e3858d-923d-473a-b1ad-b2965c32231d', 'confirmed') $$, '42501', 'new row violates row-level security policy for table "shift_interests"', 'workers cannot create confirmed interests');
select throws_ok($$ insert into public.shift_interests (shift_id, profile_id, status) values ('90000000-0000-4000-8000-000000000011', '79e3858d-923d-473a-b1ad-b2965c32231d', 'interested') $$, '42501', 'new row violates row-level security policy for table "shift_interests"', 'workers cannot express interest across workplaces');
select throws_ok($$ insert into public.shift_interests (shift_id, profile_id, status) values ('90000000-0000-4000-8000-000000000009', '79e3858d-923d-473a-b1ad-b2965c32231d', 'interested') $$, '42501', 'new row violates row-level security policy for table "shift_interests"', 'workers cannot express interest in their own shift');
select lives_ok($$ insert into public.shift_interests (shift_id, profile_id, status) values ('90000000-0000-4000-8000-000000000008', '79e3858d-923d-473a-b1ad-b2965c32231d', 'interested') $$, 'a same-workplace worker can express interest in another worker coverage shift');

reset role;
select is((select status from public.shift_interests where shift_id = '90000000-0000-4000-8000-000000000008' and profile_id = '79e3858d-923d-473a-b1ad-b2965c32231d'), 'interested', 'coverage interest begins at exactly interested');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"79e3858d-923d-473a-b1ad-b2965c32231d","role":"authenticated"}', true);
select set_config('request.jwt.claim.sub', '79e3858d-923d-473a-b1ad-b2965c32231d', true);
select lives_ok($$ insert into public.shift_interests (shift_id, profile_id) values ('90000000-0000-4000-8000-000000000010', '79e3858d-923d-473a-b1ad-b2965c32231d') $$, 'a same-workplace worker can express interest in an unassigned open shift');
reset role;
select is((select status from public.shift_interests where shift_id = '90000000-0000-4000-8000-000000000010' and profile_id = '79e3858d-923d-473a-b1ad-b2965c32231d'), 'interested', 'open-shift interest begins at exactly interested');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"79e3858d-923d-473a-b1ad-b2965c32231d","role":"authenticated"}', true);
select set_config('request.jwt.claim.sub', '79e3858d-923d-473a-b1ad-b2965c32231d', true);

select lives_ok($$ select public.report_assigned_shift_start('90000000-0000-4000-8000-000000000012', now() - interval '30 minutes') $$, 'the assigned worker can report a valid shift start');
reset role;
select is((select actual_started_at is not null from public.shifts where id = '90000000-0000-4000-8000-000000000012'), true, 'a valid start records the actual start time');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"79e3858d-923d-473a-b1ad-b2965c32231d","role":"authenticated"}', true);
select set_config('request.jwt.claim.sub', '79e3858d-923d-473a-b1ad-b2965c32231d', true);
select throws_ok($$ select public.report_assigned_shift_start('90000000-0000-4000-8000-000000000012', now()) $$, 'P0001', 'Shift not found, already started, ended, or not authorized', 'a shift cannot be started twice');
select throws_ok($$ select public.report_assigned_shift_start('90000000-0000-4000-8000-000000000013', now()) $$, 'P0001', 'Shift not found, already started, ended, or not authorized', 'a non-owner cannot report a shift start');
select throws_ok($$ select public.report_assigned_shift_start('90000000-0000-4000-8000-000000000014', now() + interval '1 minute') $$, 'P0001', 'Clock-in time cannot be in the future', 'a future clock-in time is rejected');

select lives_ok($$ select public.report_assigned_shift_end('90000000-0000-4000-8000-000000000015', now()) $$, 'the assigned worker can report a valid shift end');
reset role;
select is((select actual_ended_at is not null from public.shifts where id = '90000000-0000-4000-8000-000000000015'), true, 'a valid end records the actual end time');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"79e3858d-923d-473a-b1ad-b2965c32231d","role":"authenticated"}', true);
select set_config('request.jwt.claim.sub', '79e3858d-923d-473a-b1ad-b2965c32231d', true);
select throws_ok($$ select public.report_assigned_shift_end('90000000-0000-4000-8000-000000000015', now()) $$, 'P0001', 'Shift not found, already ended, or not authorized', 'a shift cannot be ended twice');
select throws_ok($$ select public.report_assigned_shift_end('90000000-0000-4000-8000-000000000016', now()) $$, 'P0001', 'Shift not found, already ended, or not authorized', 'a non-owner cannot report a shift end');
select throws_ok($$ select public.report_assigned_shift_end('90000000-0000-4000-8000-000000000017', now() - interval '2 hours') $$, 'P0001', 'End time cannot be before the shift starts', 'an end before the shift start is rejected');

select lives_ok($$ select public.withdraw_shift_interest('90000000-0000-4000-8000-000000000018') $$, 'a worker can withdraw their own interested response');
reset role;
select is((select count(*)::integer from public.shift_interests where shift_id = '90000000-0000-4000-8000-000000000018' and profile_id = '79e3858d-923d-473a-b1ad-b2965c32231d'), 0, 'withdrawing removes the worker interest');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"79e3858d-923d-473a-b1ad-b2965c32231d","role":"authenticated"}', true);
select set_config('request.jwt.claim.sub', '79e3858d-923d-473a-b1ad-b2965c32231d', true);
select throws_ok($$ select public.withdraw_shift_interest('90000000-0000-4000-8000-000000000019') $$, '22023', 'Only an interested shift request can be withdrawn', 'a selected interest cannot be withdrawn by the worker');
select throws_ok($$ select public.withdraw_shift_interest('90000000-0000-4000-8000-000000000020') $$, 'P0002', 'No shift interest found', 'a worker cannot withdraw another participant interest');

select lives_ok($$ select public.cancel_coverage_request('90000000-0000-4000-8000-000000000021') $$, 'an owner can cancel an unselected coverage request');
reset role;
select is((select status from public.shifts where id = '90000000-0000-4000-8000-000000000021'), 'scheduled', 'canceling coverage restores scheduled status');
select is((select count(*)::integer from public.shift_interests where shift_id = '90000000-0000-4000-8000-000000000021'), 0, 'canceling coverage removes pending interests');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"79e3858d-923d-473a-b1ad-b2965c32231d","role":"authenticated"}', true);
select set_config('request.jwt.claim.sub', '79e3858d-923d-473a-b1ad-b2965c32231d', true);
select throws_ok($$ select public.cancel_coverage_request('90000000-0000-4000-8000-000000000022') $$, '42501', 'You are not assigned to this shift', 'a non-owner cannot cancel coverage');
select throws_ok($$ select public.cancel_coverage_request('90000000-0000-4000-8000-000000000023') $$, '22023', 'Coverage cannot be canceled after a worker has been selected', 'coverage cannot be canceled after worker selection');
select throws_ok($$ select public.cancel_coverage_request('90000000-0000-4000-8000-000000000024') $$, '22023', 'This shift does not have an active coverage request', 'an inactive coverage request cannot be canceled');

reset role;
select * from finish();
rollback;
