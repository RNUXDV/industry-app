begin;

create extension if not exists pgtap with schema extensions;
select no_plan();

select has_table('public', 'workplace_observers',
  'observer authorization is stored separately from workplace membership');
select has_table('public', 'pilot_audit_events',
  'a durable pilot audit ledger exists');
select has_table('public', 'pilot_audit_aggregates',
  'retention cleanup preserves aggregate counts');
select has_function('public', 'grant_pilot_observer', array['uuid', 'uuid'],
  'service operators have a narrowly scoped observer grant operation');
select has_function('public', 'revoke_pilot_observer', array['uuid', 'uuid'],
  'service operators have a narrowly scoped observer revoke operation');
select has_function('public', 'cleanup_eligible_pilot_audit', array['uuid'],
  'retention cleanup is a narrowly scoped operation');

select hasnt_column('public', 'pilot_audit_events', 'profile_id',
  'the audit ledger does not store raw participant profile ids');
select hasnt_column('public', 'pilot_audit_events', 'email',
  'the audit ledger does not store email addresses');
select hasnt_column('public', 'pilot_audit_events', 'shift_id',
  'the audit ledger does not store operational shift ids');
select hasnt_column('public', 'pilot_audit_events', 'notes',
  'the audit ledger does not store shift notes');

select ok(
  has_function_privilege('service_role', 'public.grant_pilot_observer(uuid,uuid)', 'EXECUTE')
    and has_function_privilege('service_role', 'public.revoke_pilot_observer(uuid,uuid)', 'EXECUTE')
    and not has_function_privilege('authenticated', 'public.grant_pilot_observer(uuid,uuid)', 'EXECUTE')
    and not has_function_privilege('authenticated', 'public.revoke_pilot_observer(uuid,uuid)', 'EXECUTE'),
  'observer grant and revoke are service-role-only'
);
select ok(
  has_function_privilege('service_role', 'public.configure_pilot_audit_retention(uuid,timestamp with time zone,integer)', 'EXECUTE')
    and has_function_privilege('service_role', 'public.cleanup_eligible_pilot_audit(uuid)', 'EXECUTE')
    and not has_function_privilege('authenticated', 'public.configure_pilot_audit_retention(uuid,timestamp with time zone,integer)', 'EXECUTE')
    and not has_function_privilege('authenticated', 'public.cleanup_eligible_pilot_audit(uuid)', 'EXECUTE'),
  'retention configuration and cleanup are service-role-only'
);
select ok(
  not has_table_privilege('authenticated', 'public.workplace_observers', 'SELECT')
    and not has_table_privilege('authenticated', 'public.workplace_observers', 'INSERT')
    and not has_table_privilege('authenticated', 'public.workplace_observers', 'UPDATE')
    and not has_table_privilege('authenticated', 'public.workplace_observers', 'DELETE')
    and not has_table_privilege('authenticated', 'public.pilot_audit_events', 'INSERT')
    and not has_table_privilege('authenticated', 'public.pilot_audit_events', 'UPDATE')
    and not has_table_privilege('authenticated', 'public.pilot_audit_events', 'DELETE')
    and not has_table_privilege('authenticated', 'public.workplace_participant_codes', 'SELECT')
    and not has_table_privilege('authenticated', 'public.workplace_shift_codes', 'SELECT'),
  'browser clients cannot read identity mappings or mutate observer authorization or audit records'
);

insert into auth.users (
  instance_id, id, aud, role, email, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_sso_user, is_anonymous
) values
  ('00000000-0000-0000-0000-000000000000',
   '93000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated',
   'observer-one@example.test', now(), '{"provider":"email","providers":["email"]}'::jsonb,
   '{"full_name":"Observer One"}'::jsonb, now(), now(), false, false),
  ('00000000-0000-0000-0000-000000000000',
   '93000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated',
   'participant-two@example.test', now(), '{"provider":"email","providers":["email"]}'::jsonb,
   '{"full_name":"Participant Two"}'::jsonb, now(), now(), false, false),
  ('00000000-0000-0000-0000-000000000000',
   '93000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated',
   'participant-three@example.test', now(), '{"provider":"email","providers":["email"]}'::jsonb,
   '{"full_name":"Pilot Participant"}'::jsonb, now(), now(), false, false),
  ('00000000-0000-0000-0000-000000000000',
   '93000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated',
   'participant-four@example.test', now(), '{"provider":"email","providers":["email"]}'::jsonb,
   '{"full_name":"Other Participant"}'::jsonb, now(), now(), false, false);

