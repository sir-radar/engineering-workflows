---
name: frontend-performance-budget
description: Measure and enforce explicit frontend performance budgets using field Core Web Vitals, repeatable Lighthouse CI runs, compressed bundle and route-chunk sizes, duplicate-package analysis, image and font loading, React or Vue rendering profiles, long-task detection, and layout-shift diagnosis. Use for performance audits, performance-sensitive implementation, regression gates, or before-and-after optimization work.
---

# Frontend Performance Budget

Separate observed performance defects from speculative optimization. Preserve semantics, accessibility, fidelity, and maintainability while measuring under equivalent conditions.

## Workflow

1. Define the routes, devices, network and CPU profile, cache state, fixtures, browser build, and user journeys to measure.
2. Read [budgets.md](references/budgets.md). Use stricter repository budgets when present; otherwise adopt the documented defaults.
3. Capture a production-build baseline before changing performance behavior. Record raw reports and code state.
4. Follow [measurement.md](references/measurement.md) for field data, Lighthouse CI, asset transfer, duplicate packages, long tasks, and layout shifts.
5. Use `scripts/measure-bundles.mjs` on the exact emitted assets required by each changed route. Use `assets/budgets.json` unless the project supplies an approved budget file.
6. Profile rerenders only when interaction traces or framework tools show update cost. Read [framework-profiling.md](references/framework-profiling.md) for React and Vue.
7. Fix the measured bottleneck at its owning layer. Avoid broad memoization, eager preloading, indiscriminate code splitting, or fidelity changes without evidence.
8. Repeat the same measurement protocol. Compare absolute budgets and deltas, including variance across five Lighthouse runs.
9. Produce `assets/performance-report.md` with commands, environment, baseline, result, artifacts, and tradeoffs.

## Decision rules

- Field p75 Core Web Vitals outweigh a single lab score when sufficient representative field data exists.
- Lab results gate deterministic regressions but do not predict every user's field experience.
- An optimization is accepted only when the target metric improves beyond normal variance without regressing another required budget or product contract.
- A passing aggregate bundle size does not excuse an oversized route entry, duplicate runtime package, render-blocking font, or avoidable layout shift.
- Document project-specific budget overrides with owner, rationale, expiry or review condition, and before/after evidence.

## Completion gate

Report measured results, not adjectives. If the environment, build, fixture, or baseline differs, state that the comparison is invalid and rerun it. Do not claim improvement when only production code shape was inspected.
