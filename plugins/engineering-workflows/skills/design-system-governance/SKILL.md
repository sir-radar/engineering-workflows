---
name: design-system-governance
description: Govern frontend component and token decisions by inventorying existing implementations, mapping Figma components to code, evaluating reuse versus extension versus local creation, checking token and variant parity, preserving API and accessibility contracts, detecting breaking changes, and preventing duplicate components. Use when adding or changing shared UI, reconciling Figma with a code design system, or reviewing component-library evolution.
---

# Design System Governance

Choose the smallest component decision that preserves semantic coherence and consumer safety. Reuse is not automatically better; duplication is not automatically local independence.

## Workflow

1. Define the requested surface, evidence, consumers, and intended ownership boundary.
2. Inventory existing components, primitives, tokens, stories, examples, tests, and imports with [inventory-and-mapping.md](references/inventory-and-mapping.md). Record findings in `assets/component-inventory.md`.
3. Map each authoritative Figma component, property, variable, and state to code with `assets/figma-component-map.md`.
4. Apply [decision-model.md](references/decision-model.md) to choose reuse, extend, create local, or create shared. Record the decision and rejected alternatives in `assets/component-decision-record.md`.
5. For reuse or extension, inspect every current consumer and the contracts in [component-contracts.md](references/component-contracts.md).
6. Check token parity, variant completeness, responsive behavior, content extremes, and interaction states. Do not add a prop that represents unrelated concepts through a boolean combination.
7. Apply [breaking-changes.md](references/breaking-changes.md). Add migration or compatibility work before changing a shared contract.
8. Add focused examples and tests covering the public behavior and accessibility contract.
9. Search again for duplicate names, markup, styles, and responsibilities before completion.

## Promotion rules

- Reuse when semantics, required states, behavior, accessibility, and rendered geometry already match.
- Extend when the new behavior belongs to the same concept, is additive or safely migratable, and existing consumers remain coherent.
- Create locally when sharing would widen a public API for one consumer, couple unrelated semantics, or compromise exact design behavior.
- Promote to shared ownership when repeated consumers demonstrate a stable common contract. Do not create a design-system abstraction for hypothetical reuse.
- Keep domain behavior outside visual primitives. Keep interaction and accessibility invariants inside the component that owns them.

## Required output

Report inventory evidence, Figma mapping, decision, component owner, token and variant gaps, public API change, consumer impact, accessibility contract, test/examples, migration, and duplicate search. Mark unresolved ownership or breaking-change risk as blocking.
