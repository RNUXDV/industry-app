const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const crypto = require("node:crypto");
const test = require("node:test");

const workplaceId = "61c73d13-6c59-4031-a512-b38c570921b1";

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
    throw new Error("Local Supabase status did not return required runtime values.");
  }
  return { apiUrl, anonKey, serviceKey };
}

const local = readLocalSupabaseEnvironment();
const fixture = {
  invitationId: null,
  userId: null,
};

async function request(
  path,
  { key = local.anonKey, token, method = "GET", body } = {},
) {
  const headers = {
    apikey: key,
    Authorization: `Bearer ${token || key}`,
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  return fetch(`${local.apiUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function serviceRpc(name, body) {
  return request(`/rest/v1/rpc/${name}`, {
    key: local.serviceKey,
    method: "POST",
    body,
  });
}

test.after(async () => {
  if (fixture.invitationId) {
    await request(
      `/rest/v1/pilot_invitations?id=eq.${encodeURIComponent(fixture.invitationId)}`,
      { key: local.serviceKey, method: "DELETE" },
    );
  }
  if (fixture.userId) {
    await request(`/auth/v1/admin/users/${encodeURIComponent(fixture.userId)}`, {
      key: local.serviceKey,
      method: "DELETE",
    });
  }
});

test("real Local Auth enforces observer isolation, safe reads, and immediate revocation", async () => {
  const nonce = crypto.randomBytes(8).toString("hex");
  const identity = {
    email: `industry-observer-${nonce}@example.test`,
    password: crypto.randomBytes(24).toString("base64url"),
  };

  // A local-only invitation satisfies the existing Auth creation hook. The
  // account never accepts it and therefore never becomes a workplace member.
  const invitationResponse = await serviceRpc("create_pilot_manager_invitation", {
    target_workplace_id: workplaceId,
    target_email: identity.email,
    volunteer_confirmed: true,
  });
  assert.equal(invitationResponse.status, 200);
  const invitationRows = await invitationResponse.json();
  fixture.invitationId = invitationRows[0].invitation_id;

  const createResponse = await request("/auth/v1/admin/users", {
    key: local.serviceKey,
    method: "POST",
    body: {
      email: identity.email,
      password: identity.password,
      email_confirm: true,
      user_metadata: {
        full_name: "Local Observer Test",
        pilot_consent_acknowledged: true,
        pilot_consent_version: "pilot-privacy-v1",
      },
    },
  });
  assert.equal(createResponse.status, 200);
  const created = await createResponse.json();
  fixture.userId = created.id || created.user?.id;
  assert.ok(fixture.userId);

  const grantResponse = await serviceRpc("grant_pilot_observer", {
    target_workplace_id: workplaceId,
    target_profile_id: fixture.userId,
  });
  assert.equal(grantResponse.status, 200);

  const signInResponse = await request("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: identity,
  });
  assert.equal(signInResponse.status, 200);
  const session = await signInResponse.json();
  assert.ok(session.access_token);

  const authorizationResponse = await request(
    "/rest/v1/rpc/list_my_observer_workplaces",
    { token: session.access_token, method: "POST", body: {} },
  );
  assert.equal(authorizationResponse.status, 200);
  const authorizations = await authorizationResponse.json();
  assert.equal(authorizations.length, 1);
  assert.equal(authorizations[0].workplace_id, workplaceId);
  assert.match(authorizations[0].observer_code, /^O-[A-F0-9]{12}$/);

  const summaryResponse = await request(
    "/rest/v1/rpc/get_pilot_monitor_summary",
    {
      token: session.access_token,
      method: "POST",
      body: { target_workplace_id: workplaceId },
    },
  );
  assert.equal(summaryResponse.status, 200);
  const summary = await summaryResponse.json();
  assert.equal(typeof summary.participants.active, "number");

  const eventsResponse = await request(
    "/rest/v1/rpc/list_pilot_monitor_events",
    {
      token: session.access_token,
      method: "POST",
      body: {
        target_workplace_id: workplaceId,
        event_type_filter: null,
        outcome_filter: null,
        since_filter: null,
        result_limit: 100,
      },
    },
  );
  assert.equal(eventsResponse.status, 200);
  const events = await eventsResponse.json();
  const serializedEvents = JSON.stringify(events).toLowerCase();
  ["email", "password", "token", "full_name", "phone", "notes"].forEach(
    (forbidden) => assert.equal(serializedEvents.includes(forbidden), false),
  );

  const crossWorkplaceResponse = await request(
    "/rest/v1/rpc/get_pilot_monitor_summary",
    {
      token: session.access_token,
      method: "POST",
      body: { target_workplace_id: "93000000-0000-4000-8000-000000000012" },
    },
  );
  assert.ok(crossWorkplaceResponse.status >= 400);

  const selfEnrollResponse = await request("/rest/v1/workplace_observers", {
    token: session.access_token,
    method: "POST",
    body: {
      workplace_id: workplaceId,
      observer_profile_id: fixture.userId,
      observer_code: "O-AAAAAAAAAAAA",
    },
  });
  assert.ok(selfEnrollResponse.status >= 400);

  const revokeResponse = await serviceRpc("revoke_pilot_observer", {
    target_workplace_id: workplaceId,
    target_profile_id: fixture.userId,
  });
  assert.equal(revokeResponse.status, 200);

  const deniedSummaryResponse = await request(
    "/rest/v1/rpc/get_pilot_monitor_summary",
    {
      token: session.access_token,
      method: "POST",
      body: { target_workplace_id: workplaceId },
    },
  );
  assert.ok(deniedSummaryResponse.status >= 400);

  const hiddenEventsResponse = await request(
    `/rest/v1/pilot_audit_events?workplace_id=eq.${encodeURIComponent(workplaceId)}`,
    { token: session.access_token },
  );
  assert.equal(hiddenEventsResponse.status, 200);
  assert.deepEqual(await hiddenEventsResponse.json(), []);
});
