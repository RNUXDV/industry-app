# Industry Component Registry

The Component Registry is the master index of reusable Industry components.

It shows which components exist, how they are classified, and what still needs to be built.

---

## Primitive Components

Small, reusable elements that support larger components.

- [x] IDL-001 — Status Pill
- [x] IDL-002 — Avatar
- [ ] Icon
- [ ] Button
- [ ] Badge
- [ ] Input
- [ ] Toggle

---

## Composite Components

Components built by combining smaller primitives.

- [x] IDL-003 — Presence Card
- [ ] Schedule Card
- [ ] Timeline
- [x] IDL-004 — Progress Railwhere 
- [ ] Message Preview
- [ ] Notification Card

---

## Experience Components

Larger product experiences composed from reusable components and interaction patterns.

- [x] Catch
- [ ] Crew
- [ ] Jobs
- [ ] People
- [ ] Schedule

---

## Catch to My Shifts Workflow

### Status
Implemented

### Flow
Catch Board
→ Interest
→ Selected
→ Confirmed
→ Added to My Shifts

### Behavior
- Confirmed catches appear alongside imported shifts.
- Confirmed catches use the label `Confirmed catch`.
- My Shifts re-renders whenever the view opens.
- Dashboard and bottom navigation show the same stored shift state.
- Missing station, manager, and notes fields use fallback copy instead of displaying `undefined`.

### Data
- Shift records are read from the shared shifts store.
- Catch responses are read from `industry-v2-shift-responses`.
- Confirmed responses are merged into the My Shifts list.

---

## Shift Command Card Workflow

### Status
Implemented

### Flow
My Shifts
→ Shift Command Card
→ View Details
→ Shift Details
→ View Crew or Release Shift

### Behavior
- Each shift card uses `View details` as the primary management entry point.
- Shift Details dynamically displays the selected shift.
- Imported shifts and confirmed catches use the same detail workflow.
- Shift time, role, workplace, manager, status, and notes update from the selected shift record.
- Missing optional fields use fallback copy.
- Crew and release actions are centralized inside Shift Details.
- Duplicate `View shift crew` actions were removed from My Shifts cards.

### Architecture
- My Shifts acts as the shift navigation layer.
- Shift Details acts as the operational control center.
- `openShiftDetails(shift)` populates and opens the shared detail view.
- Selected shift IDs are passed to the Crew and Release actions for future lifecycle development.

---

# Industry Design Language Registry

The Industry Design Language (IDL) is the single source of truth for reusable UI components, interaction patterns, and user workflows.

Each document defines a specific part of the product and should be updated whenever new reusable systems are introduced.

---

# Documents

## components.md

Reusable interface components shared throughout Industry.

Current Components

- Status Pill
- Avatar
- Presence Card
- Progress Rail

---

## flows.md

Defines reusable user workflows and behavioral systems.

Current Flows

### Shift Transfer Flow

Status: Defined (Implementation in Progress)

Purpose

- Release an entire scheduled shift.
- Route the shift to either:
  - The Catch Board (public)
  - A specific coworker (private)
- Define the complete lifecycle of a transferred shift.

Key Concepts

- Shift-centered workflow
- Release
- Catch
- Direct Offer
- Shift Lifecycle
- Shift States
- UX Rules
- Language Standards

---

# Documentation Guidelines

When adding new work:

1. Build the feature.
2. Identify reusable elements.
3. Document reusable UI in `components.md`.
4. Document reusable workflows in `flows.md`.
5. Update this registry.
6. Commit and push changes.

---

Last Updated

Schedule V1 Milestone

---

## Registry Rules

- Add components only when the product needs them.
- Assign an ID only after a reusable component exists in code.
- Document the component in `components.md` when it is created.
- Reuse an existing component before creating a new one.
- Update this registry whenever the component system changes.
- Component IDs are assigned sequentially when a reusable component is first created.
- Component categories determine where a component is listed; IDs do not.

