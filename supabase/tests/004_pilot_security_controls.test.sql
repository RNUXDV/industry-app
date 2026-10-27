-- Portable behavior and browser-maintenance-denial suite. Source and hosted-model candidates.
BEGIN;
SET LOCAL search_path=public,extensions,pg_temp;
SELECT no_plan();
CREATE TEMP TABLE ctx AS SELECT gen_random_uuid() AS manager,gen_random_uuid() AS foreign_user,gen_random_uuid() AS wa,gen_random_uuid() AS wb,gen_random_uuid() AS shift_id,encode(extensions.gen_random_bytes(32),'hex') AS token;
GRANT SELECT ON ctx TO authenticated;
INSERT INTO auth.users(id,email,raw_user_meta_data) SELECT manager,'synthetic-manager@example.invalid','{"full_name":"Synthetic Manager"}'::jsonb FROM ctx UNION ALL SELECT foreign_user,'synthetic-foreign@example.invalid','{"full_name":"Synthetic Foreign"}'::jsonb FROM ctx;
INSERT INTO workplaces(id,name,time_zone) SELECT wa,'Synthetic A','UTC' FROM ctx UNION ALL SELECT wb,'Synthetic B','UTC' FROM ctx;
INSERT INTO workplace_members(workplace_id,profile_id,role) SELECT wa,manager,'Manager' FROM ctx UNION ALL SELECT wb,foreign_user,'Manager' FROM ctx;
CREATE TEMP TABLE consent_ctx AS SELECT gen_random_uuid() AS id,gen_random_uuid() AS workplace,encode(extensions.gen_random_bytes(32),'hex') AS token;
GRANT SELECT ON consent_ctx TO authenticated;
INSERT INTO auth.users(id,email,raw_user_meta_data) SELECT id,'synthetic-consent@example.invalid','{"full_name":"Synthetic Consent"}' FROM consent_ctx;
INSERT INTO workplaces(id,name,time_zone) SELECT workplace,'Synthetic Consent','UTC' FROM consent_ctx;
INSERT INTO pilot_invitations(workplace_id,email,role,token_hash,volunteer_confirmed_at,expires_at) SELECT workplace,'synthetic-consent@example.invalid','Server',encode(extensions.digest(convert_to(token,'UTF8'),'sha256'),'hex'),now(),now()+interval '1 day' FROM consent_ctx;
ALTER TABLE ctx ADD COLUMN worker uuid DEFAULT gen_random_uuid(), ADD COLUMN observer_id uuid DEFAULT gen_random_uuid();
INSERT INTO auth.users(id,email,raw_user_meta_data) SELECT worker,'synthetic-worker@example.invalid','{}'::jsonb FROM ctx UNION ALL SELECT observer_id,'synthetic-observer@example.invalid','{}'::jsonb FROM ctx;
INSERT INTO workplace_members(workplace_id,profile_id,role) SELECT wa,worker,'Server' FROM ctx;
INSERT INTO workplace_observers(workplace_id,observer_profile_id,observer_code) SELECT wa,observer_id,'O-000000000001' FROM ctx;
-- Always roll back the RPC's writes inside a nested exception block. TAP counters
-- live outside that block and are not erased by test savepoint rollback.
CREATE FUNCTION pg_temp.consent_probe(version text,acknowledged boolean DEFAULT true) RETURNS text LANGUAGE plpgsql AS $$
DECLARE outcome text;
BEGIN
 BEGIN
  BEGIN
   PERFORM public.accept_pilot_invitation((SELECT token FROM pg_temp.consent_ctx),acknowledged,version);
   outcome:='accepted';
  EXCEPTION WHEN OTHERS THEN outcome:=SQLSTATE;
  END;
  RAISE EXCEPTION USING ERRCODE='Z0001',MESSAGE='rollback synthetic probe';
 EXCEPTION WHEN SQLSTATE 'Z0001' THEN NULL;
 END;
 RETURN outcome;
