"""Run unchanged legacy SQL 001/002 with disposable synthetic prerequisites.
Usage: python3 tests/legacy-security-fixtures.py CONTAINER DATABASE OUTPUT_DIRECTORY
Original suite IDs/emails are remapped in memory; no seed or hosted records loaded.
Both suites and fixtures run in one rolled-back transaction each. No assertions edited.
"""
# Synthetic prerequisites only; original suites are not edited on disk.
from pathlib import Path
import subprocess,re,json,uuid,sys,hashlib
r=Path(__file__).resolve().parents[1]
container,database,output=sys.argv[1:]
o=Path(output).resolve();o.mkdir(parents=True,exist_ok=True)
legacy=(r/'supabase/tests/002_pilot_access_controls.test.sql').read_text()
# Discover the four legacy fixture identities from JWT assertions; never load seed passwords.
identities=list(dict.fromkeys(re.findall(r'"sub":"([0-9a-f-]{36})"',legacy)))
assert len(identities)==4
home=re.search(r"where workplace_id = '([0-9a-f-]{36})'\s+and profile_id",legacy).group(1)
result=[]
i=json.loads(subprocess.check_output(['docker','inspect',container]))[0]
assert i['Config']['Labels'].get('industry.security.model')=='source-reconciliation'
assert i['HostConfig']['NetworkMode']=='none' and not i['HostConfig']['PortBindings'] and not i['HostConfig'].get('Binds')
assert database.startswith('industry_')
def snapshot_counts():
 tables=['auth.users']+['public.'+name for name in ['coverage_events','direct_shift_offers','pilot_audit_aggregates','pilot_audit_events','pilot_invitations','profiles','shift_interests','shifts','workplace_members','workplace_observers','workplace_participant_codes','workplace_pilot_settings','workplace_shift_codes','workplaces']]
 query="SELECT jsonb_object_agg(name,cnt) FROM ("+' UNION ALL '.join("SELECT '"+table+"' AS name,count(*) AS cnt FROM "+table for table in tables)+") q;"
 x=subprocess.run(['docker','exec','-i',container,'psql','-XqAt','-U','supabase_admin','-d',database,'-v','ON_ERROR_STOP=1'],input=query,text=True,capture_output=True)
 assert x.returncode==0,x.stderr
 return json.loads(x.stdout)
