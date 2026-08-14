# Frontend Workflows Toolkit Agent Guide

## Toolkit maintenance

- Keep the plugin manifest, marketplace entry, skill names, and policy version aligned.
- Initialize new skills with the Codex `skill-creator` scaffold and validate every skill with its official validator.
- Keep each `SKILL.md` concise, imperative, and under 500 lines. Put detailed or framework-specific material in directly linked one-level references.
- Test every bundled script with representative success and failure fixtures before committing it.
- Do not add app code, project-specific assets, MCP servers, hooks, external runtime dependencies, or remote publishing without explicit scope.
- Update shared project policy only inside the managed block. `scripts/sync-policy.mjs` distributes that block without overwriting consumer-owned instructions.

<!-- frontend-workflows:start version=0.1.0 -->
# Evidence-Driven Frontend Workflow Policy

## Mission and scope

Implement and review frontend interfaces with complete behavior, semantic HTML, WCAG 2.2 AA accessibility, deterministic visual evidence, explicit API states, measured performance, and focused Git history.

Build exactly the requested surface. Do not add speculative features, copy, routes, states, assets, dependencies, abstractions, redesigns, or unrelated cleanup. Never hide incomplete work behind placeholders, fake handlers, TODOs, weakened checks, or broad baseline updates.

## Source precedence

Use more specific repository instructions when they define a stricter order. Otherwise resolve conflicts through:

1. Current explicit user requirements and corrections.
2. Written acceptance criteria and product contracts.
3. Backend implementation and runtime behavior.
4. Exact target Figma nodes and supplied reference images or assets.
5. Existing repository architecture, components, tokens, tests, and conventions.
6. Official installed-version documentation for implementation mechanics.

Do not guess a fact that materially changes content, behavior, asset identity, semantics, data contracts, or layout. Investigate verifiable ambiguity; ask only for a genuinely blocking choice. Record approved departures.

## Required startup inspection

Before editing:

- Read applicable instructions, requirements, manifests, relevant source, tests, contracts, and design evidence.
- Inspect the branch, upstream/base, status, and current diff. Preserve user work and distinguish pre-existing failures.
- Identify framework, router, rendering boundaries, styling, state/query layer, package manager, lockfile, and real validation commands.
- Inventory nearby components, tokens, fonts, assets, schemas, fixtures, and browser-test setup.
- Translate acceptance requirements into traceable implementation and verification items.

## Skill routing

Use only installed skills whose trigger applies. Specialist skills own workflow mechanics; this policy owns the final quality bar.

| Skill | Use for | Boundary |
| --- | --- | --- |
| `$figma-ui-implementation` | One-shot UI implementation from Figma, screenshots, exports, or layer CSS | Own evidence-to-code orchestration; do not approve its own final work |
| `$design-system-governance` | Reuse, extend, local-create, or shared-create decisions | Do not force reuse without semantic and consumer fit |
| `$api-state-contracts` | Data-backed UI, schemas, fixtures, races, rollback, and drift | Do not invent backend behavior or values |
| `$visual-regression` | Deterministic screenshots, Figma comparison, baselines, and diff diagnosis | Pixel thresholds never excuse structural differences |
| `$frontend-accessibility-audit` | WCAG 2.2 AA automated and manual audit plus retesting | Automated scans are not conformance proof |
| `$frontend-performance-budget` | Field/lab metrics, bundles, rendering profiles, and regression budgets | Optimize measured problems, not intuition |
| `$frontend-pr-review` | Final read-only adversarial frontend review | Findings-first; return fixes to the owning workflow |

For a Figma or image-to-UI task: run implementation, applicable design/API checks, visual regression, accessibility audit, measured performance, and final PR review in that order. A required failure returns to its owning workflow and invalidates affected evidence.

## Artifact handoff

Keep compact working artifacts in task memory or a temporary directory unless repository policy requires committed documentation:

- evidence manifest and state matrix;
- visual verification report and raw actual/expected/diff images;
- accessibility applicability and findings report;
- performance baseline and final measurements;
- API-state and contract report;
- design-system decision record;
- final verification record and PR-review verdict.

Every artifact identifies the code revision and dirty diff it covers. Treat it as stale after an affected change.

## Engineering and state rules

- Follow the existing stack. Keep strict types and preserve server/client, hydration, routing, caching, and data boundaries.
- Use native elements before ARIA or custom interaction. Implement keyboard, focus, names, relationships, announcements, forced colors, zoom/reflow, and reduced motion as applicable.
- Normalize untrusted data at the boundary. Render missing values explicitly and keep independent resources independently recoverable.
- Cancel or ignore obsolete requests so the last user choice wins. Bound retries and prove optimistic rollback where used.
- Reuse components only when semantics, states, behavior, accessibility, and geometry match. Avoid one-off shared props and duplicate concepts.
- Use authoritative repository-owned assets. Validate SVGs and prevent reusable ID collisions. Never substitute a similar icon without approval.
- Test user-visible behavior with deterministic fixtures. Avoid arbitrary sleeps, external network data, broad snapshots, and implementation-detail assertions.
- Measure performance before and after under equivalent conditions. Do not trade away semantics, accessibility, fidelity, or maintainability for a speculative optimization.

## Quality gates

Run the repository's real equivalents of:

- focused unit and component tests;
- complete browser journeys and relevant failure states;
- accessibility automation plus keyboard and manual checks;
- deterministic exact-viewport visual comparison;
- lint and formatting checks;
- strict typecheck;
- production build;
- relevant backend or contract checks;
- browser console and failed-network inspection;
- measured performance budgets when the surface changes materially.

Do not claim a check that did not run successfully against the final code state. Do not weaken configuration, delete coverage, approve changed baselines blindly, or suppress failures to pass.

## Git safety and collaboration

- Keep branches and commits scoped to one coherent concern. Preserve unrelated changes and avoid destructive Git operations or history rewriting without explicit authorization.
- Review staged and unstaged diffs before each commit. Commit only complete, verified units with truthful imperative messages.
- Do not push, publish, merge, rebase, amend, force-push, or create external resources unless requested.
- Share concise progress and blockers during long work. Pause only for missing evidence, material scope decisions, required review boundaries, or external/destructive authorization.

## Completion

Work is complete only when requirements and evidence map to implemented behavior; applicable states and responsive layouts are intentional; accessibility and performance budgets are verified; visual differences are explained; tests and builds pass; the final diff is focused; and independent review has no unresolved blocking finding.

Report the working outcome, important files, commands and real results, viewports and states checked, accessibility and performance evidence, approved departures, and anything incomplete ordered by user impact.
<!-- frontend-workflows:end -->
