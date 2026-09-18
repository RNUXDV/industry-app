const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "..");
const scriptSource = fs.readFileSync(
  path.join(projectRoot, "script.js"),
  "utf8",
);
const peopleSource = fs.readFileSync(
  path.join(projectRoot, "people-pages.js"),
  "utf8",
);
const indexSource = fs.readFileSync(
  path.join(projectRoot, "index.html"),
  "utf8",
);
const configSource = fs.readFileSync(
  path.join(projectRoot, "supabase", "config.toml"),
  "utf8",
);
const accessMigrationSource = fs.readFileSync(
  path.join(
    projectRoot,
    "supabase",
    "migrations",
    "20260918120000_add_pilot_access_controls.sql",
  ),
  "utf8",
);
const localAuthTestSource = fs.readFileSync(
  path.join(projectRoot, "tests", "local-gotrue-invitation.integration.test.js"),
  "utf8",
);
const { escapeHtml } = require(path.join(projectRoot, "security.js"));

test("escapeHtml neutralizes stored-XSS payloads in text and attributes", () => {
  const payload = `<img src=x onerror="alert('pilot')"> & goodbye`;

  assert.equal(
    escapeHtml(payload),
    "&lt;img src=x onerror=&quot;alert(&#39;pilot&#39;)&quot;&gt; &amp; goodbye",
  );
});

test("escapeHtml handles nullish values without emitting executable markup", () => {
  assert.equal(escapeHtml(null), "");
  assert.equal(escapeHtml(undefined), "");
});

test("the security helper loads before the application", () => {
  const securityPosition = indexSource.indexOf('src="security.js');
  const applicationPosition = indexSource.indexOf('src="script.js');

  assert.notEqual(securityPosition, -1);
  assert.notEqual(applicationPosition, -1);
  assert.ok(securityPosition < applicationPosition);
});

