# Security migration pair

Keep these migrations together in any published tip containing the reconciliation:

1. `20261024194900_normalize_fresh_pilot_permissions.sql`
2. `20261024195000_reconcile_pilot_security_controls.sql`

The precursor normalizes a recognized empty local bootstrap and fails closed for unknown states. Verified baseline/candidate states may take a no-op path. The reconciliation applies or recognizes the reviewed application controls. Do not edit historical migration files to bypass either guard.

The exact fresh-bootstrap families are pinned to Supabase CLI 2.116.0 with image `public.ecr.aws/supabase/postgres:17.6.1.165`, and CLI 2.122.0 with image `public.ecr.aws/supabase/postgres:17.11.0.006`. Each complete platform fingerprint set must match one family as a unit; mixing categories from the two families fails closed. Other versions are unsupported until separately validated. An upgrade can change metadata and cause STOP; review a new disposable capture and rerun compatibility tests rather than weakening the checks.

Use a separately named disposable local stack with no retained records for reset tests. Reset destroys local data. Preserve existing development databases until their contents and recovery needs have been checked under an explicit rebuild plan. Do not use a reset to repair a durable or hosted environment.

For local source verification:

```text
python3 tests/test-security-migration-pair.py
python3 tests/check-security-migration-pair.py HEAD
```

The publication checker reads the proposed Git tree and verifies the precursor's reviewed SHA-256. Run the check against the committed tip or the exact prospective Git tree being reviewed. The read-only CI workflow checks push, pull request and merge-group trees. It does not deploy a website, connect to a database or apply migrations. A local hook is bypassable; CI must be required through repository rules and guarded-file changes must receive review.

Validation results for each pinned pair must be reviewed before publication; a different CLI or image requires a new disposable compatibility run. Publication of source code does not authorize a database deployment. Before any hosted adoption, separately review the target's current metadata, ledger and shared guard requirements, validate the push path in a disposable environment, and authorize a controlled change window. Do not bypass STOP with implicit ledger repair or include-all flags.

Complete review of the outgoing files/history, CI enforcement and publishing destination before authorizing publication. Consider existing website publishing settings before merging to a publishing branch.

Reference snapshots and the fingerprint generator are maintained outside this repository.

The hosted-model ACL conformance suite is explicitly invoked, not part of default discovery or CI. The legacy-fixture and reconciliation harnesses require a disposable PostgreSQL model bearing the expected model label, network none and no published ports or host bind mounts; they are not general full-stack runners. Their fixture/model checks intentionally reject other environments. The published legacy harness is the original isolated-model version, not an adapted full-stack harness. These sources document their scoped verification and require separately prepared synthetic prerequisites; do not point them at a hosted database.

The precursor keeps exact application and shared safety checks. After recognizing one complete platform family, it preserves that family's platform metadata except for the three intended postgres/public default-row removals. Recognizing an existing platform ACL or grant option does not create or grant it. STOP diagnostics name mismatched categories and families; notices identify the matched fresh family.

The reviewed precursor SHA-256 for this proposal is `af3625e02c25b2cbd7bde8f586261c81a26e44dfc83bf4af8d45b8a975b6ea87`. Keep the checker and its tests synchronized only after review. The CI workflow currently runs Python guard fixtures and tree-integrity checks; it does not run SQL suite 004 or a database reset.

The precursor explicitly uses `COLLATE "C"` for canonical fingerprint ordering, API-role ordering and sorted ACL text within snapshot rows. Its previously captured metadata families and permission operations are unchanged. The separate reconciliation retains its independently reviewed bytes and its original comparison logic; this change does not claim to remove locale assumptions from that migration.
