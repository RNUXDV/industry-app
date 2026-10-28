-- HOSTED-MODEL ONLY. Deliberately outside supabase/tests default discovery.
-- Invoke only in the disposable hosted-equivalent model, explicitly opt in with
-- SET industry.test_environment='hosted-model' in the same PSQL session.
BEGIN;
SET LOCAL search_path=public,extensions,pg_temp;
DO $gate$ BEGIN
 IF current_setting('industry.test_environment',true) IS DISTINCT FROM 'hosted-model' THEN
  RAISE EXCEPTION 'STOP: explicit disposable hosted-model test context required';
 END IF;
END $gate$;
SELECT no_plan();
SELECT ok(has_table_privilege('anon','public.coverage_events','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.coverage_events','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.coverage_events','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.coverage_events','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: anon coverage_events');
SELECT ok(has_table_privilege('authenticated','public.coverage_events','SELECT') IS NOT DISTINCT FROM true AND has_table_privilege('authenticated','public.coverage_events','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.coverage_events','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.coverage_events','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: authenticated coverage_events');
SELECT ok(has_table_privilege('service_role','public.coverage_events','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.coverage_events','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.coverage_events','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.coverage_events','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: service_role coverage_events');
SELECT ok(has_table_privilege('anon','public.direct_shift_offers','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.direct_shift_offers','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.direct_shift_offers','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.direct_shift_offers','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: anon direct_shift_offers');
SELECT ok(has_table_privilege('authenticated','public.direct_shift_offers','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.direct_shift_offers','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.direct_shift_offers','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.direct_shift_offers','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: authenticated direct_shift_offers');
SELECT ok(has_table_privilege('service_role','public.direct_shift_offers','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.direct_shift_offers','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.direct_shift_offers','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.direct_shift_offers','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: service_role direct_shift_offers');
SELECT ok(has_table_privilege('anon','public.pilot_audit_aggregates','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.pilot_audit_aggregates','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.pilot_audit_aggregates','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.pilot_audit_aggregates','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: anon pilot_audit_aggregates');
SELECT ok(has_table_privilege('authenticated','public.pilot_audit_aggregates','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.pilot_audit_aggregates','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.pilot_audit_aggregates','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.pilot_audit_aggregates','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: authenticated pilot_audit_aggregates');
SELECT ok(has_table_privilege('service_role','public.pilot_audit_aggregates','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.pilot_audit_aggregates','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.pilot_audit_aggregates','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.pilot_audit_aggregates','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: service_role pilot_audit_aggregates');
SELECT ok(has_table_privilege('anon','public.pilot_audit_events','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.pilot_audit_events','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.pilot_audit_events','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.pilot_audit_events','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: anon pilot_audit_events');
SELECT ok(has_table_privilege('authenticated','public.pilot_audit_events','SELECT') IS NOT DISTINCT FROM true AND has_table_privilege('authenticated','public.pilot_audit_events','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.pilot_audit_events','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.pilot_audit_events','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: authenticated pilot_audit_events');
SELECT ok(has_table_privilege('service_role','public.pilot_audit_events','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.pilot_audit_events','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.pilot_audit_events','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.pilot_audit_events','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: service_role pilot_audit_events');
SELECT ok(has_table_privilege('anon','public.pilot_invitations','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.pilot_invitations','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.pilot_invitations','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.pilot_invitations','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: anon pilot_invitations');
SELECT ok(has_table_privilege('authenticated','public.pilot_invitations','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.pilot_invitations','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.pilot_invitations','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.pilot_invitations','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: authenticated pilot_invitations');
SELECT ok(has_table_privilege('service_role','public.pilot_invitations','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.pilot_invitations','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.pilot_invitations','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.pilot_invitations','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: service_role pilot_invitations');
SELECT ok(has_table_privilege('anon','public.profiles','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.profiles','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.profiles','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.profiles','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: anon profiles');
SELECT ok(has_table_privilege('authenticated','public.profiles','SELECT') IS NOT DISTINCT FROM true AND has_table_privilege('authenticated','public.profiles','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.profiles','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.profiles','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: authenticated profiles');
SELECT ok(has_table_privilege('service_role','public.profiles','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.profiles','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.profiles','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.profiles','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: service_role profiles');
SELECT ok(has_table_privilege('anon','public.shift_interests','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.shift_interests','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.shift_interests','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.shift_interests','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: anon shift_interests');
SELECT ok(has_table_privilege('authenticated','public.shift_interests','SELECT') IS NOT DISTINCT FROM true AND has_table_privilege('authenticated','public.shift_interests','INSERT') IS NOT DISTINCT FROM true AND has_table_privilege('authenticated','public.shift_interests','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.shift_interests','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: authenticated shift_interests');
SELECT ok(has_table_privilege('service_role','public.shift_interests','SELECT') IS NOT DISTINCT FROM true AND has_table_privilege('service_role','public.shift_interests','INSERT') IS NOT DISTINCT FROM true AND has_table_privilege('service_role','public.shift_interests','UPDATE') IS NOT DISTINCT FROM true AND has_table_privilege('service_role','public.shift_interests','DELETE') IS NOT DISTINCT FROM true,'CRUD unchanged: service_role shift_interests');
SELECT ok(has_table_privilege('anon','public.shifts','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.shifts','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.shifts','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.shifts','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: anon shifts');
SELECT ok(has_table_privilege('authenticated','public.shifts','SELECT') IS NOT DISTINCT FROM true AND has_table_privilege('authenticated','public.shifts','INSERT') IS NOT DISTINCT FROM true AND has_table_privilege('authenticated','public.shifts','UPDATE') IS NOT DISTINCT FROM true AND has_table_privilege('authenticated','public.shifts','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: authenticated shifts');
SELECT ok(has_table_privilege('service_role','public.shifts','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.shifts','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.shifts','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.shifts','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: service_role shifts');
SELECT ok(has_table_privilege('anon','public.workplace_members','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplace_members','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplace_members','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplace_members','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: anon workplace_members');
SELECT ok(has_table_privilege('authenticated','public.workplace_members','SELECT') IS NOT DISTINCT FROM true AND has_table_privilege('authenticated','public.workplace_members','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.workplace_members','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.workplace_members','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: authenticated workplace_members');
SELECT ok(has_table_privilege('service_role','public.workplace_members','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplace_members','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplace_members','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplace_members','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: service_role workplace_members');
SELECT ok(has_table_privilege('anon','public.workplace_observers','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplace_observers','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplace_observers','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplace_observers','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: anon workplace_observers');
SELECT ok(has_table_privilege('authenticated','public.workplace_observers','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.workplace_observers','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.workplace_observers','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.workplace_observers','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: authenticated workplace_observers');
SELECT ok(has_table_privilege('service_role','public.workplace_observers','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplace_observers','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplace_observers','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplace_observers','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: service_role workplace_observers');
SELECT ok(has_table_privilege('anon','public.workplace_participant_codes','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplace_participant_codes','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplace_participant_codes','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplace_participant_codes','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: anon workplace_participant_codes');
SELECT ok(has_table_privilege('authenticated','public.workplace_participant_codes','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.workplace_participant_codes','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.workplace_participant_codes','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.workplace_participant_codes','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: authenticated workplace_participant_codes');
SELECT ok(has_table_privilege('service_role','public.workplace_participant_codes','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplace_participant_codes','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplace_participant_codes','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplace_participant_codes','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: service_role workplace_participant_codes');
SELECT ok(has_table_privilege('anon','public.workplace_pilot_settings','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplace_pilot_settings','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplace_pilot_settings','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplace_pilot_settings','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: anon workplace_pilot_settings');
SELECT ok(has_table_privilege('authenticated','public.workplace_pilot_settings','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.workplace_pilot_settings','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.workplace_pilot_settings','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.workplace_pilot_settings','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: authenticated workplace_pilot_settings');
SELECT ok(has_table_privilege('service_role','public.workplace_pilot_settings','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplace_pilot_settings','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplace_pilot_settings','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplace_pilot_settings','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: service_role workplace_pilot_settings');
SELECT ok(has_table_privilege('anon','public.workplace_shift_codes','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplace_shift_codes','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplace_shift_codes','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplace_shift_codes','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: anon workplace_shift_codes');
SELECT ok(has_table_privilege('authenticated','public.workplace_shift_codes','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.workplace_shift_codes','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.workplace_shift_codes','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.workplace_shift_codes','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: authenticated workplace_shift_codes');
SELECT ok(has_table_privilege('service_role','public.workplace_shift_codes','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplace_shift_codes','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplace_shift_codes','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplace_shift_codes','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: service_role workplace_shift_codes');
SELECT ok(has_table_privilege('anon','public.workplaces','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplaces','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplaces','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('anon','public.workplaces','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: anon workplaces');
SELECT ok(has_table_privilege('authenticated','public.workplaces','SELECT') IS NOT DISTINCT FROM true AND has_table_privilege('authenticated','public.workplaces','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.workplaces','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('authenticated','public.workplaces','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: authenticated workplaces');
SELECT ok(has_table_privilege('service_role','public.workplaces','SELECT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplaces','INSERT') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplaces','UPDATE') IS NOT DISTINCT FROM false AND has_table_privilege('service_role','public.workplaces','DELETE') IS NOT DISTINCT FROM false,'CRUD unchanged: service_role workplaces');
CREATE TEMP TABLE expected_rpc(name text,args text,role_name text,can_execute boolean);
INSERT INTO expected_rpc VALUES
('audit_coverage_event_lifecycle','','anon',false),
('audit_coverage_event_lifecycle','','authenticated',false),
('audit_coverage_event_lifecycle','','service_role',false),
('audit_coverage_event_lifecycle','','supabase_auth_admin',false),
('audit_direct_offer_lifecycle','','anon',false),
('audit_direct_offer_lifecycle','','authenticated',false),
('audit_direct_offer_lifecycle','','service_role',false),
('audit_direct_offer_lifecycle','','supabase_auth_admin',false),
('audit_interest_lifecycle','','anon',false),
('audit_interest_lifecycle','','authenticated',false),
('audit_interest_lifecycle','','service_role',false),
('audit_interest_lifecycle','','supabase_auth_admin',false),
('audit_invitation_lifecycle','','anon',false),
('audit_invitation_lifecycle','','authenticated',false),
('audit_invitation_lifecycle','','service_role',false),
('audit_invitation_lifecycle','','supabase_auth_admin',false),
('audit_membership_lifecycle','','anon',false),
('audit_membership_lifecycle','','authenticated',false),
('audit_membership_lifecycle','','service_role',false),
('audit_membership_lifecycle','','supabase_auth_admin',false),
('audit_observer_lifecycle','','anon',false),
('audit_observer_lifecycle','','authenticated',false),
('audit_observer_lifecycle','','service_role',false),
('audit_observer_lifecycle','','supabase_auth_admin',false),
('audit_shift_lifecycle','','anon',false),
('audit_shift_lifecycle','','authenticated',false),
('audit_shift_lifecycle','','service_role',false),
('audit_shift_lifecycle','','supabase_auth_admin',false),
('capture_coverage_event_shift_snapshot','','anon',false),
('capture_coverage_event_shift_snapshot','','authenticated',false),
('capture_coverage_event_shift_snapshot','','service_role',false),
('capture_coverage_event_shift_snapshot','','supabase_auth_admin',false),
('enforce_active_coverage_event_write','','anon',false),
('enforce_active_coverage_event_write','','authenticated',false),
('enforce_active_coverage_event_write','','service_role',false),
('enforce_active_coverage_event_write','','supabase_auth_admin',false),
('enforce_active_interest_write','','anon',false),
('enforce_active_interest_write','','authenticated',false),
('enforce_active_interest_write','','service_role',false),
('enforce_active_interest_write','','supabase_auth_admin',false),
('enforce_active_offer_write','','anon',false),
('enforce_active_offer_write','','authenticated',false),
('enforce_active_offer_write','','service_role',false),
('enforce_active_offer_write','','supabase_auth_admin',false),
('enforce_active_shift_write','','anon',false),
('enforce_active_shift_write','','authenticated',false),
('enforce_active_shift_write','','service_role',false),
('enforce_active_shift_write','','supabase_auth_admin',false),
('get_direct_release_coworkers','','anon',false),
('get_direct_release_coworkers','','authenticated',true),
('get_direct_release_coworkers','','service_role',false),
('get_direct_release_coworkers','','supabase_auth_admin',false),
('guard_pilot_audit_immutability','','anon',false),
('guard_pilot_audit_immutability','','authenticated',false),
('guard_pilot_audit_immutability','','service_role',false),
('guard_pilot_audit_immutability','','supabase_auth_admin',false),
('handle_new_user','','anon',true),
('handle_new_user','','authenticated',true),
('handle_new_user','','service_role',true),
('handle_new_user','','supabase_auth_admin',true),
('leave_pilot','','anon',false),
('leave_pilot','','authenticated',true),
('leave_pilot','','service_role',false),
('leave_pilot','','supabase_auth_admin',false),
('list_direct_offer_approvals','','anon',false),
('list_direct_offer_approvals','','authenticated',true),
('list_direct_offer_approvals','','service_role',false),
('list_direct_offer_approvals','','supabase_auth_admin',false),
('list_my_direct_shift_offers','','anon',false),
('list_my_direct_shift_offers','','authenticated',true),
('list_my_direct_shift_offers','','service_role',false),
('list_my_direct_shift_offers','','supabase_auth_admin',false),
('list_my_observer_workplaces','','anon',false),
('list_my_observer_workplaces','','authenticated',true),
('list_my_observer_workplaces','','service_role',false),
('list_my_observer_workplaces','','supabase_auth_admin',false),
('list_workplace_invitations','','anon',false),
('list_workplace_invitations','','authenticated',true),
('list_workplace_invitations','','service_role',false),
('list_workplace_invitations','','supabase_auth_admin',false),
('rls_auto_enable','','anon',true),
('rls_auto_enable','','authenticated',true),
('rls_auto_enable','','service_role',true),
('rls_auto_enable','','supabase_auth_admin',true),
('sync_shift_coverage_stage','','anon',true),
('sync_shift_coverage_stage','','authenticated',true),
('sync_shift_coverage_stage','','service_role',true),
('sync_shift_coverage_stage','','supabase_auth_admin',true),
('new_private_workplace_code','code_prefix text','anon',false),
('new_private_workplace_code','code_prefix text','authenticated',false),
('new_private_workplace_code','code_prefix text','service_role',false),
('new_private_workplace_code','code_prefix text','supabase_auth_admin',false),
('enforce_pilot_invitation_before_user_created','input jsonb','anon',false),
('enforce_pilot_invitation_before_user_created','input jsonb','authenticated',false),
('enforce_pilot_invitation_before_user_created','input jsonb','service_role',false),
('enforce_pilot_invitation_before_user_created','input jsonb','supabase_auth_admin',true),
('safe_pilot_audit_metadata','input jsonb','anon',false),
('safe_pilot_audit_metadata','input jsonb','authenticated',false),
('safe_pilot_audit_metadata','input jsonb','service_role',false),
('safe_pilot_audit_metadata','input jsonb','supabase_auth_admin',false),
('accept_pilot_invitation','invite_token text, consent_acknowledged boolean, consent_version text','anon',false),
('accept_pilot_invitation','invite_token text, consent_acknowledged boolean, consent_version text','authenticated',true),
('accept_pilot_invitation','invite_token text, consent_acknowledged boolean, consent_version text','service_role',false),
('accept_pilot_invitation','invite_token text, consent_acknowledged boolean, consent_version text','supabase_auth_admin',false),
('get_pilot_invitation','invite_token text','anon',true),
('get_pilot_invitation','invite_token text','authenticated',true),
('get_pilot_invitation','invite_token text','service_role',false),
('get_pilot_invitation','invite_token text','supabase_auth_admin',false),
('is_same_workplace','other_profile_id uuid','anon',false),
('is_same_workplace','other_profile_id uuid','authenticated',true),
('is_same_workplace','other_profile_id uuid','service_role',false),
('is_same_workplace','other_profile_id uuid','supabase_auth_admin',false),
('select_shift_interest','p_interest_id uuid','anon',false),
('select_shift_interest','p_interest_id uuid','authenticated',true),
('select_shift_interest','p_interest_id uuid','service_role',false),
('select_shift_interest','p_interest_id uuid','supabase_auth_admin',false),
('cancel_coverage_request','p_shift_id uuid','anon',false),
('cancel_coverage_request','p_shift_id uuid','authenticated',true),
('cancel_coverage_request','p_shift_id uuid','service_role',false),
('cancel_coverage_request','p_shift_id uuid','supabase_auth_admin',false),
('withdraw_shift_interest','p_shift_id uuid','anon',false),
('withdraw_shift_interest','p_shift_id uuid','authenticated',true),
('withdraw_shift_interest','p_shift_id uuid','service_role',false),
('withdraw_shift_interest','p_shift_id uuid','supabase_auth_admin',false),
('create_workplace_invitation','target_email text, target_role text, volunteer_confirmed boolean','anon',false),
('create_workplace_invitation','target_email text, target_role text, volunteer_confirmed boolean','authenticated',true),
('create_workplace_invitation','target_email text, target_role text, volunteer_confirmed boolean','service_role',false),
('create_workplace_invitation','target_email text, target_role text, volunteer_confirmed boolean','supabase_auth_admin',false),
('revoke_workplace_invitation','target_invitation_id uuid','anon',false),
('revoke_workplace_invitation','target_invitation_id uuid','authenticated',true),
('revoke_workplace_invitation','target_invitation_id uuid','service_role',false),
('revoke_workplace_invitation','target_invitation_id uuid','supabase_auth_admin',false),
('respond_to_direct_shift_offer','target_offer_id uuid, response_action text','anon',false),
('respond_to_direct_shift_offer','target_offer_id uuid, response_action text','authenticated',true),
('respond_to_direct_shift_offer','target_offer_id uuid, response_action text','service_role',false),
('respond_to_direct_shift_offer','target_offer_id uuid, response_action text','supabase_auth_admin',false),
('approve_direct_shift_offer','target_offer_id uuid','anon',false),
('approve_direct_shift_offer','target_offer_id uuid','authenticated',true),
('approve_direct_shift_offer','target_offer_id uuid','service_role',false),
('approve_direct_shift_offer','target_offer_id uuid','supabase_auth_admin',false),
('cancel_direct_shift_offer','target_offer_id uuid','anon',false),
('cancel_direct_shift_offer','target_offer_id uuid','authenticated',true),
('cancel_direct_shift_offer','target_offer_id uuid','service_role',false),
('cancel_direct_shift_offer','target_offer_id uuid','supabase_auth_admin',false),
('remove_workplace_member','target_profile_id uuid','anon',false),
('remove_workplace_member','target_profile_id uuid','authenticated',true),
('remove_workplace_member','target_profile_id uuid','service_role',false),
('remove_workplace_member','target_profile_id uuid','supabase_auth_admin',false),
('report_assigned_shift_end','target_shift_id uuid, reported_end_at timestamp with time zone','anon',false),
('report_assigned_shift_end','target_shift_id uuid, reported_end_at timestamp with time zone','authenticated',true),
('report_assigned_shift_end','target_shift_id uuid, reported_end_at timestamp with time zone','service_role',false),
('report_assigned_shift_end','target_shift_id uuid, reported_end_at timestamp with time zone','supabase_auth_admin',false),
('report_assigned_shift_start','target_shift_id uuid, reported_start_at timestamp with time zone','anon',false),
('report_assigned_shift_start','target_shift_id uuid, reported_start_at timestamp with time zone','authenticated',true),
('report_assigned_shift_start','target_shift_id uuid, reported_start_at timestamp with time zone','service_role',false),
('report_assigned_shift_start','target_shift_id uuid, reported_start_at timestamp with time zone','supabase_auth_admin',false),
('confirm_shift_coverage','target_shift_id uuid, selected_profile_id uuid','anon',false),
('confirm_shift_coverage','target_shift_id uuid, selected_profile_id uuid','authenticated',true),
('confirm_shift_coverage','target_shift_id uuid, selected_profile_id uuid','service_role',false),
('confirm_shift_coverage','target_shift_id uuid, selected_profile_id uuid','supabase_auth_admin',false),
('manager_update_shift','target_shift_id uuid, target_assigned_profile_id uuid, target_role text, target_starts_at timestamp with time zone, target_ends_at timestamp with time zone, target_end_label text','anon',false),
('manager_update_shift','target_shift_id uuid, target_assigned_profile_id uuid, target_role text, target_starts_at timestamp with time zone, target_ends_at timestamp with time zone, target_end_label text','authenticated',true),
('manager_update_shift','target_shift_id uuid, target_assigned_profile_id uuid, target_role text, target_starts_at timestamp with time zone, target_ends_at timestamp with time zone, target_end_label text','service_role',false),
('manager_update_shift','target_shift_id uuid, target_assigned_profile_id uuid, target_role text, target_starts_at timestamp with time zone, target_ends_at timestamp with time zone, target_end_label text','supabase_auth_admin',false),
('send_direct_shift_offer','target_shift_id uuid, target_recipient_profile_id uuid','anon',false),
('send_direct_shift_offer','target_shift_id uuid, target_recipient_profile_id uuid','authenticated',true),
('send_direct_shift_offer','target_shift_id uuid, target_recipient_profile_id uuid','service_role',false),
('send_direct_shift_offer','target_shift_id uuid, target_recipient_profile_id uuid','supabase_auth_admin',false),
('end_assigned_shift','target_shift_id uuid','anon',false),
('end_assigned_shift','target_shift_id uuid','authenticated',true),
('end_assigned_shift','target_shift_id uuid','service_role',false),
('end_assigned_shift','target_shift_id uuid','supabase_auth_admin',false),
('get_my_active_direct_shift_offer','target_shift_id uuid','anon',false),
('get_my_active_direct_shift_offer','target_shift_id uuid','authenticated',true),
('get_my_active_direct_shift_offer','target_shift_id uuid','service_role',false),
('get_my_active_direct_shift_offer','target_shift_id uuid','supabase_auth_admin',false),
('is_manager_for_shift','target_shift_id uuid','anon',false),
('is_manager_for_shift','target_shift_id uuid','authenticated',true),
('is_manager_for_shift','target_shift_id uuid','service_role',false),
('is_manager_for_shift','target_shift_id uuid','supabase_auth_admin',false),
('release_shift_for_coverage','target_shift_id uuid','anon',false),
('release_shift_for_coverage','target_shift_id uuid','authenticated',true),
('release_shift_for_coverage','target_shift_id uuid','service_role',false),
('release_shift_for_coverage','target_shift_id uuid','supabase_auth_admin',false),
('list_pilot_monitor_events','target_workplace_id uuid, event_type_filter text, outcome_filter text, since_filter timestamp with time zone, result_limit integer','anon',false),
('list_pilot_monitor_events','target_workplace_id uuid, event_type_filter text, outcome_filter text, since_filter timestamp with time zone, result_limit integer','authenticated',true),
('list_pilot_monitor_events','target_workplace_id uuid, event_type_filter text, outcome_filter text, since_filter timestamp with time zone, result_limit integer','service_role',false),
('list_pilot_monitor_events','target_workplace_id uuid, event_type_filter text, outcome_filter text, since_filter timestamp with time zone, result_limit integer','supabase_auth_admin',false),
('create_pilot_manager_invitation','target_workplace_id uuid, target_email text, volunteer_confirmed boolean','anon',false),
('create_pilot_manager_invitation','target_workplace_id uuid, target_email text, volunteer_confirmed boolean','authenticated',false),
('create_pilot_manager_invitation','target_workplace_id uuid, target_email text, volunteer_confirmed boolean','service_role',true),
('create_pilot_manager_invitation','target_workplace_id uuid, target_email text, volunteer_confirmed boolean','supabase_auth_admin',false),
('append_pilot_audit_event','target_workplace_id uuid, target_event_type text, target_outcome text, target_subject_code text, target_object_code text, target_metadata jsonb, target_actor_code text, target_actor_category text','anon',false),
('append_pilot_audit_event','target_workplace_id uuid, target_event_type text, target_outcome text, target_subject_code text, target_object_code text, target_metadata jsonb, target_actor_code text, target_actor_category text','authenticated',false),
('append_pilot_audit_event','target_workplace_id uuid, target_event_type text, target_outcome text, target_subject_code text, target_object_code text, target_metadata jsonb, target_actor_code text, target_actor_category text','service_role',false),
('append_pilot_audit_event','target_workplace_id uuid, target_event_type text, target_outcome text, target_subject_code text, target_object_code text, target_metadata jsonb, target_actor_code text, target_actor_category text','supabase_auth_admin',false),
('configure_pilot_audit_retention','target_workplace_id uuid, target_pilot_ends_at timestamp with time zone, target_retention_days integer','anon',false),
('configure_pilot_audit_retention','target_workplace_id uuid, target_pilot_ends_at timestamp with time zone, target_retention_days integer','authenticated',false),
('configure_pilot_audit_retention','target_workplace_id uuid, target_pilot_ends_at timestamp with time zone, target_retention_days integer','service_role',true),
('configure_pilot_audit_retention','target_workplace_id uuid, target_pilot_ends_at timestamp with time zone, target_retention_days integer','supabase_auth_admin',false),
('ensure_participant_code','target_workplace_id uuid, target_profile_id uuid','anon',false),
('ensure_participant_code','target_workplace_id uuid, target_profile_id uuid','authenticated',false),
('ensure_participant_code','target_workplace_id uuid, target_profile_id uuid','service_role',false),
('ensure_participant_code','target_workplace_id uuid, target_profile_id uuid','supabase_auth_admin',false),
('grant_pilot_observer','target_workplace_id uuid, target_profile_id uuid','anon',false),
('grant_pilot_observer','target_workplace_id uuid, target_profile_id uuid','authenticated',false),
('grant_pilot_observer','target_workplace_id uuid, target_profile_id uuid','service_role',true),
('grant_pilot_observer','target_workplace_id uuid, target_profile_id uuid','supabase_auth_admin',false),
('is_active_pilot_observer','target_workplace_id uuid, target_profile_id uuid','anon',false),
('is_active_pilot_observer','target_workplace_id uuid, target_profile_id uuid','authenticated',false),
('is_active_pilot_observer','target_workplace_id uuid, target_profile_id uuid','service_role',false),
('is_active_pilot_observer','target_workplace_id uuid, target_profile_id uuid','supabase_auth_admin',false),
('is_active_workplace_member','target_workplace_id uuid, target_profile_id uuid','anon',false),
('is_active_workplace_member','target_workplace_id uuid, target_profile_id uuid','authenticated',true),
('is_active_workplace_member','target_workplace_id uuid, target_profile_id uuid','service_role',false),
('is_active_workplace_member','target_workplace_id uuid, target_profile_id uuid','supabase_auth_admin',false),
('pilot_membership_deactivation_blocker','target_workplace_id uuid, target_profile_id uuid','anon',false),
('pilot_membership_deactivation_blocker','target_workplace_id uuid, target_profile_id uuid','authenticated',false),
('pilot_membership_deactivation_blocker','target_workplace_id uuid, target_profile_id uuid','service_role',false),
('pilot_membership_deactivation_blocker','target_workplace_id uuid, target_profile_id uuid','supabase_auth_admin',false),
('revoke_pilot_observer','target_workplace_id uuid, target_profile_id uuid','anon',false),
('revoke_pilot_observer','target_workplace_id uuid, target_profile_id uuid','authenticated',false),
('revoke_pilot_observer','target_workplace_id uuid, target_profile_id uuid','service_role',true),
('revoke_pilot_observer','target_workplace_id uuid, target_profile_id uuid','supabase_auth_admin',false),
('ensure_shift_code','target_workplace_id uuid, target_shift_id uuid','anon',false),
('ensure_shift_code','target_workplace_id uuid, target_shift_id uuid','authenticated',false),
('ensure_shift_code','target_workplace_id uuid, target_shift_id uuid','service_role',false),
('ensure_shift_code','target_workplace_id uuid, target_shift_id uuid','supabase_auth_admin',false),
('cleanup_eligible_pilot_audit','target_workplace_id uuid','anon',false),
('cleanup_eligible_pilot_audit','target_workplace_id uuid','authenticated',false),
('cleanup_eligible_pilot_audit','target_workplace_id uuid','service_role',true),
('cleanup_eligible_pilot_audit','target_workplace_id uuid','supabase_auth_admin',false),
('get_pilot_monitor_summary','target_workplace_id uuid','anon',false),
('get_pilot_monitor_summary','target_workplace_id uuid','authenticated',true),
('get_pilot_monitor_summary','target_workplace_id uuid','service_role',false),
('get_pilot_monitor_summary','target_workplace_id uuid','supabase_auth_admin',false),
('is_current_user_active_pilot_observer','target_workplace_id uuid','anon',false),
('is_current_user_active_pilot_observer','target_workplace_id uuid','authenticated',true),
('is_current_user_active_pilot_observer','target_workplace_id uuid','service_role',false),
('is_current_user_active_pilot_observer','target_workplace_id uuid','supabase_auth_admin',false),
('is_manager_for_workplace','target_workplace_id uuid','anon',false),
('is_manager_for_workplace','target_workplace_id uuid','authenticated',true),
('is_manager_for_workplace','target_workplace_id uuid','service_role',false),
('is_manager_for_workplace','target_workplace_id uuid','supabase_auth_admin',false),
('pilot_audit_actor_category','target_workplace_id uuid','anon',false),
('pilot_audit_actor_category','target_workplace_id uuid','authenticated',false),
('pilot_audit_actor_category','target_workplace_id uuid','service_role',false),
('pilot_audit_actor_category','target_workplace_id uuid','supabase_auth_admin',false);
SELECT ok((SELECT count(*)=248 AND bool_and(has_function_privilege(e.role_name,p.oid,'EXECUTE') IS NOT DISTINCT FROM e.can_execute) FROM expected_rpc e JOIN pg_proc p ON p.proname=e.name AND pg_get_function_identity_arguments(p.oid)=e.args JOIN pg_namespace n ON n.oid=p.pronamespace AND n.nspname='public'),'all 248 existing role/RPC EXECUTE results unchanged');
SET LOCAL ROLE postgres; CREATE TABLE public.synthetic_default_privilege_probe(id integer); RESET ROLE;
SELECT ok(has_table_privilege('service_role','public.synthetic_default_privilege_probe','TRUNCATE'),'future service default preserved: TRUNCATE');
SELECT ok(has_table_privilege('service_role','public.synthetic_default_privilege_probe','TRIGGER'),'future service default preserved: TRIGGER');
SELECT ok(has_table_privilege('service_role','public.synthetic_default_privilege_probe','REFERENCES'),'future service default preserved: REFERENCES');
SELECT ok(has_table_privilege('service_role','public.synthetic_default_privilege_probe','MAINTAIN'),'future service default preserved: MAINTAIN');

SELECT * FROM finish();
ROLLBACK;