for f in sorted((r/'supabase/tests').glob('00[12]*.sql')):
 original_bytes=f.read_bytes();original_sha=hashlib.sha256(original_bytes).hexdigest();before_counts=snapshot_counts()
 sql=original_bytes.decode();assert sql.rstrip().lower().endswith('rollback;'), 'Suite must explicitly end with ROLLBACK'
 ids=set(re.findall(r'[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}',sql))|set(identities)|{home};mapping={x:str(uuid.uuid4()) for x in ids}
 emails=set(re.findall(r'[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+',sql));canonical={x.lower():j for j,x in enumerate(sorted({e.lower() for e in emails}))};em={x:(f'fixture-{canonical[x.lower()]}@example.invalid'.upper() if any(c.isupper() for c in x) else f'fixture-{canonical[x.lower()]}@example.invalid') for x in emails}
 setup='BEGIN; SET LOCAL search_path=public,extensions,pg_temp;\n'
 for j,x in enumerate(identities):
  setup+=f"INSERT INTO auth.users(id,email,raw_user_meta_data) VALUES ('{mapping[x]}','fixture-user-{j}@example.invalid','{{}}');\n"
 setup+=f"INSERT INTO public.workplaces(id,name,time_zone,created_by) VALUES ('{mapping[home]}','Synthetic Legacy Suite','UTC','{mapping[identities[0]]}');\n"
 for j,x in enumerate(identities):
  role='Manager' if j==0 else 'Server'
  setup+=f"INSERT INTO public.workplace_members(workplace_id,profile_id,role) VALUES ('{mapping[home]}','{mapping[x]}','{role}');\n"
 if f.name.startswith('002_'):
  # The suite creates a direct offer by selecting an existing sender shift.
  # Without it INSERT...SELECT inserts zero rows and removal succeeds too early.
  setup+=f"INSERT INTO public.shifts(workplace_id,assigned_profile_id,manager_profile_id,role,starts_at,ends_at,status) VALUES ('{mapping[home]}','{mapping[identities[1]]}','{mapping[identities[0]]}','Server',now()+interval '2 days',now()+interval '2 days 8 hours','scheduled');\n"
 # Fail closed if setup silently omitted any required synthetic prerequisite.
 user_ids=','.join("'"+mapping[x]+"'" for x in identities)
 setup+=f"DO $fixture_sanity$ BEGIN IF (SELECT count(*) FROM auth.users WHERE id IN ({user_ids}))<>4 OR (SELECT count(*) FROM public.workplace_members WHERE workplace_id='{mapping[home]}' AND profile_id IN ({user_ids}) AND membership_status='active')<>4 THEN RAISE EXCEPTION 'Incomplete synthetic identity/membership fixtures'; END IF; END $fixture_sanity$;\n"
 if f.name.startswith('002_'):
  setup+=f"DO $sender_sanity$ BEGIN IF (SELECT count(*) FROM public.shifts WHERE workplace_id='{mapping[home]}' AND assigned_profile_id='{mapping[identities[1]]}')<>1 THEN RAISE EXCEPTION 'Synthetic sender shift prerequisite missing'; END IF; END $sender_sanity$;\n"
 for x,y in mapping.items():sql=sql.replace(x,y)
 # Keep each suite's synthetic email equality tests internally consistent.
 for x,y in sorted(em.items(),key=lambda t:-len(t[0])):sql=sql.replace(x,y)
 if f.name.startswith('002_'):
  point=f"from public.shifts as shift_row\nwhere shift_row.assigned_profile_id = '{mapping[identities[1]]}'\nlimit 1;"
  assert sql.count(point)==1, 'Direct-offer fixture statement changed; review required'
  sql=sql.replace(point,point+f"\nDO $offer_sanity$ BEGIN IF (SELECT count(*) FROM public.direct_shift_offers WHERE sender_profile_id='{mapping[identities[1]]}' AND recipient_profile_id='{mapping[identities[3]]}' AND status='pending')<>1 THEN RAISE EXCEPTION 'Direct-offer fixture insert did not create one pending offer'; END IF; END $offer_sanity$;")
 # After the suite's ROLLBACK, an implicit read-only probe must have no assigned transaction ID.
 sql+="\nSELECT 'FIXTURE_ROLLBACK_PROBE:' || json_build_object('unassigned_transaction',txid_current_if_assigned() IS NULL)::text;\n"
 x=subprocess.run(['docker','exec','-i',container,'psql','-XqAt','-U','supabase_admin','-d',database,'-v','ON_ERROR_STOP=1'],input=setup+sql,text=True,capture_output=True)
 (o/(f.name+'.synthetic.result.txt')).write_text(x.stdout+'\n'+x.stderr)
 after_counts=snapshot_counts();after_sha=hashlib.sha256(f.read_bytes()).hexdigest()
 probes=[line.split('FIXTURE_ROLLBACK_PROBE:',1)[1] for line in x.stdout.splitlines() if line.startswith('FIXTURE_ROLLBACK_PROBE:')]
 rollback_probe=bool(probes) and json.loads(probes[-1])['unassigned_transaction'] is True
 cleaned=after_counts==before_counts
 result.append({'suite':f.name,'exit_code':x.returncode,'passed_assertions':len(re.findall(r'^ok \d+',x.stdout,re.M)),'failed_assertions':len(re.findall(r'^not ok \d+',x.stdout,re.M)),'original_suite_modified_on_disk':after_sha!=original_sha,'original_suite_sha256':original_sha,'in_memory_random_uuid_and_synthetic_email_remap':True,'fixtures_transaction_rolled_back':rollback_probe and cleaned,'rollback_probe_unassigned_transaction':rollback_probe,'before_fixture_counts':before_counts,'after_fixture_counts':after_counts,'fixture_sanity_checks_completed':x.returncode==0})
 assert after_sha==original_sha and cleaned and rollback_probe, 'Source or rollback verification failed'
(o/'SYNTHETIC-LEGACY-SQL-RESULTS.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))

assert all(x['exit_code']==0 and x['failed_assertions']==0 for x in result), 'Legacy SQL suite failed; inspect result logs'
assert [x['passed_assertions'] for x in result]==[41,49], 'Incomplete legacy SQL assertion count'
