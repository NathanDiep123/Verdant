# Product

<!-- impeccable:product-schema 1 -->

> Written by `impeccable init` inside a planning-tier agent that cannot reach the user. Every fact below is inferred from PLAN.md (the user-approved spec) and is labelled [inferred: PLAN.md §n].

## Platform

web

## Users

- Park managers and water agencies deciding where to sample first. [inferred: PLAN.md §1, §14]
- Researchers reading how a score was built. [inferred: PLAN.md §8 item 5]
- Residents and visitors filing citizen bloom reports and reading visitor guidance. [inferred: PLAN.md §8 items 3, 8.1]
- Evaluators: OneAquaHealth / IEEE hackathon judges who see the product mainly through a 4:30 demo video, the Devpost text and the deployed site. [inferred: PLAN.md §2, §3]

## Product Purpose

Verdant is an explainable early-warning tool for freshwater One Health risk (harmful algal blooms, waterborne pathogens, heat and low water). It combines satellite, environmental and citizen signals into a per-site score, explains every score by factor contribution, and ranks sites for field sampling. Success: a manager knows where to look first, and a judge understands that in one viewing. [inferred: PLAN.md §1, §18]

## Positioning

Every score breaks down into published, fixed weights and per-factor contributions; a citizen report changes the score live; one site configuration moves the engine from Lake Mead to a OneAquaHealth city. [inferred: PLAN.md §3, §7]

## Capabilities and Constraints

- Five routes: Dashboard, Site detail, Report a Bloom, OAH Cities, Methodology. [inferred: PLAN.md §8]
- No backend, auth, live feeds or ML. Lake Mead values are prototype data and must say so on screen. [inferred: PLAN.md §2, §4]
- Verdant never confirms toxins and never labels its output an "advisory". [inferred: PLAN.md §8.2, §8.3]
- Stack: React 19, TypeScript, Vite, Tailwind v4, shadcn/ui, Leaflet, Recharts. [inferred: PLAN.md §10]

## Evidence on Hand

- Cited sources only from PLAN.md §19.2 (C1 to C8) and the official Lake Mead elevation (§19.3). No testimonials, users, partners or validation results exist; none may be invented. [inferred: PLAN.md §19]

## Product Principles

1. Every score shows why. [inferred]
2. Prototype and official data are always visibly distinguished. [inferred]
3. Recommend sampling; never diagnose. [inferred]
4. What the video shows must work in the deployed app. [inferred]

## Accessibility & Inclusion

Risk categories must never rely on colour alone (colour-blind users), and the layout must work at 375 px for field use. [inferred: PLAN.md §3 Usability, Task 8.1]
