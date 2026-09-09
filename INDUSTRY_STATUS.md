# Industry: Product and Development Status

Last reconciled: September 8, 2026

Active development branch: `backend-schedule`

Current stage: backend-integrated prototype / pre-pilot

This document is the durable handoff for Industry. It reconciles the current repository, Git history, Industry Design Language (IDL), database migrations, and the major product-development conversations. Use it to understand what Industry is, how it reached its current state, what is genuinely implemented, and what should happen next.

## 1. Product identity

Industry is a worker-centered platform for hospitality and service-industry workers.

Its core promise is:

> Help workers manage where they work now, move toward what comes next, and stay connected to the people behind the service.

The product began with two immediate needs—shift coverage and after-work community—and grew into three connected pillars:

- **Schedule:** the working-life utility layer: shifts, coverage, crew, earnings tools, and workplace coordination.
- **Jobs:** a career companion for exploring opportunities, preparing, applying, and tracking progress without pressuring someone to leave their current job.
- **People:** the trusted community layer: My Loop, events, nearby connections, and worker resources.

Industry should feel like a companion, not administrative software. Every interaction should reduce uncertainty, preserve agency, and respect the realities of hospitality work.

## 2. Product and design principles

The consistent principles across the IDL and the build are:

1. **Reduce uncertainty.** Make the current state, next step, and consequence of an action understandable.
2. **Put people before features.** Organize the experience around worker intent rather than software categories.
3. **Preserve agency.** Guide without pressuring; never trap a worker in a workflow.
4. **Use progressive disclosure.** Show what matters now and reveal detail when it becomes useful.
5. **Maintain continuity.** State must persist and remain synchronized across screens, sessions, and people.
6. **Use calm, purposeful motion and visual hierarchy.** Beauty supports clarity; it is not decoration.
7. **Design for hospitality first.** Language, timing, privacy, and workflows should reflect actual workplace conditions.
8. **Treat state and data as the source of truth.** A successful interaction updates the underlying system first, then every affected view renders from that state.
9. **Build accessibly and responsively.** Readability, touch targets, contrast, performance, and mobile behavior are part of the feature.
10. **Document reusable patterns.** Components and workflows should become part of the IDL after they are proven.

Emotional direction by pillar:

- Schedule: grounded, reliable, organized, focused.
- Jobs: hopeful, curious, optimistic, supportive.
- People: connected, welcoming, trustworthy, human.

## 3. Development progression

### Phase 1 — Concept and first prototype: May 17–June 27

- The original concept emerged on May 17 as a Portland-centered private network for restaurant and hospitality workers.
- The first MVP idea combined shift coverage with after-work community.
- The first coded layout appeared around May 20 as a small single-file prototype.
- Early language used **Work / Jobs / Connect** and explored light and DOT-inspired dark visual modes.
- Tip Notes emerged as a daily-use feature for hours, tips, tip-out, wages, and shift observations.

### Phase 2 — Repository build and product architecture: June 28–July 14

- The real GitHub repository began on June 28 with `index.html`, `styles.css`, and `script.js`.
- The app shell, homepage, navigation, usability-testing mode, feedback routing, and profile setup were established.
- The information architecture settled into **Schedule / Jobs / People**.
- Schedule gained My Shifts, Catch, coverage guidance, crew views, and workplace-aware flows.
- People expanded into dedicated Network, Events, Nearby, and Resources experiences.

### Phase 3 — Schedule V1 and the IDL: July 15–30

- My Shifts, Tip Calculator, and persistent Tip Tracker were built.
- Catch evolved from a simple board into a stateful multi-worker coverage workflow.
- Reusable Avatar, Status Pill, Presence Card, and Progress Rail patterns were documented.
- Shift Details became a command-card experience with state-aware actions.
- Release, interest, selection, manager approval, ownership transfer, dashboard synchronization, and activity history were proven in the browser prototype.
- Schedule V1 was audited and feature-frozen on July 30.

### Phase 4 — Jobs and People front-end systems: July 31–August 10

