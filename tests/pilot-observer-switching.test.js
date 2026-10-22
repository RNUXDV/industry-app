const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../script.js'), 'utf8');
const a = { workplace_id: 'a', workplace_name: 'Papa Haydn NW' };
const b = { workplace_id: 'b', workplace_name: 'Playa Pilot' };
function deferred() { let resolve; const promise = new Promise(r => resolve = r); return { promise, resolve }; }
function context() {
  const channels = [], removed = [], rendered = [], timers = new Map();
  let nextTimer = 0;
  const element = () => ({ value: '', disabled: false, textContent: '', replaceChildren(...children) { this.children = children; }, addEventListener(type, callback) { (this.listeners ||= {})[type] = callback; } });
  const c = { activePilotObserverWorkplace: a, pilotObserverWorkplaces: [a,b], pilotObserverGeneration: 0,
    pilotObserverRequest: 0, pilotObserverReady: false, pilotObserverSwitching: false, pilotObserverChecking: false,
    pilotObserverRealtimeChannel: null, pilotObserverStaleTimer: null, pilotObserverAuthorizationTimer: null,
    IS_LOCAL_INDUSTRY: true, document: { createElement: element, body: { classList: { add() {} } } },
    pilotMonitorScreen: { hidden: false }, industryAuthScreen: null, pilotMonitorFilters: element(), pilotMonitorSignout: element(),
    window: { clearTimeout() {}, clearInterval(id) { timers.delete(id); }, setTimeout() { return 1; },
      setInterval(callback, delay) { assert.equal(delay, 15000); const id = ++nextTimer; timers.set(id, callback); return id; } },
    setPilotMonitorState(message) { c.message = message; }, setPilotMonitorConnection(state) { c.connection = state; },
    renderPilotMonitorSummary(data) { rendered.push(data); }, renderPilotMonitorEvents() {}, getPilotMonitorSinceFilter() { return null; },
    openIndustryAuth() {}, loginStatus: element(), async signOutOfIndustry() { c.signouts = (c.signouts || 0) + 1; c.invalidatePilotObserverView(); c.activePilotObserverWorkplace = null; },
    supabaseClient: { async rpc(name, args) { return { data: name === 'list_my_observer_workplaces' ? [a,b] : { id: args.target_workplace_id } }; },
      async removeChannel(channel) { removed.push(channel); }, channel(name) { const ch = { name, on(type, filter, callback) { this.filter = filter; this.event = callback; return this; }, subscribe(callback) { this.status = callback; return this; } }; channels.push(ch); return ch; } },
  };
  for (const name of ['WorkplaceSelect','Refresh','EventFilter','OutcomeFilter','TimeFilter','Summary','Events','Workplace','Environment','StatusTitle','Retention']) c['pilotMonitor' + name] = element();
  vm.createContext(c);
  vm.runInContext(source.slice(source.indexOf('function pilotObserverIsCurrent('), source.indexOf('async function signOutOfIndustry()')), c);
  return { c, channels, removed, rendered, timers };
}
test('switches between both authorized pilots and preserves Playa through authorization polls', async () => {
  const { c, channels, removed, rendered } = context();
  await c.switchPilotObserverWorkplace('a'); await c.switchPilotObserverWorkplace('b');
  await c.verifyPilotObserverAuthorization(); await c.verifyPilotObserverAuthorization();
  assert.equal(c.activePilotObserverWorkplace.workplace_id, 'b');
  assert.equal(c.pilotMonitorWorkplace.textContent, 'Playa Pilot');
  assert.equal(c.pilotMonitorWorkplaceSelect.value, 'b');
  assert.equal(channels[1].filter.filter, 'workplace_id=eq.b');
  assert.equal(removed.length, 1); assert.equal(rendered.at(-1).id, 'b');
});
test('late dashboard responses and removed channel callbacks cannot affect new workplace', async () => {
  const { c, channels, rendered } = context(); await c.switchPilotObserverWorkplace('a');
  const gate = deferred(), rpc = c.supabaseClient.rpc;
  c.supabaseClient.rpc = (name,args) => name !== 'list_my_observer_workplaces' && args.target_workplace_id === 'a' ? gate.promise : rpc(name,args);
  const pending = c.loadPilotMonitorData(); await c.switchPilotObserverWorkplace('b');
  channels[0].status('CLOSED'); channels[0].event();
  gate.resolve({ data: { id: 'a-late' } }); await pending;
  assert.equal(rendered.at(-1).id, 'b'); assert.equal(c.connection, 'connected');
});
test('rapid switches discard out-of-order authorization results', async () => {
  const { c, rendered } = context(); const gate = deferred(), rpc = c.supabaseClient.rpc; let first = true;
  c.supabaseClient.rpc = (name,args) => { if (name === 'list_my_observer_workplaces' && first) { first = false; return gate.promise; } return rpc(name,args); };
  const pending = c.switchPilotObserverWorkplace('a'); await c.switchPilotObserverWorkplace('b');
  gate.resolve({ data: [a,b] }); await pending;
  assert.equal(c.activePilotObserverWorkplace.workplace_id, 'b'); assert.equal(rendered.at(-1).id, 'b');
});
test('revocation clears selected data and requires an authorized selection; zero grants signs out', async () => {
  const { c, removed } = context(); await c.switchPilotObserverWorkplace('b');
  c.supabaseClient.rpc = async () => ({ data: [a] }); await c.verifyPilotObserverAuthorization();
  assert.equal(c.activePilotObserverWorkplace, null); assert.equal(c.pilotObserverReady, false);
  assert.equal(c.pilotMonitorSummary.children.length, 0); assert.equal(removed.length, 1);
  assert.equal(c.pilotMonitorWorkplaceSelect.disabled, false);
  c.supabaseClient.rpc = async () => ({ data: [] }); await c.switchPilotObserverWorkplace('a'); assert.equal(c.signouts, 1);
});
test('temporary authorization failures suspend data without signing out and refresh recovers', async () => {
  const { c } = context(); await c.switchPilotObserverWorkplace('b'); const rpc = c.supabaseClient.rpc;
  c.supabaseClient.rpc = async () => { throw Error('offline'); }; await c.verifyPilotObserverAuthorization();
  assert.equal(c.signouts, undefined); assert.equal(c.pilotObserverReady, false); assert.equal(c.pilotObserverSwitching, false);
  c.supabaseClient.rpc = rpc; await c.switchPilotObserverWorkplace('b'); assert.equal(c.pilotObserverReady, true);
});
test('permission denial clears data and rechecks the authorized list', async () => {
  const { c } = context(); await c.switchPilotObserverWorkplace('b');
  c.supabaseClient.rpc = async name => name === 'list_my_observer_workplaces' ? { data: [a] } : { error: { code: '42501' } };
  await c.loadPilotMonitorData(); assert.equal(c.activePilotObserverWorkplace, null); assert.equal(c.pilotMonitorSummary.children.length, 0);
});
test('sign-out invalidation blocks pending switch and dashboard responses', async () => {
  const { c, rendered } = context(); await c.switchPilotObserverWorkplace('a'); const gate = deferred();
  c.supabaseClient.rpc = () => gate.promise; const pending = c.switchPilotObserverWorkplace('b');
  await c.signOutOfIndustry(); gate.resolve({ data: [a,b] }); await pending;
  assert.equal(c.activePilotObserverWorkplace, null); assert.equal(rendered.length, 1); assert.equal(c.pilotObserverReady, false);
});