insert into public.workplaces (id, name, city, region, time_zone) values
  ('93000000-0000-4000-8000-000000000011', 'Observer Test One', 'Portland', 'OR', 'America/Los_Angeles'),
  ('93000000-0000-4000-8000-000000000012', 'Observer Test Two', 'Portland', 'OR', 'America/Los_Angeles');

insert into public.workplace_members (
  workplace_id, profile_id, role, membership_status
) values
  ('93000000-0000-4000-8000-000000000011', '93000000-0000-4000-8000-000000000003', 'Server', 'active'),
  ('93000000-0000-4000-8000-000000000011', '93000000-0000-4000-8000-000000000002', 'Server', 'active'),
  ('93000000-0000-4000-8000-000000000012', '93000000-0000-4000-8000-000000000004', 'Server', 'active');

select throws_ok(
  $$ select public.grant_pilot_observer(
       '93000000-0000-4000-8000-000000000011',
       '93000000-0000-4000-8000-000000000003'
     ) $$,
  '23514', 'Observer authorization must be separate from membership',
  'an active workplace member cannot also be its observer'
);

select lives_ok(
  $$ select public.grant_pilot_observer(
       '93000000-0000-4000-8000-000000000011',
       '93000000-0000-4000-8000-000000000001'
     ) $$,
  'service authorization can grant a separate observer'
);

select matches(
  (select observer_code from public.workplace_observers
    where workplace_id = '93000000-0000-4000-8000-000000000011'
      and observer_profile_id = '93000000-0000-4000-8000-000000000001'),
  '^O-[A-F0-9]{12}$',
  'observer labels are random opaque codes'
);
select matches(
  (select participant_code from public.workplace_participant_codes
    where workplace_id = '93000000-0000-4000-8000-000000000011'
      and profile_id = '93000000-0000-4000-8000-000000000003'),
  '^P-[A-F0-9]{12}$',
  'participant labels are random opaque workplace-scoped codes'
);
select isnt(
  (select participant_code from public.workplace_participant_codes
    where workplace_id = '93000000-0000-4000-8000-000000000011'
      and profile_id = '93000000-0000-4000-8000-000000000002'),
  (select participant_code from public.workplace_participant_codes
    where workplace_id = '93000000-0000-4000-8000-000000000011'
      and profile_id = '93000000-0000-4000-8000-000000000003'),
  'participant labels are unique within a workplace'
);

insert into public.pilot_invitations (
  id, workplace_id, email, role, token_hash, volunteer_confirmed_at,
  created_at, expires_at
) values (
  '93000000-0000-4000-8000-000000000021',
  '93000000-0000-4000-8000-000000000011',
  'private-observer-test@example.test', 'Server', repeat('a', 64), now(),
  now(), now() + interval '1 day'
);

insert into public.shifts (
  id, workplace_id, assigned_profile_id, role, starts_at, ends_at, status
) values (
  '93000000-0000-4000-8000-000000000031',
  '93000000-0000-4000-8000-000000000011',
  '93000000-0000-4000-8000-000000000003',
  'Server', now() + interval '3 days', now() + interval '3 days 6 hours', 'scheduled'
);

update public.shifts set status = 'coverage_needed', coverage_stage = 'open'
where id = '93000000-0000-4000-8000-000000000031';

