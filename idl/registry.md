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

## Registry Rules

- Add components only when the product needs them.
- Assign an ID only after a reusable component exists in code.
- Document the component in `components.md` when it is created.
- Reuse an existing component before creating a new one.
- Update this registry whenever the component system changes.
- Component IDs are assigned sequentially when a reusable component is first created.
- Component categories determine where a component is listed; IDs do not.

