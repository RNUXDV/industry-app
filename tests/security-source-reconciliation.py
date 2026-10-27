"""Explicitly invoked isolated-PostgreSQL migration tests. Never connects by URL.
Usage: python3 tests/security-source-reconciliation.py CONTAINER DATABASE
Requires disposable model label, network none, no ports/bind mounts; candidate installed. Every migration probe is rolled back, even on the wrong starting state.
"""
from pathlib import Path
import sys,json,subprocess
root=Path(__file__).resolve().parents[1]
container,database=sys.argv[1:]
i=json.loads(subprocess.check_output(['docker','inspect',container]))[0]
assert i['Config']['Labels'].get('industry.security.model')=='source-reconciliation'
assert i['HostConfig']['NetworkMode']=='none' and not i['HostConfig']['PortBindings']
assert not i['HostConfig'].get('Binds')
assert database.startswith('industry_')
migration=(root/'supabase/migrations/20261024195000_reconcile_pilot_security_controls.sql').read_text()
def run(sql,user='postgres'):
 return subprocess.run(['docker','exec','-i',container,'psql','-XqAt','-U',user,'-d',database,'-v','ON_ERROR_STOP=1'],input=sql,text=True,capture_output=True)
def ok(sql,user='postgres'):
 r=run(sql,user);assert r.returncode==0,r.stderr;return r
# Snapshot full public function definitions/ACLs, relation/column ACLs, triggers,
# constraints and defaults before/after adoption, not merely its notice text.
q="""SET search_path=pg_catalog,public;
SELECT jsonb_build_object(
 'functions',(SELECT jsonb_agg(jsonb_build_array(p.oid,pg_get_functiondef(p.oid),p.proacl) ORDER BY p.oid) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.prokind='f'),
 'relations',(SELECT jsonb_agg(jsonb_build_array(c.oid,c.relacl) ORDER BY c.oid) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public'),
 'columns',(SELECT jsonb_agg(jsonb_build_array(a.attrelid,a.attnum,a.attacl) ORDER BY a.attrelid,a.attnum) FROM pg_attribute a JOIN pg_class c ON c.oid=a.attrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND a.attnum>0),
 'defaults',(SELECT jsonb_agg(to_jsonb(d) ORDER BY d.oid) FROM pg_default_acl d),
 'triggers',(SELECT jsonb_agg(jsonb_build_array(t.oid,pg_get_triggerdef(t.oid),t.tgenabled) ORDER BY t.oid) FROM pg_trigger t WHERE NOT t.tgisinternal),
 'constraints',(SELECT jsonb_agg(jsonb_build_array(c.oid,pg_get_constraintdef(c.oid)) ORDER BY c.oid) FROM pg_constraint c));"""
before=ok(q).stdout
adopt=ok('BEGIN;\n'+migration+'ROLLBACK;')
after=ok(q).stdout
assert after==before, 'Adoption probe changed metadata despite rollback'
assert 'no DDL executed' in adopt.stderr, 'Candidate required; baseline probe rolled back safely'
cases=[
 ('membership-function','ALTER FUNCTION public.is_active_workplace_member(uuid,uuid) SET search_path=public;'),
 ('invitation-function','ALTER FUNCTION public.accept_pilot_invitation(text,boolean,text) SET search_path=public;'),
 ('creator-owner','ALTER FUNCTION public.enforce_shift_creator_attribution() OWNER TO authenticated;'),
 ('creator-execute','GRANT EXECUTE ON FUNCTION public.enforce_shift_creator_attribution() TO authenticated;'),
 ('helper-service-execute','GRANT EXECUTE ON FUNCTION public.is_active_workplace_member(uuid,uuid) TO service_role;'),
 ('table-truncate','GRANT TRUNCATE ON public.profiles TO anon;'),
 ('table-reference','GRANT REFERENCES ON public.shifts TO authenticated;'),
 ('default-maintain','ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT MAINTAIN ON TABLES TO anon;'),
 ('global-default','ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT TRUNCATE ON TABLES TO anon;'),
 ('column-acl','GRANT UPDATE(full_name) ON public.profiles TO authenticated;'),
 ('trigger-disabled','ALTER TABLE public.shifts DISABLE TRIGGER enforce_shift_creator_attribution;'),
 ('trigger-missing','DROP TRIGGER enforce_shift_creator_attribution ON public.shifts;'),
 ('creator-function-missing','DROP TRIGGER enforce_shift_creator_attribution ON public.shifts; DROP FUNCTION public.enforce_shift_creator_attribution();'),
 ('creator-fk','ALTER TABLE public.shifts DROP CONSTRAINT shifts_manager_profile_id_fkey;'),
 ('unexpected-overload',"CREATE FUNCTION public.is_active_workplace_member(text) RETURNS boolean LANGUAGE sql AS $$SELECT true$$;"),
]
for tag,mutation in cases:
 result=run('BEGIN;\n'+mutation+'\nSET LOCAL ROLE postgres;\n'+migration+'ROLLBACK;','supabase_admin')
 assert result.returncode!=0 and 'STOP:' in result.stderr,(tag,result.stderr)
assert ok(q).stdout==before
# An unrelated public function is deliberately outside this migration's managed scope.
result=ok('BEGIN; CREATE FUNCTION public.unrelated_reconciliation_probe() RETURNS int LANGUAGE sql AS $$SELECT 1$$; SET LOCAL ROLE postgres;\n'+migration+'ROLLBACK;','supabase_admin')
assert 'no DDL executed' in result.stderr
print(json.dumps({'candidate_adoption_no_ddl':'no DDL executed' in adopt.stderr,'metadata_preserved':after==before,'adoption_probe_rolled_back':True,'drift_rejections':len(cases),'unrelated_function_allowed':True,'container_network':'none','database':database,'cases':[x[0] for x in cases]},indent=2))