- Jobs was defined as a career companion with four paths: **Explore, Prepare, Jump, Track**.
- Explore gained workplace-type discovery and workplace profiles.
- Prepare gained profile, preferences, availability, readiness, and reusable resume state.
- Jump and Track gained application submission, multiple-workplace persistence, simulated employer states, offer details, timestamps, and contextual guidance.
- People gained My Loop, Events, privacy-first Nearby, and Resources.
- The full three-pillar prototype received onboarding, guided usability tasks, QR-source tracking, feedback routing, mobile fixes, and privacy-aware reset behavior.
- This is the point represented by `main`; it is the front-end usability-testing baseline.

### Phase 5 — Authentication and Schedule backend: August 17–23

- Supabase authentication, signup, profile isolation, onboarding, session restoration, sign-out, and password recovery were introduced.
- Profiles, workplace memberships, roles, schedules, shifts, and coverage records became backend data.
- Worker dashboards and My Shifts were connected to authenticated schedule data.
- Catch became backend-driven with row-level security and realtime updates.
- Manager shift creation, team schedule, crew directory, coverage requests, role-aware dashboards, and live metrics were added.

### Phase 6 — Schedule lifecycle hardening: August 24–28

- Worker shift start and end reporting, overnight handling, and manager-visible actual times were added.
- Managers gained shift editing, reassignment history, cancellation, and manager-posted open shifts.
- Catch was hardened across multiple workers and manager accounts: public workflow stage, private interest state, selection, approval, withdrawal, coverage cancellation, and realtime synchronization.
- Activity V1 moved from browser-only history to backend coverage events.

### Phase 7 — Direct Send and realtime activity: August 29–September 1

- Workers gained the ability to send a released shift directly to an eligible coworker.
- Recipients can accept or decline; managers can approve accepted transfers.
- Active offers restore after navigation or reload, and successful approval reassigns the shift.
- Realtime listeners refresh offer state, manager approvals, schedules, Catch, and activity.
- Activity naming and newest-first ordering were refined.
- Senders can cancel pending or accepted Direct Sends before manager approval.

### Phase 8 — Local Schedule stabilization: September 8

- The final local Schedule matrix was exercised across Robert, Worker B, Worker C, and Manager C in isolated browser sessions.
- Public Catch passed release, multiple interests, withdrawal, selection, manager approval, ownership transfer, cancellation, refresh/relogin persistence, and realtime synchronization.
- Direct Send passed private delivery, acceptance, decline, sender cancellation before approval, manager approval, ownership transfer, and persistence.
- Manager-created shifts now retain their creating manager so Shift Details shows the correct manager.
- Activity events now preserve a shift date/time/role snapshot after RLS removes access to the live shift row.
- Direct Send Activity is limited to the sender, recipient, and workplace managers; unrelated workers do not receive those events.
- The full Activity page and the embedded Shift Details Activity panel now update from the same realtime data.
- Safari restored an authenticated Schedule session after a hard refresh.

### Phase 9 — Hosted Schedule schema reconciliation: September 8

- The existing `industry-backend` Supabase project was recovered, linked to the repository, and confirmed healthy in `us-west-2`.
- Hosted migration history matched the reviewed local history through `20260829022918_broadcast_coverage_cancellation.sql`; there were no unknown hosted-only migrations.
- Private pre-reconciliation schema and public-data dumps were created before any hosted change.
- Twelve reviewed Schedule migrations were dry-run and applied in ledger order without seeds, roles, or Vault changes.
- A legacy, unused `list_workplace_coworkers()` function was preserved in the backup and removed through `20260908183000_remove_legacy_list_workplace_coworkers.sql`.
- The hosted migration queue is empty, hosted database lint reports no schema errors, and the hosted and reviewed local structural schema dumps match exactly after excluding platform-managed ownership and ACL statements.
- Hosted Auth health passed, all Schedule tables and Direct Send read endpoints are present, and anonymous access is rejected.
- Full hosted role/workflow regression remains pending because the hosted project has no workplace, membership, shift, coverage, or interest rows, and its six existing profiles are not the four local seeded test identities.

## 4. What is implemented now

### Shared foundation

- Mobile-first vanilla HTML, CSS, and JavaScript application.
- Light and dark themes.
- Product onboarding, testing guidance, feedback routing, and reset controls.
- Supabase client selects the local backend on `127.0.0.1`/`localhost` and the hosted backend elsewhere.
- Authenticated profiles, workplace memberships, and worker/manager roles.
- Realtime subscriptions for schedule and coverage changes.

### Schedule — backend-integrated

Worker capabilities:

