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
