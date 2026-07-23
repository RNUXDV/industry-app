# Industry Design Language

# Components

Components are the reusable building blocks of Industry.

Every component should have a single responsibility and be reusable across multiple experiences.

---

# IDL-001 — Status Pill

## Purpose

Displays a compact semantic status.

## Why

Workers make faster decisions when status is immediately recognizable.

## Props

- label
- status

## States

- Available
- Working
- Off Today

## Future States

- Busy
- Offline
- Disabled

## Accessibility

- High contrast
- Semantic color usage
- Readable at all sizes

## Used By

- Presence Card

---

# IDL-002 — Avatar

## Purpose

Displays worker identity and selection state.

## Why

Identity should be recognized instantly without requiring additional interaction.

## Props

- label
- selected

## States

- Default
- Selected

## Future States

- Profile Photo
- Manager
- Online
- Offline
- Busy

## Accessibility

- Decorative only
- Hidden from screen readers when appropriate

## Used By

- Presence Card

---

# IDL-003 — Presence Card

## Purpose

Displays a worker participating in a workplace workflow.

## Why

Combine identity, role, and availability into one reusable component that supports quick workplace decisions.

## Props

- worker
- workerIndex
- shiftId

## States

- Default
- Hover
- Selected

## Composes

- Avatar
- Status Pill

## Accessibility

- Keyboard selectable
- Focusable
- ARIA pressed state

## Used By

- Catch

## Future Usage

- Crew
- People
- Jobs
- Messages