- Authenticated dashboard and schedule.
- My Shifts and shift details.
- Worker-reported shift start and end times.
- Release a shift to the public Catch Board.
- Express or withdraw interest in a Catch shift.
- Select a coworker for a worker-owned coverage request.
- Cancel a public coverage request before completion.
- Direct Send to an eligible coworker.
- Accept or decline an incoming Direct Send.
- Restore active public and direct coverage state after navigation/reload.
- View realtime workflow status and activity history.

Manager capabilities:

- Role-aware dashboard, live metrics, crew directory, and team schedule.
- Create, edit, reassign, cancel, and post open shifts.
- Review interest in worker-released and manager-posted shifts.
- Select and approve coverage.
- Review and approve accepted Direct Sends.
- See reported work times and reassignment/coverage history.

Schedule features that still use browser storage or prototype data include the Tip Calculator/Tip Tracker and parts of the older demo/testing layer. They should not be described as fully backend-integrated yet.

### Jobs — polished front-end prototype

- Jobs Home with Explore, Prepare, Jump, and Track paths.
- Workplace-category exploration, result cards, and workplace profiles.
- Profile, preferences, availability, readiness, and resume preparation flows.
- Opportunity match tiers and personalized next-move guidance.
- Application submission and multiple-workplace tracking states.
- Simulated employer updates, interview/offer states, and contextual next steps.

Jobs state is stored primarily in `localStorage`. It is useful for usability testing but does not yet have authenticated shared backend data or real employer participation.

### People — polished front-end prototype

- My Loop/network experience.
- Events discovery and saved state.
- Privacy-first Nearby controls.
- Worker Resources and saved resources.

People is implemented across dedicated pages and uses simulated content plus `localStorage`. It is not yet a live social network.

## 5. Technical reality

### Repository and branches

- Active branch: `backend-schedule`.
- The September 8 local stabilization checkpoint ends at commit `3d0cd42`; Direct Send Activity privacy is recorded in commit `0836b9c`.
- `backend-schedule` extends the August 10 `main` baseline with the authenticated Schedule backend and is intentionally ahead of `main`.
- `main` remains at the August 10 front-end usability-testing checkpoint.
- Earlier `backend-dev` and `ux-refinement` branches record intermediate backend/auth work; they are not the active development branch.

### Front end

- `index.html` contains the main Home, Schedule, and Jobs experiences.
- `people-*.html` plus `people-pages.js` contain the People experiences.
- `styles.css` and `script.js` are large, mature prototype files and now carry multiple product systems.
- There is no bundler or framework build step; the app is served directly during local development.

### Backend

- Supabase Auth provides accounts and sessions.
- PostgreSQL tables, RLS policies, RPC functions, triggers, and Realtime support Schedule workflows.
- Local development depends on local Supabase services, normally run through Docker.
- Database behavior is versioned in `supabase/migrations`.

### Environment caution

- Local Industry and the hosted site use different Supabase projects.
- A local test passing does **not** prove the hosted database has the same schema or migrations.
- The hosted `industry-backend` database is structurally reconciled with the reviewed local Schedule migrations as of September 8.
- The public GitHub Pages frontend still serves the August 10 `main` version, so it does not expose the current authenticated Schedule implementation.
- Hosted operational Schedule data and a full hosted multi-role regression are still pending. Do not describe the hosted app as pilot-ready until a controlled test cohort and current frontend deployment have passed that regression.

## 6. Latest completed checkpoint

September 8 produced three reviewed and pushed local stabilization fixes:

1. Commit `b22f3b5` persists the creating manager on manager-created shifts.
2. Commit `d7e1743` adds immutable shift context to coverage events and renders that snapshot when RLS hides the live shift row.
3. Commit `3d0cd42` keeps the embedded Shift Details Activity panel synchronized with incoming realtime events.

Local verification completed across four authenticated roles:

- Manager-created shifts appeared immediately for the assigned worker and displayed the correct manager.
- Public Catch completed from release through confirmed reassignment with multiple coworkers, withdrawal, selection, approval, and realtime updates.
- Public coverage cancellation restored the original scheduled shift and removed the Catch request everywhere.
- Direct Send controls were delivered only to the selected recipient, did not appear on the public Catch Board, could be accepted or declined, and required manager approval before ownership changed.
- Senders could cancel pending or accepted Direct Sends before approval.
- Activity names, event order, event type, and shift date/time remained correct across ownership and permission changes.
- Direct Send Activity RLS was verified through the authenticated local API for Robert, Worker B, Worker C, and Manager C.
- The Activity page and Shift Details Activity panel updated in realtime.
- Hard refresh, sign-out/sign-in, and Safari authentication restoration preserved the expected state.