insert into public.shift_interests (shift_id, profile_id, status)
values (
  '93000000-0000-4000-8000-000000000031',
  '93000000-0000-4000-8000-000000000002',
  'interested'
);
update public.shift_interests set status = 'selected'
where shift_id = '93000000-0000-4000-8000-000000000031'
  and profile_id = '93000000-0000-4000-8000-000000000002';

update public.shift_interests set status = 'withdrawn'
where shift_id = '93000000-0000-4000-8000-000000000031'
  and profile_id = '93000000-0000-4000-8000-000000000002';

update public.pilot_invitations set
  accepted_at = now(),
  accepted_profile_id = '93000000-0000-4000-8000-000000000003'
where id = '93000000-0000-4000-8000-000000000021';

insert into public.pilot_invitations (
  id, workplace_id, email, role, token_hash, volunteer_confirmed_at,
  created_at, expires_at
) values (
  '93000000-0000-4000-8000-000000000022',
  '93000000-0000-4000-8000-000000000011',
  'revoked-observer-test@example.test', 'Server', repeat('b', 64), now(),
  now(), now() + interval '1 day'
);
update public.pilot_invitations set revoked_at = now()
where id = '93000000-0000-4000-8000-000000000022';

insert into public.pilot_invitations (
  id, workplace_id, email, role, token_hash, volunteer_confirmed_at,
  created_at, expires_at
) values (
  '93000000-0000-4000-8000-000000000023',
  '93000000-0000-4000-8000-000000000011',
  'revoked-observer-test@example.test', 'Server', repeat('c', 64), now(),
  now(), now() + interval '1 day'
);

insert into public.shifts (
  id, workplace_id, assigned_profile_id, role, starts_at, ends_at, status
) values
  ('93000000-0000-4000-8000-000000000032',
   '93000000-0000-4000-8000-000000000011',
   '93000000-0000-4000-8000-000000000003',
   'Server', now() + interval '4 days', now() + interval '4 days 6 hours', 'scheduled'),
  ('93000000-0000-4000-8000-000000000033',
   '93000000-0000-4000-8000-000000000011',
   '93000000-0000-4000-8000-000000000003',
   'Server', now() + interval '5 days', now() + interval '5 days 6 hours', 'scheduled'),
  ('93000000-0000-4000-8000-000000000034',
   '93000000-0000-4000-8000-000000000011',
   '93000000-0000-4000-8000-000000000003',
   'Server', now() + interval '6 days', now() + interval '6 days 6 hours', 'scheduled'),
  ('93000000-0000-4000-8000-000000000035',
   '93000000-0000-4000-8000-000000000011',
   '93000000-0000-4000-8000-000000000003',
   'Server', now() + interval '7 days', now() + interval '7 days 6 hours', 'scheduled');

update public.shifts set role = 'Bartender'
where id = '93000000-0000-4000-8000-000000000032';
update public.shifts set assigned_profile_id = '93000000-0000-4000-8000-000000000002'
where id = '93000000-0000-4000-8000-000000000032';
update public.shifts set status = 'cancelled'
where id = '93000000-0000-4000-8000-000000000032';

insert into public.direct_shift_offers (
  id, shift_id, workplace_id, sender_profile_id, recipient_profile_id, status
) values
  ('93000000-0000-4000-8000-000000000041',
   '93000000-0000-4000-8000-000000000033',
   '93000000-0000-4000-8000-000000000011',
   '93000000-0000-4000-8000-000000000003',
   '93000000-0000-4000-8000-000000000002', 'pending'),
  ('93000000-0000-4000-8000-000000000042',
   '93000000-0000-4000-8000-000000000034',
   '93000000-0000-4000-8000-000000000011',
   '93000000-0000-4000-8000-000000000003',
   '93000000-0000-4000-8000-000000000002', 'pending'),
  ('93000000-0000-4000-8000-000000000043',
   '93000000-0000-4000-8000-000000000035',
   '93000000-0000-4000-8000-000000000011',
   '93000000-0000-4000-8000-000000000003',
   '93000000-0000-4000-8000-000000000002', 'pending');
