# Industry

Industry is an early-stage product prototype designed to explore tools and connections for restaurant and service-industry workers.

## Prototype Status

This repository contains an active usability-testing prototype. Features, workflows, interface designs, simulated data, and product concepts are subject to change.

The Schedule pillar uses Supabase authentication and database migrations. Local development uses seeded test accounts and workplace data. The hosted Schedule schema is reconciled, but its controlled test cohort and full hosted workflow regression are still pending. Jobs, People, and parts of the older demo layer continue to use simulated content and browser-local state.

## Usability Testing

Industry is currently being tested to understand how service-industry workers navigate and interpret the product.

Test participants should not enter sensitive, confidential, financial, or personally identifying information into the prototype.

## Ownership

© 2026 Robert Newman. All rights reserved.

The source code, interface designs, written content, visual assets, and other original materials in this repository are provided for evaluation and usability testing. No permission is granted to reproduce, distribute, modify, publish, sublicense, or commercially use these materials without prior written permission.

## Development Status

Industry is currently a backend-integrated prototype preparing for pilot testing. The Schedule pillar uses Supabase authentication, role-aware workplace data, realtime coverage workflows, and database migrations. Jobs and People remain front-end usability-testing prototypes with browser-local state.

The active `backend-schedule` branch contains the current Schedule implementation. The public GitHub Pages site still reflects the older August 10 `main` baseline and should not yet be treated as the hosted Schedule pilot.

See [INDUSTRY_STATUS.md](INDUSTRY_STATUS.md) for the reconciled product history, current implementation boundary, active checkpoint, and recommended next steps.