The same day, Direct Send Activity visibility was hardened to the sender, recipient, and workplace managers, then verified locally across all four roles. The hosted Supabase schema was subsequently backed up, reconciled through all reviewed migrations, cleaned of one unused legacy function, linted, and structurally compared with the local migration-built schema.

Hosted evidence:

- Project: existing `industry-backend` project, active and healthy in `us-west-2`.
- Pre-change backup: public schema plus public data, stored privately outside the repository.
- Pre-change data: 6 profiles; 0 workplaces, workplace memberships, shifts, coverage events, and shift interests.
- Migration result: local and hosted ledgers match through `20260908183000_remove_legacy_list_workplace_coworkers.sql`; the dry-run queue is empty.
- Structural result: hosted and local normalized structural schema hashes match.
- Runtime surface: Auth health returned success; Schedule tables and Direct Send read RPCs are present and reject anonymous access.
- Remaining gate: create a deliberate hosted test workplace/cohort, deploy the current frontend to a controlled hosted target, and repeat the full four-role regression.

## 7. Recommended development direction

The next development milestone should remain **Schedule backend stabilization and pilot readiness**. Jobs and People should be preserved as validated product directions, but moving them to a backend now would widen the surface area before the first live operational system is dependable.

The final local Schedule regression and independent Safari refresh check passed on September 8. Direct Send Activity privacy was subsequently hardened so only the sender, recipient, and workplace managers can view its history.

Recommended order from this checkpoint:

1. **Define the hosted test cohort and data policy.** Select or create explicit hosted test accounts, create one test workplace, and document reset/retention rules; do not upload the local-only seed wholesale.
2. **Publish the current frontend to a controlled hosted target.** Review and deliberately merge or stage `backend-schedule`; the public `main` site is still the August 10 build.
3. **Repeat the complete Schedule regression against hosted Supabase.** Cover worker, alternate-worker, unrelated-worker, and manager roles; verify refresh/relogin, Realtime, Catch, Direct Send, Activity privacy, and rollback behavior.
4. **Prepare a small Portland pilot.** Define the first workplace, participants, support process, success measures, and recovery procedure.
5. **Choose the next backend pillar only after hosted Schedule is stable.** Jobs is the stronger next candidate because its user journey and front-end state model are already extensively defined; People should remain privacy-led and require a separate trust/safety plan.

## 8. Working method to preserve

The development rhythm that produced the strongest results is:

> Discover → Design → Prototype → Build → Refine → Document → Commit

Operationally:

- Work on one milestone and one state transition at a time.
- Establish expected behavior before changing code.
- Test the full affected workflow across every relevant role.
- Prefer backend state as the shared truth and keep private details protected by RLS.
- Save files before diagnosing browser caching or source mismatches.
- Keep local and hosted environments explicitly separate.
- Commit only after the milestone passes, with the migration and frontend behavior checkpointed together when they depend on each other.
- Update this document whenever the product stage, active priority, or environment status materially changes.

## 9. Source-of-truth hierarchy

When records disagree, use this order:

1. Current code and database migrations for what is implemented.
2. Git history for when and why implementation changed.
3. This status document for the reconciled product/development picture.
4. IDL documents for enduring design intent and reusable patterns.
5. Prior conversations for exploration, rationale, and historical context.

Historical IDL sprint records preserve the browser-only Schedule behavior that existed when those audits were written. Treat those statements as historical unless they are repeated in the current component, flow, registry, or status records.

## 10. Definition of the current stage

Industry is no longer only a front-end concept. It is a substantial, backend-integrated prototype with one locally stabilized and hosted-schema-reconciled operational pillar—Schedule—and two well-developed prototype pillars—Jobs and People—waiting for later backend work.

It should not yet be called production-ready. The next threshold is a stable, secure, hosted Schedule pilot with a current frontend deployment, deliberate hosted test data, repeatable multi-role regression tests, and a small real-world cohort.