update public.direct_shift_offers set status = 'accepted'
where id = '93000000-0000-4000-8000-000000000041';
update public.direct_shift_offers set status = 'approved'
where id = '93000000-0000-4000-8000-000000000041';
update public.direct_shift_offers set status = 'declined'
where id = '93000000-0000-4000-8000-000000000042';
update public.direct_shift_offers set status = 'canceled'
where id = '93000000-0000-4000-8000-000000000043';

insert into public.coverage_events (
  shift_id, workplace_id, event_type, previous_profile_id, new_profile_id
) values
  ('93000000-0000-4000-8000-000000000033',
   '93000000-0000-4000-8000-000000000011', 'coverage_confirmed',
   '93000000-0000-4000-8000-000000000003',
   '93000000-0000-4000-8000-000000000002'),
  ('93000000-0000-4000-8000-000000000034',
   '93000000-0000-4000-8000-000000000011', 'coverage_canceled',
   '93000000-0000-4000-8000-000000000003', null);

update public.workplace_members set
  membership_status = 'inactive', deactivated_at = now(),
  deactivated_by = '93000000-0000-4000-8000-000000000002',
  deactivation_reason = 'voluntary'
where workplace_id = '93000000-0000-4000-8000-000000000011'
  and profile_id = '93000000-0000-4000-8000-000000000002';
update public.workplace_members set
  membership_status = 'inactive', deactivated_at = now(),
  deactivated_by = '93000000-0000-4000-8000-000000000004',
  deactivation_reason = 'manager_removed'
where workplace_id = '93000000-0000-4000-8000-000000000012'
  and profile_id = '93000000-0000-4000-8000-000000000004';

select ok(
  (select count(*) from public.pilot_audit_events
    where workplace_id = '93000000-0000-4000-8000-000000000011'
      and event_type = 'invitation_created') >= 2
  and (select count(*) from public.pilot_audit_events
    where workplace_id = '93000000-0000-4000-8000-000000000011'
      and event_type = 'invitation_replaced') = 1
  and (select count(*) from public.pilot_audit_events
    where workplace_id = '93000000-0000-4000-8000-000000000011'
      and event_type = 'shift_created') = 5
  and (select count(*) from public.pilot_audit_events
    where workplace_id = '93000000-0000-4000-8000-000000000011'
      and event_type = 'shift_released') = 1
  and (select count(*) from public.pilot_audit_events
    where workplace_id = '93000000-0000-4000-8000-000000000011'
      and event_type = 'interest_expressed') = 1
  and (select count(*) from public.pilot_audit_events
    where workplace_id = '93000000-0000-4000-8000-000000000011'
      and event_type = 'candidate_selected') = 1,
  'trusted triggers record invitation creation/replacement, shift, release, interest, and selection lifecycles'
);
select ok(
  not exists (
    select required.event_type
    from unnest(array[
      'invitation_accepted', 'invitation_revoked',
      'participant_left', 'participant_removed',
      'shift_updated', 'shift_reassigned', 'shift_cancelled',
      'interest_withdrawn', 'coverage_approved', 'coverage_cancelled',
      'direct_offer_sent', 'direct_offer_accepted',
      'direct_offer_declined', 'direct_offer_approved',
      'direct_offer_cancelled',
      'observer_granted'
    ]) as required(event_type)
    where not exists (
      select 1 from public.pilot_audit_events as event
      where event.workplace_id in (
          '93000000-0000-4000-8000-000000000011',
          '93000000-0000-4000-8000-000000000012'
        )
        and event.event_type = required.event_type
    )
  ),
  'trusted triggers cover invitation, membership, shift, coverage, offer, and observer lifecycles'
);

