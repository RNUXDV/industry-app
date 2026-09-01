# Industry: Product and Development Status

Last reconciled: September 1, 2026

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
- The current local change permits the sender to cancel an accepted Direct Send before manager approval.

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
- The accepted-offer cancellation and realtime checkpoint is recorded in commit `0b6d6ff`.
- `backend-schedule` contains the backend work developed after `main` and has not diverged from it.
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
- The current hosted/production database is behind the local Direct Send schema. Do not apply migrations or describe the hosted app as current until its schema is deliberately reconciled and tested.

## 6. Latest completed checkpoint

Commit `0b6d6ff` checkpoints the completed Direct Send work:

1. `script.js` changes that:
   - refresh coverage activity after sending a Direct Send;
   - preserve the Cancel Direct Offer control after the recipient accepts and while manager approval is pending;
   - use the authenticated workplace crew when resolving activity names;
   - refresh manager Direct Send approvals after relevant realtime events.
2. `supabase/migrations/20260901103000_allow_cancel_accepted_direct_offer.sql`, which allows the sender to cancel either a pending or accepted Direct Send and records the cancellation as a coverage event.

Local verification completed:

- The apparent stale-script problem was an unsaved VS Code buffer, not a duplicate `script.js`, wrong branch, or incorrect Live Server root.
- Saving the active file made the browser load the current function.
- A pending offer displayed its cancel control and canceled successfully.
- An accepted offer restored after switching accounts with its status and Cancel Direct Offer button.
- Before the migration, cancellation correctly failed because the old RPC only allowed pending offers.
- After the local migration, accepted-offer cancellation passed.
- A separate accepted offer completed through manager approval and reassigned the shift to Worker C.
- Manager Team Schedule and Activity reflected the reassignment with correct worker names and newest-first ordering.
- The authenticated manager session restored after a browser reload with no console errors.

No production change was made.

## 7. Recommended development direction

The next development milestone should remain **Schedule backend stabilization and pilot readiness**. Jobs and People should be preserved as validated product directions, but moving them to a backend now would widen the surface area before the first live operational system is dependable.

Recommended order:

1. **Run one final Schedule regression matrix.** Test worker A, worker B, worker C, and manager across refresh/relogin, Catch, Direct Send, manager approval, cancellation, reassignment, Activity, and realtime updates.
2. **Resolve the known Safari auth reload concern.** The in-app browser restored the manager session successfully; confirm the behavior independently in Safari.
3. **Reconcile hosted Supabase deliberately.** Inventory the hosted schema, decide the migration path, apply only reviewed migrations, and repeat the Schedule regression against the hosted environment.
4. **Bring the remaining IDL records current.** Update stale entries that still describe local-only Schedule state or incomplete Catch implementation.
5. **Prepare a small Portland pilot.** Define the first workplace, participants, data/reset policy, support process, and success measures.
6. **Choose the next backend pillar only after Schedule is stable.** Jobs is the stronger next candidate because its user journey and front-end state model are already extensively defined; People should remain privacy-led and require a separate trust/safety plan.

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

The current README and several IDL entries were written before the backend work and may still describe Schedule as a browser-only prototype. Those statements are historical unless they are repeated here.

## 10. Definition of the current stage

Industry is no longer only a front-end concept. It is a substantial, backend-integrated prototype with one operational pillar—Schedule—under active hardening and two well-developed prototype pillars—Jobs and People—waiting for later backend work.

It should not yet be called production-ready. The next threshold is a stable, secure, hosted Schedule pilot with environment parity, repeatable regression tests, and a small real-world cohort.