END $$;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub',(SELECT id::text FROM consent_ctx),true) IS NOT NULL AS claims_set \gset
SELECT set_config('request.jwt.claims',jsonb_build_object('sub',(SELECT id FROM consent_ctx),'role','authenticated','email','synthetic-consent@example.invalid')::text,true) IS NOT NULL AS claims_set \gset
SELECT is(pg_temp.consent_probe('pilot-privacy-v1',false),'22023','false consent acknowledgment rejected');
SELECT is(pg_temp.consent_probe('pilot-privacy-v1',NULL),'22023','NULL consent acknowledgment rejected');
SELECT is(pg_temp.consent_probe(NULL),'22023','NULL consent version is rejected');
SELECT is(pg_temp.consent_probe(''),'22023','empty consent version is rejected');
SELECT is(pg_temp.consent_probe('   '),'22023','whitespace consent version is rejected');
SELECT is(pg_temp.consent_probe('pilot-privacy-v1'),'accepted','valid consent version is accepted');
SELECT set_config('request.jwt.claim.sub',(SELECT manager::text FROM ctx),true) IS NOT NULL AS claims_set \gset
SELECT set_config('request.jwt.claims',jsonb_build_object('sub',(SELECT manager FROM ctx),'role','authenticated')::text,true) IS NOT NULL AS claims_set \gset
SELECT ok(is_active_workplace_member((SELECT wa FROM ctx)),'own workplace lookup succeeds');
SELECT ok(NOT is_active_workplace_member((SELECT wb FROM ctx),(SELECT foreign_user FROM ctx)),'foreign workplace membership is hidden by helper');
INSERT INTO shifts(id,workplace_id,manager_profile_id,starts_at,status) SELECT shift_id,wa,foreign_user,now()+interval '1 day','open' FROM ctx;
RESET ROLE;
SELECT is((SELECT manager_profile_id FROM shifts WHERE id=(SELECT shift_id FROM ctx)),(SELECT manager FROM ctx),'INSERT creator is forced to authenticated manager');
SET LOCAL ROLE authenticated;
SELECT throws_ok($q$UPDATE public.shifts SET manager_profile_id=NULL WHERE id=(SELECT shift_id FROM pg_temp.ctx)$q$,'42501','Shift creator attribution is immutable','UPDATE rejects creator change');
RESET ROLE;
SELECT ok((SELECT manager_profile_id IS NOT NULL FROM shifts WHERE id=(SELECT shift_id FROM ctx)),'UPDATE cannot clear creator attribution');
SELECT is((SELECT actor_code FROM pilot_audit_events WHERE event_type='shift_created' AND workplace_id=(SELECT wa FROM ctx)),(SELECT participant_code FROM workplace_participant_codes WHERE workplace_id=(SELECT wa FROM ctx) AND profile_id=(SELECT manager FROM ctx)),'audit actor remains the authenticated manager despite supplied creator');

