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
