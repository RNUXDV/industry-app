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