"""Read-only publication gate for the proposed Git tip, never working files.
This local hook is bypassable. Deployment inspection and CI enforcement are separate gates.
"""
import hashlib
import subprocess
import sys

PRECURSOR = 'supabase/migrations/20261024194900_normalize_fresh_pilot_permissions.sql'
RECONCILIATION = 'supabase/migrations/20261024195000_reconcile_pilot_security_controls.sql'
REVIEWED_PRECURSOR_SHA256 = 'af3625e02c25b2cbd7bde8f586261c81a26e44dfc83bf4af8d45b8a975b6ea87'


def check(ref):
    names = subprocess.check_output(
        ['git', 'ls-tree', '-r', '--name-only', ref], text=True).splitlines()
    if PRECURSOR in names:
        data = subprocess.check_output(['git', 'show', ref + ':' + PRECURSOR])
        if hashlib.sha256(data).hexdigest() != REVIEWED_PRECURSOR_SHA256:
            raise ValueError('precursor committed bytes differ from the reviewed SHA-256')
    if RECONCILIATION in names and PRECURSOR not in names:
        raise ValueError('security reconciliation requires its reviewed fresh-permission precursor')


if __name__ == '__main__':
    ref = sys.argv[1] if len(sys.argv) > 1 else 'HEAD'
    try:
        check(ref)
    except (ValueError, subprocess.CalledProcessError) as exc:
        print('STOP: ' + str(exc), file=sys.stderr)
        sys.exit(1)
    print('Migration-pair and precursor SHA-256 publication gate passed for ' + ref)