SELECT lives_ok($q$UPDATE public.workplace_members SET pilot_consented_at=now(),pilot_consent_version=NULL WHERE profile_id=(SELECT worker FROM pg_temp.ctx)$q$,'legacy invalid consent fixture remains representable during stage 1');
SET LOCAL ROLE authenticated;
SELECT lives_ok($q$UPDATE public.shifts SET role='Synthetic edited role' WHERE id=(SELECT shift_id FROM pg_temp.ctx)$q$,'normal manager edit remains permitted');
SELECT set_config('request.jwt.claim.sub',(SELECT worker::text FROM ctx),true) IS NOT NULL AS claims_set \gset
SELECT ok(is_active_workplace_member((SELECT wa FROM ctx)),'worker own-workplace lookup works');
SELECT ok(is_active_workplace_member((SELECT wa FROM ctx),(SELECT manager FROM ctx)),'worker same-workplace target lookup remains compatible');
SELECT throws_ok($q$INSERT INTO public.shifts(workplace_id,starts_at,status) SELECT wa,now()+interval '2 days','open' FROM pg_temp.ctx$q$,'42501',NULL,'worker cannot create manager shift');
SELECT set_config('request.jwt.claim.sub',(SELECT foreign_user::text FROM ctx),true) IS NOT NULL AS claims_set \gset
SELECT throws_ok($q$INSERT INTO public.shifts(workplace_id,starts_at,status) SELECT wa,now()+interval '2 days','open' FROM pg_temp.ctx$q$,'42501',NULL,'foreign manager cannot create shift in A');
SELECT set_config('request.jwt.claim.sub',(SELECT observer_id::text FROM ctx),true) IS NOT NULL AS claims_set \gset
SELECT throws_ok($q$INSERT INTO public.shifts(workplace_id,starts_at,status) SELECT wa,now()+interval '2 days','open' FROM pg_temp.ctx$q$,'42501',NULL,'observer cannot create shifts');
RESET ROLE;
SET LOCAL ROLE anon;
SELECT throws_ok($q$SELECT public.is_active_workplace_member(NULL::uuid,NULL::uuid)$q$,'42501',NULL,'anonymous helper execution denied');
RESET ROLE;
SELECT set_config('request.jwt.claim.sub','',true) IS NOT NULL AS claims_set \gset
SELECT set_config('request.jwt.claims','{}',true) IS NOT NULL AS claims_set \gset
SELECT lives_ok($q$UPDATE public.shifts SET manager_profile_id=NULL WHERE id=(SELECT shift_id FROM pg_temp.ctx)$q$,'explicit local administrator maintenance can retain NULL creator');
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub',(SELECT manager::text FROM ctx),true) IS NOT NULL AS claims_set \gset
SELECT set_config('request.jwt.claims',jsonb_build_object('sub',(SELECT manager FROM ctx),'role','authenticated')::text,true) IS NOT NULL AS claims_set \gset
SELECT lives_ok($q$UPDATE public.shifts SET role='Legacy attribution preserved' WHERE id=(SELECT shift_id FROM pg_temp.ctx)$q$,'manager can edit existing NULL-creator row without backfill');
RESET ROLE;

