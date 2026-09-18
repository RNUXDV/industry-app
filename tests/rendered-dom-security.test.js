const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");

const projectRoot = path.resolve(__dirname, "..");

let browser;
let page;
const pageErrors = [];

test.before(async () => {
  const browserExecutable =
    process.env.INDUSTRY_BROWSER_PATH ||
    [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    ].find((candidate) => fs.existsSync(candidate));

  browser = await chromium.launch({
    executablePath: browserExecutable,
    headless: true,
  });
  page = await browser.newPage();
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.addInitScript(() => {
    function makeQuery(data = []) {
      const query = {};
      const chainMethods = [
        "delete",
        "eq",
        "filter",
        "in",
        "insert",
        "limit",
        "order",
        "select",
        "update",
      ];

      chainMethods.forEach((method) => {
        query[method] = () => query;
      });

      query.single = async () => ({ data: null, error: null });
      query.maybeSingle = async () => ({ data: null, error: null });
      query.then = (resolve, reject) =>
        Promise.resolve({ data, error: null }).then(resolve, reject);

      return query;
    }

    const channel = {
      on() {
        return channel;
      },
      subscribe() {
        return channel;
      },
    };

    window.supabase = {
      createClient() {
        return {
          auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            getUser: async () => ({ data: { user: null }, error: null }),
            onAuthStateChange: () => ({
              data: { subscription: { unsubscribe() {} } },
            }),
            resetPasswordForEmail: async () => ({ error: null }),
            signInWithPassword: async () => ({ data: {}, error: null }),
            signOut: async () => ({ error: null }),
            signUp: async () => ({ data: { session: null }, error: null }),
            updateUser: async () => ({ error: null }),
          },
          channel: () => channel,
          from: () => makeQuery(),
          removeChannel: async () => {},
          rpc: () => makeQuery(),
        };
      },
    };
  });

  await page.route("**/*", async (route) => {
    if (route.request().url().startsWith("file:")) {
      await route.continue();
      return;
    }

    await route.abort();
  });

  await page.goto(pathToFileURL(path.join(projectRoot, "index.html")).href, {
    waitUntil: "load",
  });
  await page.waitForFunction(() => typeof renderShiftBoard === "function");
});

test.after(async () => {
  await browser?.close();
});

test("the local application loads with security.js before dependent rendering", async () => {
  const state = await page.evaluate(() => ({
    hasSecurity: typeof window.IndustrySecurity?.escapeHtml === "function",
    hasManagerCrewRenderer:
      typeof window.renderAuthenticatedManagerCrew === "function",
    hasScheduleRenderer:
      typeof window.renderAuthenticatedScheduleShifts === "function",
    hasShiftBoardRenderer: typeof window.renderShiftBoard === "function",
  }));

  assert.deepEqual(state, {
    hasSecurity: true,
    hasManagerCrewRenderer: true,
    hasScheduleRenderer: true,
    hasShiftBoardRenderer: true,
  });
  assert.deepEqual(pageErrors, []);
});

test("the hosted launch surface exposes Schedule only", async () => {
  const state = await page.evaluate(() => {
    const jobsNavigation = document.querySelector(
      '.nav-item[data-target="jobs"]',
    );
    const peopleNavigation = document.querySelector(
      '.nav-item[data-target="people"]',
    );
    const earningsDestination = document.querySelector(
      '[data-schedule-view="earnings-tools"]',
    );
    const tipTracker = document.querySelector(
      '[data-schedule-subview="tip-tracker"]',
    );

    setActiveSection("jobs");
    setActiveScheduleView("tip-tracker");
    updateDashboardForRole();

    return {
      scheduleOnly: isScheduleOnlyPilot,
      bodyScoped: document.body.classList.contains("pilot-schedule-only"),
      jobsDisplay: getComputedStyle(jobsNavigation).display,
      peopleDisplay: getComputedStyle(peopleNavigation).display,
      earningsDisplay: getComputedStyle(earningsDestination).display,
      tipTrackerDisplay: getComputedStyle(tipTracker).display,
      activeSection: document.querySelector(".app-section.active")?.dataset.section,
      activeScheduleView: document.querySelector(
        ".schedule-subview.active",
      )?.dataset.scheduleSubview,
      scopeText: document.querySelector(
        "#pilot-schedule-scope-notice",
      )?.textContent,
      welcomeText: document.querySelector("#pilot-welcome-copy")?.textContent,
      signupMinimum: document.querySelector("#signup-password")?.minLength,
      updateMinimum: document.querySelector("#new-password")?.minLength,
      activityHidden: document.querySelector(
        "#dashboard-quick-quaternary",
      )?.hidden,
      activityLabel: document.querySelector(
        "#dashboard-quick-quaternary-label",
      )?.textContent,
      oldTourDisplay: getComputedStyle(
        document.querySelector("#onboarding-lanes-step"),
      ).display,
    };
  });

  assert.equal(state.scheduleOnly, true);
  assert.equal(state.bodyScoped, true);
  assert.equal(state.jobsDisplay, "none");
  assert.equal(state.peopleDisplay, "none");
  assert.equal(state.earningsDisplay, "none");
  assert.equal(state.tipTrackerDisplay, "none");
  assert.equal(state.activeSection, "schedule");
  assert.equal(state.activeScheduleView, "my-shifts");
  assert.match(state.scopeText, /Schedule pilot/);
  assert.match(state.scopeText, /tip tools are not included/);
  assert.match(state.welcomeText, /shifts, coverage, and workplace crew/);
  assert.doesNotMatch(state.welcomeText, /earnings|opportunities|people/i);
  assert.equal(state.signupMinimum, 10);
  assert.equal(state.updateMinimum, 10);
  assert.equal(state.activityHidden, false);
  assert.equal(state.activityLabel, "Activity");
  assert.equal(state.oldTourDisplay, "none");
});

