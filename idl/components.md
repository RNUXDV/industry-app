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

---

# IDL-004 — Progress Rail

## Purpose

Displays a user's current position within a linear workflow.

## Why

Reduces uncertainty by showing the current stage, completed stages, and remaining stages in a shift-coverage process.

## Props

- `currentStep`
- `labels`
- `completed`

## States

- Interest
- Selected
- Confirmed

## Accessibility

- Communicates the current stage with text, not color alone.
- Presents steps in their correct sequence.
- Uses sufficient contrast for nodes, connectors, and labels.
- Can provide a descriptive screen-reader label for the complete workflow state.

## Used By

- Catch

---

## IDL-005 — Schedule Card

### Purpose

The Schedule Card is the primary reusable component used to display a scheduled shift.

It provides a concise summary of a shift and serves as the entry point into the Shift Details experience.

### Contains

- Day / Date
- Time
- Role
- Workplace
- Status (optional)
- Primary action (View Details)

### Optional Content

- Coverage Status
- Manager Notes indicator
- Crew count
- Special Event indicator

### Primary Action

- View Details

### Principles

- Every scheduled shift uses the same Schedule Card.
- The card summarizes a shift without overwhelming the user.
- A shift's origin (scheduled, imported, or picked up) does not change the card.
- The card is optimized for quick scanning.

### Interaction

Selecting a Schedule Card opens the Shift Details experience.

## Component: My Shifts

- Display worker-owned shifts as the authoritative schedule.

### Purpose

The worker's personal schedule and the authoritative view of shift ownership.

### Responsibilities

- Display owned shifts
- Display current shift status
- Maintain ownership throughout the shift lifecycle
- Reflect state changes immediately after user actions

### Supported States

- Scheduled
- Pending Coverage
- Pending Approval
- Transferred
- Completed

---

## Component: Catch Board

### Purpose

Public workplace board for available shifts.

### Responsibilities

- Display Open Release Requests
- Display Open Release Requests
- Allow coworkers to express interest
- Never replace the worker's original shift

### Data Ownership

Catch Board requests are independent records linked to an original shift through:

- sourceShiftId
- requestType
- status

---

Last Updated: 2026-07-28
Sprint: 002
Status: Active

## Schedule Activity Feed

### Purpose

Displays persistent worker-specific updates related to shift releases, Catch approvals, ownership changes, and future schedule events.

### Entry Point

My Shifts → Quick Tools → Activity

### Data Source

Local storage key:

`industry-v2-activity`

Rendered through:

- `getActivityFeed()`
- `addActivity(activity)`
- `renderActivityFeed()`

### Current Event Types

#### Shift Released

Shown to the worker who released the shift.

Fields used:

- `type`
- `title`
- `message`
- `workerId`
- `shiftId`
- `workplace`
- `createdAt`

#### Coverage Approved

Shown to the worker approved for the shift.

Additional field:

- `approvedBy`

### Behavior

- Filters events using `CURRENT_USER.id`
- Displays newest events first
- Persists through local storage
- Clears when demo data is reset
- Opens as the `activity-feed` Schedule subview
- Returns to My Shifts through the existing back navigation

### Visual Structure

Each activity card contains:

- status marker
- event title
- timestamp
- event message
- optional approval detail
- workplace

---

Last Updated: 2026-07-30
Sprint: 002
Status: Active

---

### Multi-Worker Behavior

The Catch workflow is driven by `CURRENT_USER`.

When a worker selects “I Can Take This,” the system stores the active worker’s:

- `id`
- `name`
- `role`

The approval flow then transfers the shift to that worker and creates worker-specific activity.

Supported demo workers:

- Maya Chen
- Chris Hall
- Sam Ortiz

No worker is hardcoded into the Catch or approval logic.

Last Updated: 2026-07-30
Sprint: 003
Status: Active