select lives_ok(
  $$ select public.append_pilot_audit_event(
       '93000000-0000-4000-8000-000000000011', 'shift_updated', 'info',
       null, null,
       jsonb_build_object(
         'status', 'scheduled',
         'email', 'must-not-survive@example.test',
         'notes', '<script>must-not-survive</script>',
         'source', 'test'
       )
     ) $$,
  'the internal audit writer accepts only allowlisted metadata'
);
select is(
  (select metadata from public.pilot_audit_events
    where workplace_id = '93000000-0000-4000-8000-000000000011'
      and event_type = 'shift_updated' and outcome = 'info'
    order by occurred_at desc limit 1),
  '{"source":"test","status":"scheduled"}'::jsonb,
  'audit metadata retains only constrained operational values'
);
select ok(
  not exists (
    select 1 from public.pilot_audit_events
    where workplace_id = '93000000-0000-4000-8000-000000000011'
      and (
        metadata::text ilike '%example.test%'
        or metadata::text ilike '%script%'
        or actor_code ilike '%observer one%'
        or subject_code ilike '%pilot participant%'
      )
  ),
  'audit records contain no email, name, notes, or markup payload'
);

select throws_ok(
  $$ update public.pilot_audit_events set outcome = 'blocked'
     where workplace_id = '93000000-0000-4000-8000-000000000011' $$,
  '42501', 'Pilot audit records are append-only',
  'audit records cannot be edited after creation'
);
select throws_ok(
  $$ delete from public.pilot_audit_events
     where workplace_id = '93000000-0000-4000-8000-000000000011' $$,
  '42501', 'Pilot audit records are append-only',
  'audit records cannot be deleted outside retention cleanup'
);
select set_config('industry.audit_retention_operation', 'allowed', true);
select throws_ok(
  $$ update public.pilot_audit_events set outcome = 'blocked'
     where workplace_id = '93000000-0000-4000-8000-000000000011' $$,
  '42501', 'Pilot audit records are append-only',
  'the internal cleanup flag alone cannot authorize audit updates'
);
select throws_ok(
  $$ delete from public.pilot_audit_events
     where workplace_id = '93000000-0000-4000-8000-000000000011' $$,
  '42501', 'Pilot audit records are append-only',
  'the internal cleanup flag alone cannot authorize audit deletes'
);
select set_config('industry.audit_retention_operation', 'off', true);
select throws_ok(
  $$ select public.configure_pilot_audit_retention(
       '93000000-0000-4000-8000-000000000011', now(), 90
     ) $$,
  '42501', 'Pilot audit records are append-only',
  'an ordinary privileged context cannot invoke the cleanup exemption'
);
select is(
  (select count(*)::integer from public.workplace_pilot_settings
    where workplace_id = '93000000-0000-4000-8000-000000000011'),
  0,
  'a rejected privileged retention attempt leaves no configuration behind'
);

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"93000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select set_config('request.jwt.claim.sub',
  '93000000-0000-4000-8000-000000000001', true);

select is((select count(*)::integer from public.list_my_observer_workplaces()), 1,
  'an observer sees only an active explicit observer authorization');
select lives_ok(
  $$ select public.get_pilot_monitor_summary('93000000-0000-4000-8000-000000000011') $$,
  'an active observer can read workplace summary counts'
);
select lives_ok(
  $$ select * from public.list_pilot_monitor_events(
       '93000000-0000-4000-8000-000000000011', null, null, null, 100
     ) $$,
  'an active observer can read privacy-safe workplace events'
);
select throws_ok(
  $$ insert into public.pilot_audit_events (
       workplace_id, event_type, outcome, actor_category
     ) values (
       '93000000-0000-4000-8000-000000000011',
       'shift_updated', 'success', 'observer'
     ) $$,
  '42501', null,
  'an observer cannot insert audit records directly'
);
select throws_ok(
  $$ update public.pilot_audit_events set outcome = 'blocked'
     where workplace_id = '93000000-0000-4000-8000-000000000011' $$,
  '42501', null,
  'an observer cannot update audit records directly'
);
select throws_ok(
  $$ delete from public.pilot_audit_events
     where workplace_id = '93000000-0000-4000-8000-000000000011' $$,
  '42501', null,
  'an observer cannot delete audit records directly'
);
select throws_ok(
  $$ select * from public.workplace_participant_codes $$,
  '42501', null,
  'an observer cannot query the participant identity mapping'
);
select is((select count(*)::integer from public.workplaces), 0,
  'observer authorization does not grant ordinary workplace-table access');
