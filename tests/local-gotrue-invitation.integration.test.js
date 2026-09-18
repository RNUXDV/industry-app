const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const crypto = require("node:crypto");
const test = require("node:test");

const workplaceId = "61c73d13-6c59-4031-a512-b38c570921b1";
const consentVersion = "pilot-privacy-v1";

function readLocalSupabaseEnvironment() {
  let output;

  try {
    output = execFileSync("supabase", ["status", "-o", "env"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      env: { ...process.env, SUPABASE_TELEMETRY_DISABLED: "1" },
    });
  } catch {
    throw new Error(
      "Local Supabase is unavailable. Start it, then rerun this test.",
    );
  }

  const values = {};
  output.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) return;
    values[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  });

  const apiUrl = values.API_URL;
  const anonKey = values.ANON_KEY || values.PUBLISHABLE_KEY;
  const serviceKey = values.SERVICE_ROLE_KEY || values.SECRET_KEY;

  if (!apiUrl || !anonKey || !serviceKey) {
    throw new Error("Local Supabase status did not return the required runtime values.");
  }

  return { apiUrl, anonKey, serviceKey };
}

const local = readLocalSupabaseEnvironment();
const cleanup = { invitationIds: [], userIds: [] };

async function request(path, { key = local.anonKey, token, method = "GET", body } = {}) {
  const headers = {
    apikey: key,
    Authorization: `Bearer ${token || key}`,
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(`${local.apiUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function newIdentity(label) {
  const nonce = crypto.randomBytes(8).toString("hex");
  return {
    email: `industry-${label}-${nonce}@example.test`,
    password: crypto.randomBytes(24).toString("base64url"),
  };
}

async function createInvitation(email) {
  const response = await request("/rest/v1/rpc/create_pilot_manager_invitation", {
    key: local.serviceKey,
    method: "POST",
    body: {
      target_workplace_id: workplaceId,
      target_email: email,
      volunteer_confirmed: true,
    },
  });

  assert.equal(response.status, 200, "local invitation fixture should be created");
  const rows = await response.json();
  assert.equal(rows.length, 1);
  cleanup.invitationIds.push(rows[0].invitation_id);

  return rows[0].invite_token;
}

async function signup(identity, consent = true) {
  return request("/auth/v1/signup", {
    method: "POST",
    body: {
      email: identity.email,
      password: identity.password,
      data: {
        full_name: "Local Invitation Test",
        pilot_consent_acknowledged: consent,
        pilot_consent_version: consentVersion,
      },
    },
  });
}

test.after(async () => {
  // Remove invitation rows before Auth identities. Accepted invitations retain
  // a profile reference, so this order avoids leaving local-only test users.
  for (const invitationId of cleanup.invitationIds) {
    await request(`/rest/v1/pilot_invitations?id=eq.${encodeURIComponent(invitationId)}`, {
      key: local.serviceKey,
      method: "DELETE",
    });
  }

  for (const userId of cleanup.userIds) {
    await request(`/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
      key: local.serviceKey,
      method: "DELETE",
    });
  }
});

test("Local GoTrue rejects uninvited and unconsented signup", async () => {
  const uninvited = newIdentity("uninvited");
  const uninvitedResponse = await signup(uninvited);
  assert.equal(uninvitedResponse.status, 403);

  const unconsented = newIdentity("unconsented");
  await createInvitation(unconsented.email);
  const unconsentedResponse = await signup(unconsented, false);
  assert.equal(unconsentedResponse.status, 403);
});

test("Local GoTrue permits invited signup and existing-user invitation acceptance", async () => {
  const invited = newIdentity("invited");
  await createInvitation(invited.email);

  const signupResponse = await signup({
    ...invited,
    email: invited.email.toUpperCase(),
  });
  assert.equal(signupResponse.status, 200);

  const signupData = await signupResponse.json();
  assert.ok(signupData.user?.id);
  assert.ok(signupData.access_token);
  cleanup.userIds.push(signupData.user.id);

  const secondToken = await createInvitation(invited.email);
  const acceptanceResponse = await request("/rest/v1/rpc/accept_pilot_invitation", {
    token: signupData.access_token,
    method: "POST",
    body: {
      invite_token: secondToken,
      consent_acknowledged: true,
      consent_version: consentVersion,
    },
  });
  assert.equal(acceptanceResponse.status, 200);

  const reusedResponse = await request("/rest/v1/rpc/accept_pilot_invitation", {
    token: signupData.access_token,
    method: "POST",
    body: {
      invite_token: secondToken,
      consent_acknowledged: true,
      consent_version: consentVersion,
    },
  });
  assert.ok(reusedResponse.status >= 400);
});

test("Local password recovery remains available without account enumeration output", async () => {
  const identity = newIdentity("recovery");
  await createInvitation(identity.email);
  const signupResponse = await signup(identity);
  assert.equal(signupResponse.status, 200);
  const signupData = await signupResponse.json();
  cleanup.userIds.push(signupData.user.id);

  const response = await request("/auth/v1/recover", {
    method: "POST",
    body: {
      email: identity.email,
      redirect_to: "http://127.0.0.1:3000/",
    },
  });

  assert.equal(response.status, 200);
});
