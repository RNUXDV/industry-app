"""Test isolated Git trees; no remote or database access."""
import hashlib
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
CHECK = ROOT / 'tests/check-security-migration-pair.py'
PRECURSOR = 'supabase/migrations/20261024194900_normalize_fresh_pilot_permissions.sql'
LATER = 'supabase/migrations/20261024195000_reconcile_pilot_security_controls.sql'
DIGEST = 'af3625e02c25b2cbd7bde8f586261c81a26e44dfc83bf4af8d45b8a975b6ea87'


class PublicationGuard(unittest.TestCase):
    def check_tree(self, precursor, later=True, working_copy=None, expected=1):
        with tempfile.TemporaryDirectory(prefix='industry-pair-') as folder:
            root = Path(folder)
            subprocess.run(['git', 'init', '-q', folder], check=True)
            for name, body in [(PRECURSOR, precursor), (LATER, b'-- fixture\n' if later else None)]:
                if body is not None:
                    path = root / name
                    path.parent.mkdir(parents=True, exist_ok=True)
                    path.write_bytes(body)
            subprocess.run(['git', 'add', '-A'], cwd=root, check=True)
            tree = subprocess.check_output(['git', 'write-tree'], cwd=root, text=True).strip()
            if working_copy is not None:
                path = root / PRECURSOR
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(working_copy)
            result = subprocess.run(['python3', str(CHECK), tree], cwd=root,
                                    capture_output=True, text=True)
            self.assertEqual(result.returncode, expected, result.stdout + result.stderr)
            if expected:
                self.assertIn('STOP:', result.stderr)

    def test_missing_even_with_valid_working_copy(self):
        self.check_tree(None, working_copy=(ROOT / PRECURSOR).read_bytes())

    def test_empty(self):
        self.check_tree(b'')

    def test_edited_even_with_valid_working_copy(self):
        self.check_tree((ROOT / PRECURSOR).read_bytes() + b'\n',
                        working_copy=(ROOT / PRECURSOR).read_bytes())

    def test_valid_pair_even_with_edited_working_copy(self):
        self.check_tree((ROOT / PRECURSOR).read_bytes(), working_copy=b'edited', expected=0)

    def test_neither_migration(self):
        self.check_tree(None, later=False, expected=0)

    def test_valid_precursor_alone(self):
        # Ordered precursor-first history is allowed; reconciliation alone is not.
        self.check_tree((ROOT / PRECURSOR).read_bytes(), later=False, expected=0)

    def test_invalid_precursor_alone(self):
        self.check_tree(b'edited', later=False)

    def test_invalid_ref(self):
        result = subprocess.run(['python3', str(CHECK), 'refs/heads/does-not-exist'],
                                cwd=ROOT, capture_output=True, text=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('STOP:', result.stderr)

    def test_reviewed_source_digest(self):
        self.assertEqual(hashlib.sha256((ROOT / PRECURSOR).read_bytes()).hexdigest(), DIGEST)


if __name__ == '__main__':
    unittest.main()