select throws_ok(
  $$ select public.create_workplace_invitation(
       'observer-cannot-invite@example.test', 'Server', true
     ) $$,
  '42501', 'Manager permission required',
  'an observer cannot use manager invitation controls'
);
select throws_ok(
  $$ insert into public.shifts (
       workplace_id, assigned_profile_id, role, starts_at, ends_at, status
     ) values (
       '93000000-0000-4000-8000-000000000011', null, 'Server',
       now() + interval '10 days', now() + interval '10 days 6 hours', 'open'
     ) $$,
  '42501', null,
  'an observer cannot create operational shift data'
);
select throws_ok(
  $$ select public.release_shift_for_coverage(
       '93000000-0000-4000-8000-000000000033'
     ) $$,
  '42501', 'You are not assigned to this shift',
  'an observer cannot invoke a worker coverage mutation'
);
select is(
  (select count(*)::integer from public.pilot_audit_events
    where workplace_id = '93000000-0000-4000-8000-000000000012'),
  0,
  'RLS does not reveal audit rows from another workplace'
);
select throws_ok(
  $$ select public.get_pilot_monitor_summary('93000000-0000-4000-8000-000000000012') $$,
  '42501', 'Observer authorization required',
  'summary RPC rejects cross-workplace observer access'
);
select throws_ok(
  $$ select * from public.list_pilot_monitor_events(
       '93000000-0000-4000-8000-000000000012', null, null, null, 100
     ) $$,
  '42501', 'Observer authorization required',
  'event RPC rejects cross-workplace observer access'
);
select throws_ok(
  $$ insert into public.workplace_observers (
       workplace_id, observer_profile_id, observer_code
     ) values (
       '93000000-0000-4000-8000-000000000012',
       '93000000-0000-4000-8000-000000000001', 'O-AAAAAAAAAAAA'
     ) $$,
  '42501', null,
  'an observer cannot self-enroll in another workplace'
);
select throws_ok(
  $$ select public.configure_pilot_audit_retention(
       '93000000-0000-4000-8000-000000000011', now(), 90
     ) $$,
  '42501', null,
  'an observer cannot configure retention'
);
reset role;
select set_config('request.jwt.claims', '{}', true);
select set_config('request.jwt.claim.sub', '', true);

update public.workplace_members
set role = 'Manager'
where workplace_id = '93000000-0000-4000-8000-000000000011'
  and profile_id = '93000000-0000-4000-8000-000000000003';
update public.workplace_members
set membership_status = 'active', deactivated_at = null,
  deactivated_by = null, deactivation_reason = null
where workplace_id = '93000000-0000-4000-8000-000000000011'
  and profile_id = '93000000-0000-4000-8000-000000000002';

-- Managers can read only their workplace's privacy-safe ledger. Workers do
-- not receive broad audit access merely by being active members.
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"93000000-0000-4000-8000-000000000003","role":"authenticated"}', true);
select set_config('request.jwt.claim.sub',
  '93000000-0000-4000-8000-000000000003', true);
select ok(
  (select count(*) from public.pilot_audit_events
    where workplace_id = '93000000-0000-4000-8000-000000000011') > 0,
  'an active Manager can read the privacy-safe audit ledger for their workplace'
);
select is(
  (select count(*)::integer from public.pilot_audit_events
    where workplace_id = '93000000-0000-4000-8000-000000000012'),
  0,
  'a Manager cannot read another workplace audit ledger'
);
reset role;
select set_config('request.jwt.claims', '{}', true);
select set_config('request.jwt.claim.sub', '', true);

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"93000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
select set_config('request.jwt.claim.sub',
  '93000000-0000-4000-8000-000000000002', true);
