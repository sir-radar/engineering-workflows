# Reviewing specialist evidence

Every artifact must identify the code revision and dirty diff it covers. Treat evidence as stale after an affected change.

## Visual

Inspect actual, expected, and diff images, environment normalization, thresholds, capture matrix, and baseline decision. Sample the highest-risk viewport and state independently.

## Accessibility

Inspect the applicability matrix, axe result, keyboard scripts, manual checks, assistive-technology pairing, findings, and remediation retests. Automated scans alone are insufficient.

## Performance

Inspect production build commands, five raw Lighthouse runs, route asset membership, compressed totals, field-data segmentation, traces, and before/after comparability.

## API states

Inspect canonical contract evidence, normalization, state matrix, fixture realism, stale-response test ordering, rollback behavior, and drift gate.

## Design system

Inspect inventory search, Figma mapping, reuse/extend/create rationale, consumer analysis, public API, accessibility contract, and breaking-change plan.

## Fallow

Inspect the root combined JSON envelope, analyzed revision and dirty state, dead-code findings, duplicate groups, health findings, severities, and recorded dispositions. Confirm the run covers the final code state and that no later relevant edit made it stale. Missing Fallow, a runtime-error envelope, or an unresolved error-severity finding attributable to the change blocks a code-bearing commit.

Challenge missing raw evidence or implausibly broad pass claims. Do not rerun an expensive unchanged check without a specific verification reason.
