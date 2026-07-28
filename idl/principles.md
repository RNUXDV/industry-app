# Industry Design Language

# Design Principles

These principles guide every design and engineering decision made within Industry.

---

# 1. Reduce Uncertainty

Every interaction should answer the user's next question.

If an interface creates confusion, the design is incomplete.

---

# 2. Respect User Agency

Industry guides.

The user decides.

No dark patterns.

No manipulation.

No artificial urgency.

---

# 3. Progressive Disclosure

Present only the information necessary for the current decision.

Reveal complexity only when the user requests it.

---

# 4. Consistency Over Novelty

Use familiar patterns before inventing new ones.

Consistency builds confidence.

---

# 5. Calm Interfaces

Whitespace is intentional.

Motion has purpose.

Every visual element should earn its place.

---

# 6. Build Once. Reuse Everywhere.

Reusable components belong in the Industry Design Language.

Experiences are composed from those reusable components.

---

# 7. Workplace First

Every decision should improve the daily experience of service industry professionals.

Technology exists to support the work, not distract from it.

---

# 8. Accessibility by Design

Accessibility is not an enhancement.

It is a design requirement.

Every component should consider keyboard navigation, semantics, readability, and inclusive interaction from the beginning.

---

# 9. Learn Through Iteration

Industry evolves through continuous feedback, observation, and refinement.

Perfection is not the goal.

Progress is.

---

# 10. Human Connection Over Attention

Industry measures success by helping people accomplish meaningful work and build authentic workplace relationships, not by maximizing time spent in the app.

Attention is not the product.

Useful connection, clarity, and trust are.

---

# Principle: Single Source of Truth

Every shift exists as one authoritative record.

Additional views should reference that record rather than replacing it.

---

# Principle: Separation of Concerns

A worker's schedule and workplace requests are different concepts.

My Shifts represents ownership.

Catch Board represents availability.

Each maintains its own responsibilities while remaining linked.

---

# Principle: Synchronized State

A single user action may affect multiple areas of Industry.

When state changes:

- Update data
- Persist data
- Refresh affected interfaces

Every view should present the same application state regardless of navigation path.

---

# Principle: State Before Interface

Behavior is designed before presentation.

Interfaces should communicate application state rather than define it.

---

# Principle: Data Before Display

Application data should always be updated before interface rendering.

Interfaces are reflections of application state, not independent sources of truth.

---
Last Updated: 2026-07-28
Sprint: 002
Status: Active