-- Additional rollback-only compatibility probes appended to the 20-test fixture.
RESET ROLE;
ALTER TABLE ctx ADD COLUMN cover_shift uuid DEFAULT gen_random_uuid(), ADD COLUMN direct_shift uuid DEFAULT gen_random_uuid(), ADD COLUMN depart_shift uuid DEFAULT gen_random_uuid(), ADD COLUMN interest_id uuid DEFAULT gen_random_uuid(), ADD COLUMN recipient uuid DEFAULT gen_random_uuid(), ADD COLUMN departing uuid DEFAULT gen_random_uuid(), ADD COLUMN spare_profile uuid DEFAULT gen_random_uuid(), ADD COLUMN offer_id uuid;
GRANT UPDATE(offer_id) ON ctx TO authenticated;
INSERT INTO auth.users(id,email,raw_user_meta_data) SELECT recipient,'synthetic-recipient@example.invalid','{}'::jsonb FROM ctx UNION ALL SELECT departing,'synthetic-departing@example.invalid','{}'::jsonb FROM ctx UNION ALL SELECT spare_profile,'synthetic-spare@example.invalid','{}'::jsonb FROM ctx;
INSERT INTO workplace_members(workplace_id,profile_id,role) SELECT wa,recipient,'Server' FROM ctx UNION ALL SELECT wa,departing,'Server' FROM ctx;
UPDATE workplace_members SET pilot_consented_at=now(),pilot_consent_version=NULL WHERE profile_id=(SELECT departing FROM ctx);
SET LOCAL ROLE authenticated;
SELECT lives_ok($q$INSERT INTO public.shifts(id,workplace_id,assigned_profile_id,starts_at,status) SELECT v.id,c.wa,c.worker,now()+interval '5 days','scheduled' FROM pg_temp.ctx c CROSS JOIN LATERAL (VALUES(c.cover_shift),(c.direct_shift),(c.depart_shift)) v(id)$q$,'manager creates assigned shifts for active worker');
SELECT set_config('request.jwt.claim.sub',(SELECT worker::text FROM ctx),true) IS NOT NULL AS claims_set \gset
SELECT lives_ok($q$SELECT public.release_shift_for_coverage((SELECT cover_shift FROM pg_temp.ctx))$q$,'worker releases assigned shift');
SELECT set_config('request.jwt.claim.sub',(SELECT recipient::text FROM ctx),true) IS NOT NULL AS claims_set \gset
SELECT lives_ok($q$INSERT INTO public.shift_interests(id,shift_id,profile_id,status) SELECT interest_id,cover_shift,recipient,'interested' FROM pg_temp.ctx$q$,'same-workplace coworker expresses interest');
SELECT set_config('request.jwt.claim.sub',(SELECT manager::text FROM ctx),true) IS NOT NULL AS claims_set \gset
SELECT lives_ok($q$SELECT * FROM public.select_shift_interest((SELECT interest_id FROM pg_temp.ctx))$q$,'manager selects interested coworker');
SELECT lives_ok($q$SELECT public.confirm_shift_coverage((SELECT cover_shift FROM pg_temp.ctx),(SELECT recipient FROM pg_temp.ctx))$q$,'manager confirms coverage transfer');
RESET ROLE;
SELECT is((SELECT assigned_profile_id FROM shifts WHERE id=(SELECT cover_shift FROM ctx)),(SELECT recipient FROM ctx),'coverage transfers ownership');
SELECT is((SELECT manager_profile_id FROM shifts WHERE id=(SELECT cover_shift FROM ctx)),(SELECT manager FROM ctx),'coverage preserves original creator');
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub',(SELECT worker::text FROM ctx),true) IS NOT NULL AS claims_set \gset
SELECT lives_ok($q$UPDATE pg_temp.ctx SET offer_id=public.send_direct_shift_offer(direct_shift,recipient)$q$,'worker sends direct offer');
SELECT set_config('request.jwt.claim.sub',(SELECT recipient::text FROM ctx),true) IS NOT NULL AS claims_set \gset
SELECT lives_ok($q$SELECT public.respond_to_direct_shift_offer((SELECT offer_id FROM pg_temp.ctx),'accept')$q$,'recipient accepts direct offer');
SELECT set_config('request.jwt.claim.sub',(SELECT manager::text FROM ctx),true) IS NOT NULL AS claims_set \gset
SELECT lives_ok($q$SELECT public.approve_direct_shift_offer((SELECT offer_id FROM pg_temp.ctx))$q$,'manager approves direct offer');
RESET ROLE;
SELECT is((SELECT assigned_profile_id FROM shifts WHERE id=(SELECT direct_shift FROM ctx)),(SELECT recipient FROM ctx),'direct offer transfers ownership');
SELECT is((SELECT manager_profile_id FROM shifts WHERE id=(SELECT direct_shift FROM ctx)),(SELECT manager FROM ctx),'direct offer preserves creator');
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub',(SELECT worker::text FROM ctx),true) IS NOT NULL AS claims_set \gset
SELECT lives_ok($q$SELECT public.release_shift_for_coverage((SELECT depart_shift FROM pg_temp.ctx))$q$,'second release succeeds');
SELECT set_config('request.jwt.claim.sub',(SELECT departing::text FROM ctx),true) IS NOT NULL AS claims_set \gset
SELECT lives_ok($q$INSERT INTO public.shift_interests(shift_id,profile_id,status) SELECT depart_shift,departing,'interested' FROM pg_temp.ctx$q$,'departing worker can express interest');
SELECT lives_ok($q$SELECT public.withdraw_shift_interest((SELECT depart_shift FROM pg_temp.ctx))$q$,'worker withdraws interest through real RPC');
SELECT is((SELECT outcome FROM public.leave_pilot()),'deactivated','legacy-consent worker can leave after withdrawing');
SELECT ok(NOT public.is_active_workplace_member((SELECT wa FROM ctx)),'deactivation immediately removes helper access');
RESET ROLE;
-- Service path uses real SQL role selection and synthetic service claims.
SELECT set_config('request.jwt.claim.sub','',true) IS NOT NULL AS claims_set \gset
SELECT set_config('request.jwt.claims','{"role":"service_role"}',true) IS NOT NULL AS claims_set \gset
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT SELECT ON pg_temp.ctx TO service_role;
CREATE FUNCTION pg_temp.service_creator_probe(target_shift uuid,target_creator uuid) RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $body$
 UPDATE public.shifts SET manager_profile_id=target_creator WHERE id=target_shift;