test("standalone People routes redirect away from the hosted pilot", async () => {
  const guardedPage = await browser.newPage();

  await guardedPage.route("**/*", async (route) => {
    if (route.request().url().startsWith("file:")) {
      await route.continue();
      return;
    }

    await route.abort();
  });

  const peopleUrl = `${pathToFileURL(
    path.join(projectRoot, "people-events.html"),
  ).href}?pilot=schedule`;

  await guardedPage.goto(peopleUrl, { waitUntil: "domcontentloaded" });
  await guardedPage.waitForURL(/index\.html\?pilot=schedule#schedule$/);

  assert.match(guardedPage.url(), /index\.html\?pilot=schedule#schedule$/);
  await guardedPage.close();
});

test("manager crew rendering displays ordinary text without double escaping", async () => {
  const result = await page.evaluate(() => {
    renderAuthenticatedManagerCrew([
      {
        name: "O'Connor & Sons",
        role: "Server & Bartender",
      },
      {
        name: "Papa Haydn NW",
        role: "Manager",
      },
      {
        name: null,
        role: undefined,
      },
    ]);

    const target = document.querySelector("#manager-crew-list");

    return {
      html: target.innerHTML,
      text: target.textContent,
    };
  });

  assert.match(result.text, /O'Connor & Sons/);
  assert.match(result.text, /Server & Bartender/);
  assert.match(result.text, /Papa Haydn NW/);
  assert.match(result.text, /Role not set/);
  assert.doesNotMatch(result.text, /&(?:amp|#39);/);
  assert.doesNotMatch(result.text, /\b(?:null|undefined)\b/);
  assert.match(result.html, /O'Connor &amp; Sons/);
  assert.doesNotMatch(result.html, /&amp;(?:amp|#39);/);
});

test("presence-card rendering neutralizes markup in text and attributes", async () => {
  const payload = `<img src=x onerror="window.__industryXss = true"><script>window.__industryXss = true<\/script>`;

  const result = await page.evaluate((hostileValue) => {
    window.__industryXss = false;
    const host = document.createElement("div");

    host.innerHTML = renderPresenceCard(
      {
        name: hostileValue,
        role: `Server & Bartender ${hostileValue}`,
        availability: {
          label: hostileValue,
          status: `available\" onclick=\"window.__industryXss=true`,
        },
        selected: false,
      },
      0,
      `shift\" onclick=\"window.__industryXss=true`,
      { selectable: true },
    );

    document.body.appendChild(host);

    return {
      executed: window.__industryXss,
      injectedElements: host.querySelectorAll("img, script").length,
      text: host.textContent,
      shiftId: host.querySelector(".interested-worker").dataset.shiftId,
    };
  }, payload);

  assert.equal(result.executed, false);
  assert.equal(result.injectedElements, 0);
  assert.match(result.text, /<img src=x onerror=/);
  assert.match(result.text, /Server & Bartender/);
  assert.equal(
    result.shiftId,
    `shift\" onclick=\"window.__industryXss=true`,
  );
});

test("real schedule and Catch renderers safely display dates, notes, and nullish values", async () => {
  const payload = `<svg onload="window.__industryXss = true"></svg><script>window.__industryXss = true<\/script>`;

  const result = await page.evaluate((hostileValue) => {
    window.__industryXss = false;

    renderAuthenticatedScheduleShifts([
      {
        id: "schedule-safe-display",
        status: "scheduled",
        day: "Thu, Sep 17",
        role: "Server & Bartender",
        time: "5:00 PM – Close",
        workplace: "Papa Haydn NW",
        startsAt: "2099-09-17T17:00:00.000Z",
        endsAt: null,
      },
      {
        id: "schedule-nullish-display",
        status: "scheduled",
        day: "",
        role: null,
        time: undefined,
        workplace: hostileValue,
        startsAt: "2099-09-18T17:00:00.000Z",
        endsAt: null,
      },
    ]);

    authenticatedUserId = "worker-test-id";
    authenticatedWorkplaceRole = "Server";
    authenticatedShiftInterests = [];
    authenticatedCatchShifts = [
      {
        id: "open-shift-safe-display",
        status: "open",
        displayStatus: "Open",
        coverageStage: "open",
        owner: null,
        workplace: "Papa Haydn NW",
        role: "Host's Assistant & Server",
        day: "Fri, Sep 18",
        time: "5:00 PM – Close",
        neighborhood: "Northwest Portland",
        notes: `Bring apron & ask for O'Connor. ${hostileValue}`,
        postedTo: "Papa Haydn NW crew",
      },
    ];

    renderShiftBoard();

    const scheduleTarget = document.querySelector("#imported-shift-list");
    const catchTarget = document.querySelector("#shift-board-list");

    return {
      executed: window.__industryXss,
      injectedElements:
        scheduleTarget.querySelectorAll("svg, script").length +
        catchTarget.querySelectorAll("svg, script").length,
      scheduleHtml: scheduleTarget.innerHTML,
      scheduleText: scheduleTarget.textContent,
      catchHtml: catchTarget.innerHTML,
      catchText: catchTarget.textContent,
    };
  }, payload);

  assert.equal(result.executed, false);
  assert.equal(result.injectedElements, 0);
  assert.match(result.scheduleText, /Thu, Sep 17/);
  assert.match(result.scheduleText, /Server & Bartender/);
  assert.match(result.scheduleText, /Papa Haydn NW/);
  assert.match(result.scheduleText, /<svg onload=/);
  assert.doesNotMatch(result.scheduleText, /\b(?:null|undefined)\b/);
  assert.match(result.catchText, /Host's Assistant & Server/);
  assert.match(result.catchText, /Bring apron & ask for O'Connor/);
  assert.match(result.catchText, /<script>/);
  assert.doesNotMatch(result.scheduleHtml, /&amp;(?:amp|lt|gt|quot|#39);/);
  assert.doesNotMatch(result.catchHtml, /&amp;(?:amp|lt|gt|quot|#39);/);
});

test("pilot monitor renders ordinary and hostile backend values as inert text", async () => {
  const payload = `<img src=x onerror="window.__pilotMonitorXss=true"><script>window.__pilotMonitorXss=true<\/script>`;

  const result = await page.evaluate((hostileValue) => {
    window.__pilotMonitorXss = false;

    renderPilotMonitorSummary({
      invitations: { pending: 2, accepted: 1 },
      participants: { active: 3, inactive: 1 },
      shifts: { scheduled: 4, open: 1, coverage_needed: 1 },
      coverage: {
        interested: 1,
        selected: 1,
        confirmed: 0,
        direct_offers_open: 1,
      },
      audit: { recent_events: 9 },
    });

    renderPilotMonitorEvents([
      {
        event_type: hostileValue,
        outcome: hostileValue,
        subject_code: `P-ABCDEF123456${hostileValue}`,
        object_code: `S-ABCDEF123456${hostileValue}`,
        actor_code: "O-ABCDEF123456",
        metadata: {
          notes: hostileValue,
          email: "private@example.test",
        },
        occurred_at: "2026-09-18T18:00:00.000Z",
      },
      {
        event_type: "participant_joined",
        outcome: "success",
        subject_code: "P-A1B2C3D4E5F6",
        object_code: null,
        occurred_at: "",
      },
    ]);

    const monitor = document.querySelector("#pilot-monitor-screen");
    const events = document.querySelector("#pilot-monitor-events");
    const summary = document.querySelector("#pilot-monitor-summary");

    return {
      executed: window.__pilotMonitorXss,
      injectedElements: events.querySelectorAll("img, script, svg").length,
      eventText: events.textContent,
      eventHtml: events.innerHTML,
      summaryText: summary.textContent,
      mutationControls: monitor.querySelectorAll(
        "button:not(#pilot-monitor-signout):not(#pilot-monitor-refresh)",
      ).length,
    };
  }, payload);

  assert.equal(result.executed, false);
  assert.equal(result.injectedElements, 0);
  assert.match(result.eventText, /<img src=x onerror=/);
  assert.match(result.eventText, /P-ABCDEF123456/);
  assert.match(result.eventText, /Participant joined/);
  assert.doesNotMatch(result.eventText, /private@example\.test/);
  assert.doesNotMatch(result.eventText, /notes/);
  assert.match(result.eventHtml, /&lt;img src=x onerror=/);
  assert.doesNotMatch(result.eventHtml, /&amp;lt;/);
  assert.match(result.summaryText, /Pending invitations2/);
  assert.equal(result.mutationControls, 0);
});

test("pilot monitor exposes clear loading, empty, stale, disconnected, and error states", async () => {
  const result = await page.evaluate(() => {
    const observed = {};
    setPilotMonitorState("Loading pilot events…", "loading");
    observed.loading = document.querySelector("#pilot-monitor-state").dataset.state;

    renderPilotMonitorEvents([]);
    observed.empty = document.querySelector("#pilot-monitor-state").dataset.state;

    setPilotMonitorConnection("stale", "Connected · data may be stale");
    observed.stale = document.querySelector("#pilot-monitor-connection-dot").dataset.state;

    setPilotMonitorConnection("disconnected", "Disconnected");
    observed.disconnected = document.querySelector("#pilot-monitor-connection-dot").dataset.state;

    setPilotMonitorState("Pilot data is unavailable.", "error");
    observed.error = document.querySelector("#pilot-monitor-state").dataset.state;
    observed.errorText = document.querySelector("#pilot-monitor-state").textContent;
    return observed;
  });

  assert.deepEqual(result, {
    loading: "loading",
    empty: "empty",
    stale: "stale",
    disconnected: "disconnected",
    error: "error",
    errorText: "Pilot data is unavailable.",
  });
});

test("pilot consent and departure copy render as optional and account-safe", async () => {
  const result = await page.evaluate(() => {
    activePilotInvitation = {
      workplace_name: "Papa Haydn NW",
      invited_role: "Server & Bartender",
      invited_email: "o'connor@example.test",
    };
    renderPilotInvitation();

    return {
      workplace: document.querySelector("#industry-invite-workplace").textContent,
      details: document.querySelector("#industry-invite-details").textContent,
      consent: document.querySelector("#pilot-consent-panel").textContent,
      consentVisible: !document.querySelector("#pilot-consent-panel").hidden,
      leave: document.querySelector(".pilot-membership-panel").textContent,
    };
  });

  assert.equal(result.workplace, "Papa Haydn NW");
  assert.match(result.details, /Server & Bartender/);
  assert.match(result.details, /o'connor@example\.test/);
  assert.equal(result.consentVisible, true);
  assert.match(result.consent, /optional/);
  assert.match(result.consent, /not connected to payroll/);
  assert.match(result.leave, /does not delete your Industry account/);
  assert.doesNotMatch(result.details, /&(?:amp|#39);/);
});

test("manager removal controls safely render hostile participant values", async () => {
  const payload = `<img src=x onerror="window.__industryXss = true"><script>window.__industryXss = true<\/script>`;
  const result = await page.evaluate((hostileValue) => {
    window.__industryXss = false;
    authenticatedUserId = "manager-test-id";
    renderAuthenticatedManagerCrew([
      {
        id: "worker-test-id",
        name: `O'Connor & ${hostileValue}`,
        role: `Host's Assistant & Server`,
      },
    ]);

    const target = document.querySelector("#manager-crew-list");
    return {
      executed: window.__industryXss,
      injectedElements: target.querySelectorAll("img, script").length,
      text: target.textContent,
      buttonText: target.querySelector("button").textContent,
    };
  }, payload);

  assert.equal(result.executed, false);
  assert.equal(result.injectedElements, 0);
  assert.match(result.text, /O'Connor & <img/);
  assert.match(result.text, /Host's Assistant & Server/);
  assert.equal(result.buttonText, "Remove from pilot");
  assert.doesNotMatch(result.text, /&(?:amp|lt|gt|quot|#39);/);
});

test("safe Auth messages do not expose hostile backend details", async () => {
  const result = await page.evaluate(() => {
    const hostileBackendMessage =
      `user@example.test token=secret <img src=x onerror="window.__industryXss=true">`;
    window.__industryXss = false;
    const target = document.querySelector("#signup-status");
    target.textContent = getSafeAuthFailureMessage("signup", hostileBackendMessage);

    return {
      executed: window.__industryXss,
      html: target.innerHTML,
      text: target.textContent,
      imageCount: target.querySelectorAll("img").length,
    };
  });

  assert.equal(result.executed, false);
  assert.equal(result.imageCount, 0);
  assert.doesNotMatch(result.text, /user@example\.test|token=secret|<img/);
  assert.equal(
    result.text,
    "We couldn't finish signup here. Check the private invitation, or sign in if you already have an account.",
  );
  assert.equal(result.html, result.text);
});