select is((select count(*)::integer from public.pilot_audit_events), 0,
  'an active worker receives no broad audit access');
reset role;
select set_config('request.jwt.claims', '{}', true);
select set_config('request.jwt.claim.sub', '', true);

select lives_ok(
  $$ delete from public.shifts
     where id = '93000000-0000-4000-8000-000000000031' $$,
  'an operational shift can be deleted without deleting its audit history'
);
select ok(
  not exists (select 1 from public.shifts
    where id = '93000000-0000-4000-8000-000000000031')
  and exists (select 1 from public.pilot_audit_events
    where workplace_id = '93000000-0000-4000-8000-000000000011'
      and event_type = 'shift_deleted'
      and object_code ~ '^S-[A-F0-9]{12}$'),
  'the random shift label and audit event survive operational shift deletion'
);

select is(
  public.revoke_pilot_observer(
    '93000000-0000-4000-8000-000000000011',
    '93000000-0000-4000-8000-000000000001'
  ), true,
  'service authorization can revoke an observer'
);
select is(
  (select count(*)::integer from public.pilot_audit_events
    where workplace_id = '93000000-0000-4000-8000-000000000011'
      and event_type = 'observer_revoked'),
  1,
  'observer revocation creates a durable privacy-safe audit event'
);

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"93000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select set_config('request.jwt.claim.sub',
  '93000000-0000-4000-8000-000000000001', true);
select is((select count(*)::integer from public.list_my_observer_workplaces()), 0,
  'revoked observer authorization disappears immediately');
select is((select count(*)::integer from public.pilot_audit_events), 0,
  'revoked observers immediately lose direct audit access');
select throws_ok(
  $$ select public.get_pilot_monitor_summary('93000000-0000-4000-8000-000000000011') $$,
  '42501', 'Observer authorization required',
  'revoked observers immediately lose summary RPC access'
);
reset role;
select set_config('request.jwt.claims', '{}', true);
select set_config('request.jwt.claim.sub', '', true);

set local role service_role;
select set_config('request.jwt.claims', '{"role":"service_role"}', true);
select set_config('request.jwt.claim.role', 'service_role', true);
select lives_ok(
  $$ select public.configure_pilot_audit_retention(
       '93000000-0000-4000-8000-000000000011', now() + interval '1 day', 90
     ) $$,
  'service authorization can configure a future pilot end'
);
select throws_ok(
  $$ select public.cleanup_eligible_pilot_audit(
       '93000000-0000-4000-8000-000000000011'
     ) $$,
  '55000', 'Pilot audit retention period has not elapsed',
  'retention cleanup cannot run before pilot end plus 90 days'
);

select lives_ok(
  $$ select public.configure_pilot_audit_retention(
       '93000000-0000-4000-8000-000000000011', now() - interval '91 days', 90
     ) $$,
  'the test can configure an already elapsed local-only retention boundary'
);
select ok(
  public.cleanup_eligible_pilot_audit(
    '93000000-0000-4000-8000-000000000011'
  ) > 0,
  'eligible event-level records are removed only by service cleanup'
);
reset role;
select set_config('request.jwt.claims', '{}', true);
select set_config('request.jwt.claim.role', '', true);

select is(
  (select count(*)::integer from public.pilot_audit_events
    where workplace_id = '93000000-0000-4000-8000-000000000011'),
  0,
  'eligible event-level participant and shift code linkage is removed'
);
select ok(
  not exists (
    select 1 from public.workplace_participant_codes
    where workplace_id = '93000000-0000-4000-8000-000000000011'
  ) and not exists (
    select 1 from public.workplace_shift_codes
    where workplace_id = '93000000-0000-4000-8000-000000000011'
  ),
  'eligible cleanup removes the underlying participant and shift code mappings'
);
select ok(
  (select coalesce(sum(event_count), 0) from public.pilot_audit_aggregates
    where workplace_id = '93000000-0000-4000-8000-000000000011') > 0,
  'aggregate operational counts survive retention cleanup'
);

select * from finish();
rollback;