test("sensitive browser debug logging is absent", () => {
  [scriptSource, peopleSource].forEach((source) => {
    assert.doesNotMatch(source, /console\.(?:log|warn|error|debug)\s*\(/);
  });
});

test("backend and user-controlled values use escaped rendering", () => {
  const requiredEscapedExpressions = [
    "escapeHtml(member.name)",
    "escapeHtml(member.role || \"Role not set\")",
    "escapeHtml(shift.workerName)",
    "escapeHtml(shift.workplace)",
    "escapeHtml(shift.role)",
    "escapeHtml(activity.message)",
    "escapeHtml(offer.sender_name)",
    "escapeHtml(offer.recipient_name)",
    "escapeHtml(entry.notes)",
  ];

  requiredEscapedExpressions.forEach((expression) => {
    assert.ok(
      scriptSource.includes(expression),
      `Expected application rendering to include ${expression}`,
    );
  });

  const knownUnsafeExpressions = [
    "<h3>${member.name}</h3>",
    "<h3>${shift.workerName}</h3>",
    "<h3>${shift.workplace}</h3>",
    "<h3>${offer.sender_name",
    "<h3>${activity.message}</h3>",
    "${entry.notes}</p>",
  ];

  knownUnsafeExpressions.forEach((expression) => {
    assert.equal(
      scriptSource.includes(expression),
      false,
      `Unsafe rendering expression remains: ${expression}`,
    );
  });
});

test("sensitive actions provide generic visible failure messages", () => {
  const requiredMessages = [
    "We couldn't start this shift. Please try again.",
    "We couldn't end this shift. Please try again.",
    "We couldn't record your interest. Please try again.",
    "We couldn't withdraw your interest. Please try again.",
    "We couldn't cancel this coverage request. Please try again.",
    "We couldn't select this coworker. Please try again.",
    "We couldn't approve this coverage request. Please try again.",
    "We couldn't approve this direct offer. Please try again.",
    "We couldn't update this direct offer. Please try again.",
  ];

  requiredMessages.forEach((message) => {
    assert.ok(
      scriptSource.includes(message),
      `Expected a visible generic failure message: ${message}`,
    );
  });

  assert.match(scriptSource, /function showActionFailure\(target, message\)/);
  assert.match(scriptSource, /target\.textContent = message/);
  assert.doesNotMatch(
    scriptSource,
    /showActionFailure\([^)]*,\s*(?:error|\w+Error)\.message/s,
  );
});

test("Auth signup is backed by the local invitation-and-consent hook", () => {
  assert.match(configSource, /\[auth\.hook\.before_user_created\][\s\S]*enabled = true/);
  assert.match(
    configSource,
    /pg-functions:\/\/postgres\/public\/enforce_pilot_invitation_before_user_created/,
  );
  assert.match(
    accessMigrationSource,
    /normalized_email text := lower\(trim\(coalesce\(input -> 'user' ->> 'email'/,
  );
  assert.match(accessMigrationSource, /volunteer_confirmed_at is not null/);
  assert.match(accessMigrationSource, /consent_version <> 'pilot-privacy-v1'/);
  assert.match(
    accessMigrationSource,
    /grant execute on function public\.enforce_pilot_invitation_before_user_created\(jsonb\) to supabase_auth_admin/,
  );
});

test("the browser cannot choose workplace or authorization during acceptance", () => {
  const acceptanceCall = scriptSource.match(
    /supabaseClient\.rpc\("accept_pilot_invitation", \{[\s\S]*?\}\);/,
  )?.[0];

  assert.ok(acceptanceCall);
  assert.match(acceptanceCall, /invite_token/);
  assert.match(acceptanceCall, /consent_acknowledged/);
  assert.match(acceptanceCall, /consent_version/);
  assert.doesNotMatch(acceptanceCall, /workplace|role|status/);
  assert.match(
    accessMigrationSource,
    /invitation\.workplace_id, current_profile_id, invitation\.role/,
  );
  assert.match(
    accessMigrationSource,
    /normalized_role not in \([\s\S]*'Server'[\s\S]*'Other'/,
  );
});

test("membership authorization and lifecycle checks require active state", () => {
  assert.match(
    scriptSource,
    /\.eq\("membership_status", "active"\)/,
  );
  assert.match(
    accessMigrationSource,
    /workplace_members_one_active_workplace_per_profile_idx/,
  );
  assert.match(
    accessMigrationSource,
    /pilot_invitations_one_unresolved_email_per_workplace_idx/,
  );
  assert.match(
    accessMigrationSource,
    /create policy "Active members can view their workplaces"/,
  );
  assert.match(
    accessMigrationSource,
    /create trigger require_active_membership_for_shift_writes/,
  );
  assert.match(accessMigrationSource, /create or replace function public\.leave_pilot\(\)/);
  assert.match(
    accessMigrationSource,
    /create or replace function public\.remove_workplace_member\(target_profile_id uuid\)/,
  );
  assert.match(
    accessMigrationSource,
    /perform 1 from public\.workplaces[\s\S]*?for update;/,
  );
  assert.match(
    accessMigrationSource,
    /revoke insert, update, delete on table public\.workplace_members\s+from anon, authenticated;/,
  );
  assert.match(
    accessMigrationSource,
    /revoke all on table public\.pilot_invitations from anon, authenticated;/,
  );
  assert.match(
    accessMigrationSource,
    /revoke all on function public\.create_pilot_manager_invitation\(uuid, text, boolean\)\s+from public, anon, authenticated;/,
  );
  assert.match(
    accessMigrationSource,
    /grant execute on function public\.create_pilot_manager_invitation\(uuid, text, boolean\) to service_role;/,
  );
});

test("authentication and invitation UI never renders raw backend messages", () => {
  assert.doesNotMatch(scriptSource, /(?:error|\w+Error)\?*\.message/);
  [
    "We couldn't sign you in. Check your details and try again.",
    "We couldn't finish signup here. Check the private invitation, or sign in if you already have an account.",
    "If an account exists for that email, a reset link has been sent.",
    "We couldn't accept this invitation. Check the private link and signed-in email, then try again.",
  ].forEach((message) => assert.ok(scriptSource.includes(message)));
  assert.doesNotMatch(scriptSource, /Account created\. Confirm your email/);
});

test("consent and departure controls clearly preserve voluntary participation", () => {
  assert.match(indexSource, /Joining this pilot is optional/);
  assert.match(indexSource, /unrelated to employment decisions/);
  assert.match(indexSource, /id="pilot-consent-checkbox"/);
  assert.match(indexSource, /id="manager-volunteer-confirmed"/);
  assert.match(indexSource, /id="leave-pilot-button"/);
  assert.match(indexSource, /does not delete your Industry account/);
});

test("the real Local GoTrue test discovers credentials without printing them", () => {
  assert.match(localAuthTestSource, /supabase", \["status", "-o", "env"\]/);
  assert.match(localAuthTestSource, /stdio: \["ignore", "pipe", "ignore"\]/);
  assert.doesNotMatch(localAuthTestSource, /console\.(?:log|warn|error|debug)/);
  assert.doesNotMatch(localAuthTestSource, /response\.text\(|JSON\.stringify\(local/);
  assert.match(localAuthTestSource, /\/auth\/v1\/signup/);
  assert.match(localAuthTestSource, /\/auth\/v1\/recover/);
});