$body$;
REVOKE ALL ON FUNCTION pg_temp.service_creator_probe(uuid,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION pg_temp.service_creator_probe(uuid,uuid) TO service_role;
SET LOCAL ROLE service_role;
SELECT extensions.throws_ok($q$UPDATE public.shifts SET manager_profile_id=(SELECT spare_profile FROM pg_temp.ctx) WHERE id=(SELECT shift_id FROM pg_temp.ctx)$q$,'42501',NULL,'service role retains source direct-table UPDATE denial');
SELECT extensions.throws_ok($q$SELECT pg_temp.service_creator_probe((SELECT shift_id FROM pg_temp.ctx),(SELECT spare_profile FROM pg_temp.ctx))$q$,'42501','Shift creator attribution is immutable','service definer has no creator-maintenance bypass');
RESET ROLE;
SELECT set_config('request.jwt.claims','{}',true) IS NOT NULL AS claims_set \gset
UPDATE shifts SET manager_profile_id=(SELECT spare_profile FROM ctx) WHERE id=(SELECT shift_id FROM ctx);
SELECT is((SELECT manager_profile_id FROM shifts WHERE id=(SELECT shift_id FROM ctx)),(SELECT spare_profile FROM ctx),'explicit administrator prepares creator-deletion fixture');
SELECT lives_ok($q$DELETE FROM auth.users WHERE id=(SELECT spare_profile FROM pg_temp.ctx)$q$,'administrator can delete profile referenced only as creator');
SELECT ok((SELECT manager_profile_id IS NULL FROM shifts WHERE id=(SELECT shift_id FROM ctx)),'profile deletion clears foreign key attribution');


-- Observer reads are authorized through observer grants, not membership helper.
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub',(SELECT observer_id::text FROM ctx),true) IS NOT NULL AS claims_set \gset
SELECT set_config('request.jwt.claims',jsonb_build_object('sub',(SELECT observer_id FROM ctx),'role','authenticated')::text,true) IS NOT NULL AS claims_set \gset
SELECT ok(NOT is_active_workplace_member((SELECT wa FROM ctx)),'observer remains outside membership helper');
SELECT is((SELECT count(*)::int FROM public.list_my_observer_workplaces()),1,'observer sees authorized workplace');
SELECT lives_ok($q$SELECT * FROM public.get_pilot_monitor_summary((SELECT wa FROM pg_temp.ctx))$q$,'observer summary remains readable');
SELECT lives_ok($q$SELECT * FROM public.list_pilot_monitor_events((SELECT wa FROM pg_temp.ctx),NULL,NULL,NULL,20)$q$,'observer events remain readable');
SELECT throws_ok($q$SELECT * FROM public.get_pilot_monitor_summary((SELECT wb FROM pg_temp.ctx))$q$,'42501',NULL,'observer foreign-workplace summary denied');
RESET ROLE;
SELECT set_config('request.jwt.claim.sub','',true) IS NOT NULL AS claims_set \gset
SELECT set_config('request.jwt.claims','{}',true) IS NOT NULL AS claims_set \gset
UPDATE workplace_observers SET revoked_at=now() WHERE observer_profile_id=(SELECT observer_id FROM ctx);
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub',(SELECT observer_id::text FROM ctx),true) IS NOT NULL AS claims_set \gset
SELECT set_config('request.jwt.claims',jsonb_build_object('sub',(SELECT observer_id FROM ctx),'role','authenticated')::text,true) IS NOT NULL AS claims_set \gset
SELECT is((SELECT count(*)::int FROM public.list_my_observer_workplaces()),0,'revoked observer list is empty');
SELECT throws_ok($q$SELECT * FROM public.get_pilot_monitor_summary((SELECT wa FROM pg_temp.ctx))$q$,'42501',NULL,'revoked observer summary denied');
RESET ROLE;
SELECT set_config('request.jwt.claim.sub','',true) IS NOT NULL AS claims_set \gset
SELECT set_config('request.jwt.claims','{}',true) IS NOT NULL AS claims_set \gset
-- Existing legacy consent must also permit manager-directed deactivation.
ALTER TABLE ctx ADD COLUMN legacy_removed uuid DEFAULT gen_random_uuid();
INSERT INTO auth.users(id,email,raw_user_meta_data) SELECT legacy_removed,'synthetic-legacy-remove@example.invalid','{}'::jsonb FROM ctx;
INSERT INTO workplace_members(workplace_id,profile_id,role,pilot_consented_at,pilot_consent_version) SELECT wa,legacy_removed,'Server',now(),NULL FROM ctx;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub',(SELECT manager::text FROM ctx),true) IS NOT NULL AS claims_set \gset
SELECT set_config('request.jwt.claims',jsonb_build_object('sub',(SELECT manager FROM ctx),'role','authenticated')::text,true) IS NOT NULL AS claims_set \gset
SELECT is((SELECT outcome FROM public.remove_workplace_member((SELECT legacy_removed FROM ctx))),'deactivated','manager can deactivate legacy-invalid consent member');
RESET ROLE;
-- No direct service helper grant; explicit service context still works inside a definer.
CREATE FUNCTION pg_temp.service_member_probe(w uuid,p uuid) RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $body$
 SELECT public.is_active_workplace_member(w,p);
$body$;
REVOKE ALL ON FUNCTION pg_temp.service_member_probe(uuid,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION pg_temp.service_member_probe(uuid,uuid) TO service_role;
SELECT set_config('request.jwt.claim.sub','',true) IS NOT NULL AS claims_set \gset
SELECT set_config('request.jwt.claims','{"role":"service_role"}',true) IS NOT NULL AS claims_set \gset
SET LOCAL ROLE service_role;
SELECT extensions.throws_ok($q$SELECT public.is_active_workplace_member(NULL::uuid,NULL::uuid)$q$,'42501',NULL,'service direct helper EXECUTE is not granted');
SELECT extensions.ok(NOT pg_temp.service_member_probe((SELECT wa FROM pg_temp.ctx),(SELECT manager FROM pg_temp.ctx)),'service definer without member identity has no helper bypass');
RESET ROLE;
SELECT set_config('request.jwt.claims','{}',true) IS NOT NULL AS claims_set \gset
SELECT ok(NOT pg_temp.service_member_probe((SELECT wa FROM ctx),(SELECT manager FROM ctx)),'no-claims background lookup fails closed');
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims','{"role":"service_role"}',true) IS NOT NULL AS claims_set \gset
SELECT ok(NOT is_active_workplace_member((SELECT wa FROM ctx),(SELECT manager FROM ctx)),'service claim alone without service SQL role is insufficient');
RESET ROLE;


RESET ROLE;
CREATE FUNCTION pg_temp.no_user_insert_probe(w uuid) RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $body$
 INSERT INTO public.shifts(workplace_id,starts_at,status) VALUES(w,now()+interval '8 days','open');
$body$;
REVOKE ALL ON FUNCTION pg_temp.no_user_insert_probe(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION pg_temp.no_user_insert_probe(uuid) TO service_role;
SELECT set_config('request.jwt.claim.sub','',true) IS NOT NULL AS claims_set \gset
SELECT set_config('request.jwt.claims','{"role":"service_role"}',true) IS NOT NULL AS claims_set \gset
SET LOCAL ROLE service_role;
SELECT extensions.throws_ok($q$SELECT pg_temp.no_user_insert_probe((SELECT wa FROM pg_temp.ctx))$q$,'42501','Authenticated creator required','no-user service INSERT has no maintenance exception');
RESET ROLE;


RESET ROLE;
-- Portable invariant: browser roles lack dangerous maintenance privileges.

SELECT ok(NOT has_table_privilege('authenticated','public.coverage_events','TRUNCATE'),'authenticated coverage_events lacks TRUNCATE');
SELECT ok(NOT has_table_privilege('authenticated','public.coverage_events','TRIGGER'),'authenticated coverage_events lacks TRIGGER');
SELECT ok(NOT has_table_privilege('authenticated','public.coverage_events','REFERENCES'),'authenticated coverage_events lacks REFERENCES');
SELECT ok(NOT has_table_privilege('authenticated','public.coverage_events','MAINTAIN'),'authenticated coverage_events lacks MAINTAIN');
SELECT ok(NOT has_table_privilege('anon','public.direct_shift_offers','TRUNCATE'),'anon direct_shift_offers lacks TRUNCATE');
SELECT ok(NOT has_table_privilege('anon','public.direct_shift_offers','TRIGGER'),'anon direct_shift_offers lacks TRIGGER');
SELECT ok(NOT has_table_privilege('anon','public.direct_shift_offers','REFERENCES'),'anon direct_shift_offers lacks REFERENCES');
SELECT ok(NOT has_table_privilege('anon','public.direct_shift_offers','MAINTAIN'),'anon direct_shift_offers lacks MAINTAIN');
SELECT ok(NOT has_table_privilege('authenticated','public.direct_shift_offers','TRUNCATE'),'authenticated direct_shift_offers lacks TRUNCATE');
SELECT ok(NOT has_table_privilege('authenticated','public.direct_shift_offers','TRIGGER'),'authenticated direct_shift_offers lacks TRIGGER');
SELECT ok(NOT has_table_privilege('authenticated','public.direct_shift_offers','REFERENCES'),'authenticated direct_shift_offers lacks REFERENCES');
SELECT ok(NOT has_table_privilege('authenticated','public.direct_shift_offers','MAINTAIN'),'authenticated direct_shift_offers lacks MAINTAIN');
SELECT ok(NOT has_table_privilege('anon','public.profiles','TRUNCATE'),'anon profiles lacks TRUNCATE');
SELECT ok(NOT has_table_privilege('anon','public.profiles','TRIGGER'),'anon profiles lacks TRIGGER');
SELECT ok(NOT has_table_privilege('anon','public.profiles','REFERENCES'),'anon profiles lacks REFERENCES');
SELECT ok(NOT has_table_privilege('anon','public.profiles','MAINTAIN'),'anon profiles lacks MAINTAIN');
SELECT ok(NOT has_table_privilege('authenticated','public.profiles','TRUNCATE'),'authenticated profiles lacks TRUNCATE');
SELECT ok(NOT has_table_privilege('authenticated','public.profiles','TRIGGER'),'authenticated profiles lacks TRIGGER');
SELECT ok(NOT has_table_privilege('authenticated','public.profiles','REFERENCES'),'authenticated profiles lacks REFERENCES');
SELECT ok(NOT has_table_privilege('authenticated','public.profiles','MAINTAIN'),'authenticated profiles lacks MAINTAIN');
SELECT ok(NOT has_table_privilege('authenticated','public.shift_interests','TRUNCATE'),'authenticated shift_interests lacks TRUNCATE');
SELECT ok(NOT has_table_privilege('authenticated','public.shift_interests','TRIGGER'),'authenticated shift_interests lacks TRIGGER');
SELECT ok(NOT has_table_privilege('authenticated','public.shift_interests','REFERENCES'),'authenticated shift_interests lacks REFERENCES');
SELECT ok(NOT has_table_privilege('authenticated','public.shift_interests','MAINTAIN'),'authenticated shift_interests lacks MAINTAIN');
SELECT ok(NOT has_table_privilege('anon','public.shifts','TRUNCATE'),'anon shifts lacks TRUNCATE');
SELECT ok(NOT has_table_privilege('anon','public.shifts','TRIGGER'),'anon shifts lacks TRIGGER');
SELECT ok(NOT has_table_privilege('anon','public.shifts','REFERENCES'),'anon shifts lacks REFERENCES');
SELECT ok(NOT has_table_privilege('anon','public.shifts','MAINTAIN'),'anon shifts lacks MAINTAIN');
SELECT ok(NOT has_table_privilege('authenticated','public.shifts','TRUNCATE'),'authenticated shifts lacks TRUNCATE');
SELECT ok(NOT has_table_privilege('authenticated','public.shifts','TRIGGER'),'authenticated shifts lacks TRIGGER');
SELECT ok(NOT has_table_privilege('authenticated','public.shifts','REFERENCES'),'authenticated shifts lacks REFERENCES');
SELECT ok(NOT has_table_privilege('authenticated','public.shifts','MAINTAIN'),'authenticated shifts lacks MAINTAIN');
SELECT ok(NOT has_table_privilege('anon','public.workplace_members','TRUNCATE'),'anon workplace_members lacks TRUNCATE');
SELECT ok(NOT has_table_privilege('anon','public.workplace_members','TRIGGER'),'anon workplace_members lacks TRIGGER');
SELECT ok(NOT has_table_privilege('anon','public.workplace_members','REFERENCES'),'anon workplace_members lacks REFERENCES');
SELECT ok(NOT has_table_privilege('anon','public.workplace_members','MAINTAIN'),'anon workplace_members lacks MAINTAIN');
SELECT ok(NOT has_table_privilege('authenticated','public.workplace_members','TRUNCATE'),'authenticated workplace_members lacks TRUNCATE');
SELECT ok(NOT has_table_privilege('authenticated','public.workplace_members','TRIGGER'),'authenticated workplace_members lacks TRIGGER');
SELECT ok(NOT has_table_privilege('authenticated','public.workplace_members','REFERENCES'),'authenticated workplace_members lacks REFERENCES');
SELECT ok(NOT has_table_privilege('authenticated','public.workplace_members','MAINTAIN'),'authenticated workplace_members lacks MAINTAIN');
SELECT ok(NOT has_table_privilege('anon','public.workplaces','TRUNCATE'),'anon workplaces lacks TRUNCATE');
SELECT ok(NOT has_table_privilege('anon','public.workplaces','TRIGGER'),'anon workplaces lacks TRIGGER');
SELECT ok(NOT has_table_privilege('anon','public.workplaces','REFERENCES'),'anon workplaces lacks REFERENCES');
SELECT ok(NOT has_table_privilege('anon','public.workplaces','MAINTAIN'),'anon workplaces lacks MAINTAIN');
SELECT ok(NOT has_table_privilege('authenticated','public.workplaces','TRUNCATE'),'authenticated workplaces lacks TRUNCATE');
SELECT ok(NOT has_table_privilege('authenticated','public.workplaces','TRIGGER'),'authenticated workplaces lacks TRIGGER');
SELECT ok(NOT has_table_privilege('authenticated','public.workplaces','REFERENCES'),'authenticated workplaces lacks REFERENCES');
SELECT ok(NOT has_table_privilege('authenticated','public.workplaces','MAINTAIN'),'authenticated workplaces lacks MAINTAIN');
SET LOCAL ROLE postgres; CREATE TABLE public.synthetic_default_privilege_probe(id integer); RESET ROLE;

SELECT ok(NOT has_table_privilege('anon','public.synthetic_default_privilege_probe','TRUNCATE'),'future postgres table default denies anon TRUNCATE');
SELECT ok(NOT has_table_privilege('anon','public.synthetic_default_privilege_probe','TRIGGER'),'future postgres table default denies anon TRIGGER');
SELECT ok(NOT has_table_privilege('anon','public.synthetic_default_privilege_probe','REFERENCES'),'future postgres table default denies anon REFERENCES');
SELECT ok(NOT has_table_privilege('anon','public.synthetic_default_privilege_probe','MAINTAIN'),'future postgres table default denies anon MAINTAIN');
SELECT ok(NOT has_table_privilege('authenticated','public.synthetic_default_privilege_probe','TRUNCATE'),'future postgres table default denies authenticated TRUNCATE');
SELECT ok(NOT has_table_privilege('authenticated','public.synthetic_default_privilege_probe','TRIGGER'),'future postgres table default denies authenticated TRIGGER');
SELECT ok(NOT has_table_privilege('authenticated','public.synthetic_default_privilege_probe','REFERENCES'),'future postgres table default denies authenticated REFERENCES');
SELECT ok(NOT has_table_privilege('authenticated','public.synthetic_default_privilege_probe','MAINTAIN'),'future postgres table default denies authenticated MAINTAIN');
SET LOCAL ROLE anon; SELECT extensions.throws_ok('TRUNCATE public.synthetic_default_privilege_probe','42501',NULL,'anon actual TRUNCATE denied'); RESET ROLE;
SET LOCAL ROLE authenticated; SELECT extensions.throws_ok('TRUNCATE public.synthetic_default_privilege_probe','42501',NULL,'authenticated actual TRUNCATE denied'); RESET ROLE;

SELECT * FROM finish();
ROLLBACK;