test('latest dashboard request wins within the same workplace', async () => {
  const { c, rendered } = context(); await c.switchPilotObserverWorkplace('b');
  const old = deferred(); let count = 0;
  c.supabaseClient.rpc = async () => ++count <= 2 ? old.promise : { data: { id: 'new-filter' } };
  const pending = c.loadPilotMonitorData(); await c.loadPilotMonitorData();
  old.resolve({ data: { id: 'old-filter' } }); await pending;
  assert.equal(rendered.at(-1).id, 'new-filter');
});
test('actual sign-out entry invalidates pending data before waiting on auth', async () => {
  const { c, rendered } = context(); await c.switchPilotObserverWorkplace('a');
  const gate = deferred(); c.supabaseClient.rpc = () => gate.promise;
  const pending = c.loadPilotMonitorData();
  // Execute the real synchronous sign-out teardown before its first await.
  const start = source.indexOf('async function signOutOfIndustry()');
  const end = source.indexOf('  const { error } = await supabaseClient.auth.signOut();', start);
  c.pilotMonitorScreen = { hidden: false };
  vm.runInContext(source.slice(start, end) + '}', c);
  await c.signOutOfIndustry(); gate.resolve({ data: { id: 'late' } }); await pending;
  assert.equal(c.activePilotObserverWorkplace, null); assert.equal(c.pilotObserverWorkplaces.length, 0);
  assert.equal(c.pilotMonitorScreen.hidden, true); assert.equal(rendered.length, 1);
});

