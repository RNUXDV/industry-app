# Industry Design Language — User Flows

This document defines reusable workflows and behavioral patterns across Industry.

User flows describe how workers move between screens, make decisions, and complete tasks. They should remain simple, understandable, and consistent with real service-industry behavior.

---

# Shift Transfer Flow

## Status

Defined — implementation in progress

## Purpose

The Shift Transfer Flow allows a worker to release an entire scheduled shift and route it either:

1. Publicly to the workplace Catch Board.
2. Privately to a specific coworker.

Industry does not support partial-shift releases. A released shift always represents the entire scheduled shift.

---

## Core Principle

A shift is the center of the workflow.

Workers begin with a scheduled shift and choose an action from that shift.

```text
My Shifts
    ↓
Shift Details
    ↓
Release Shift
```

# Release Shift Flow

## Goal

Allow a worker to request shift coverage while maintaining ownership until the transfer is complete.

---

## Flow

Scheduled Shift

↓

Release Shift

↓

Update Original Shift

owner = current-user
status = Pending Coverage

↓

Create Catch Board Request

source = catch-board
status = Open

↓

Render My Shifts

↓

Render Catch Board

---

## Result

Original Shift

- remains owned by worker
- visible in My Shifts
- status = Pending Coverage

Catch Board Request

- visible to coworkers
- status = Open
- linked to original shift

---

## Future Extensions

- Coworker Interest
- Shift Claim
- Manager Approval
- Ownership Transfer
- Notifications
---
Last Updated: 2026-07-28
Sprint: 002
Status: Active