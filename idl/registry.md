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
- [ ] Progress Rail
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

## Registry Rules

- Add components only when the product needs them.
- Assign an ID only after a reusable component exists in code.
- Document the component in `components.md` when it is created.
- Reuse an existing component before creating a new one.
- Update this registry whenever the component system changes.
- Component IDs are assigned sequentially when a reusable component is first created.
- Component categories determine where a component is listed; IDs do not.