test('entry-time revocation keeps one authorization timer running through explicit reselection', async () => {
  const { c, timers } = context();
  const rpc = c.supabaseClient.rpc; let checks = 0; let authorized = [b];
  c.supabaseClient.rpc = (name, args) => {
    if (name === 'list_my_observer_workplaces') { checks++; return Promise.resolve({ data: authorized }); }
    return rpc(name, args);
  };
  await c.enterPilotObserverMode();
  assert.equal(c.activePilotObserverWorkplace, null);
  assert.equal(c.pilotMonitorScreen.hidden, false);
  assert.equal(timers.size, 1);
  const before = checks; await [...timers.values()][0]();
  assert.equal(checks, before + 1); assert.equal(c.activePilotObserverWorkplace, null);
  await c.switchPilotObserverWorkplace('b');
  await [...timers.values()][0]();
  assert.equal(c.activePilotObserverWorkplace.workplace_id, 'b');
  await c.enterPilotObserverMode(); assert.equal(timers.size, 1);
  authorized = [a]; await [...timers.values()][0]();
  assert.equal(c.activePilotObserverWorkplace, null); assert.equal(c.pilotObserverReady, false);
  assert.equal(timers.size, 1);
});

test('Refresh after revocation updates authorization without selecting another pilot', async () => {
  const { c, rendered } = context(); await c.switchPilotObserverWorkplace('b');
  c.supabaseClient.rpc = async () => ({ data: [a] });
  await c.verifyPilotObserverAuthorization();
  c.pilotMonitorRefresh.listeners.click();
  await new Promise(setImmediate);
  assert.equal(c.activePilotObserverWorkplace, null);
  assert.equal(c.pilotMonitorWorkplaceSelect.value, '');
  assert.equal(c.pilotMonitorSummary.children.length, 0);
  assert.equal(rendered.length, 1);
  assert.equal(c.pilotObserverReady, false);
});

test('new observer still initially selects the first authorized pilot', async () => {
  const { c } = context(); c.activePilotObserverWorkplace = null;
  assert.equal(await c.loadPilotObserverAuthorization(), true);
  await c.enterPilotObserverMode();
  assert.equal(c.activePilotObserverWorkplace.workplace_id, 'a');
  assert.equal(c.pilotObserverReady, true);
});

test('sign-out during entry stops polling and late entry cannot restart it', async () => {
  const { c, timers } = context(); const gate = deferred();
  c.supabaseClient.rpc = () => gate.promise;
  const pending = c.enterPilotObserverMode(); assert.equal(timers.size, 1);
  const start = source.indexOf('async function signOutOfIndustry()');
  const end = source.indexOf('  const { error } = await supabaseClient.auth.signOut();', start);
  vm.runInContext(source.slice(start, end) + '}', c);
  await c.signOutOfIndustry(); assert.equal(timers.size, 0);
  gate.resolve({ data: [a,b] }); await pending;
  assert.equal(timers.size, 0); assert.equal(c.pilotMonitorScreen.hidden, true);
});

test('external SIGNED_OUT tears down authorization polling and the monitor', async () => {
  const { c, timers } = context(); await c.enterPilotObserverMode();
  let callback;
  c.supabaseClient.auth = { onAuthStateChange(handler) { callback = handler; } };
  c.document.body.classList.remove = () => {};
  c.showSignedOutIndustry = () => {};
  const start = source.indexOf('supabaseClient.auth.onAuthStateChange(');
  vm.runInContext(source.slice(start, source.indexOf('function setIndustryAuthMode(', start)), c);
  callback('SIGNED_OUT');
  assert.equal(timers.size, 0); assert.equal(c.pilotMonitorScreen.hidden, true);
  assert.equal(c.activePilotObserverWorkplace, null); assert.equal(c.pilotObserverReady, false);
});
