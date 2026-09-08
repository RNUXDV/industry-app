# Industry Design Language — User Flows

This document defines reusable workflows and behavioral patterns across Industry.

User flows describe how workers move between screens, make decisions, and complete tasks. They should remain simple, understandable, and consistent with real service-industry behavior.

---

# Shift Transfer Flow

## Status

Implemented and locally verified — September 8, 2026

## Purpose

The Shift Transfer Flow allows a worker to release an entire scheduled shift and route it either:

1. Publicly to the workplace Catch Board.
2. Privately to one eligible coworker through Direct Send.

Industry does not support partial-shift releases. A released shift always represents the entire scheduled shift.

## Core Principle

A shift is the center of the workflow. The original worker keeps ownership until a manager approves the transfer.

```text
My Shifts
    ↓
Shift Details
    ↓
Release Shift
    ├── Catch Board
    └── Direct Send
```

## Shared Rules

- Only the current owner can release or directly send a scheduled shift.
- A shift cannot have conflicting public and direct coverage workflows.
- The original owner remains responsible for the shift until manager approval.
- Ownership changes only after approval succeeds in the database.
- RLS protects shift, offer, interest, and workplace data.
- Realtime updates synchronize affected dashboards, schedules, workflow controls, and Activity surfaces.
- Activity events preserve shift date/time/role context even when a later ownership change removes access to the live shift row.

---

# Public Catch Flow

## Goal

Let a worker ask the workplace crew for coverage while preserving clear ownership and manager control.

## Flow

```text
Scheduled
    ↓ owner releases to Catch
Interest
    ↓ one or more coworkers express interest
Selected
    ↓ original worker or manager selects a coworker
Awaiting manager approval
    ↓ manager approves
Confirmed
```

## Behavior

- The released shift appears on the workplace Catch Board.
- Eligible coworkers can express or withdraw their own interest.
- The original worker and manager can review interested coworkers.
- A selected coworker sees a waiting-for-approval state.
- Approval reassigns the original shift and closes the Catch request.
- The former owner loses the shift; the confirmed worker gains it.
- Before selection, the owner can cancel the coverage request and restore the shift to its normal scheduled state.
- Refresh and relogin restore the current workflow state from Supabase.

---

# Direct Send Flow

## Goal

Let a worker privately offer a complete shift to one eligible coworker without publishing it on the Catch Board.

## Flow

```text
Scheduled
    ↓ owner selects Direct Send and one coworker
Pending recipient response
    ├── Declined → owner retains shift
    ├── Canceled by sender → owner retains shift
    └── Accepted
            ↓ manager approval required
        Awaiting manager approval
            ├── Canceled by sender → owner retains shift
            └── Approved → ownership transfers
```

## Behavior

- Only the selected recipient receives the actionable offer.
- The offer does not appear as a public Catch shift.
- Under the current local policy, Direct Send history is still visible in the workplace Activity feed.
- The recipient can accept or decline while the offer is pending.
- The sender can cancel a pending or accepted offer before manager approval.
- Acceptance does not transfer ownership by itself.
- The manager reviews accepted offers and approves the final transfer.
- Approval reassigns the shift, closes the offer, and updates both schedules.
- Refresh and relogin restore pending and accepted offer states.

---

# Activity Synchronization

Coverage and transfer actions create persistent `coverage_events` records.

The authenticated Activity system:

- displays newest events first;
- resolves worker names from the authenticated workplace crew;
- shows the associated shift date and start time;
- retains shift context through immutable event snapshots;
- updates the full Activity page and the embedded Shift Details Activity panel in realtime;
- persists across refresh, relogin, cancellation, and ownership changes.

Before hosted pilot migration, confirm whether Direct Send Activity remains workplace-visible or becomes participant-and-manager-only.

---

Last Updated: 2026-09-08
Milestone: Local Schedule stabilization
Status: Implemented and locally verified
