# Frontend Workflows Toolkit Agent Guide

## Toolkit maintenance

- Keep the plugin manifest, marketplace entry, skill names, and policy version aligned.
- Initialize new skills with the Codex `skill-creator` scaffold and validate every skill with its official validator.
- Keep each `SKILL.md` concise, imperative, and under 500 lines. Put detailed or framework-specific material in directly linked one-level references.
- Test every bundled script with representative success and failure fixtures before committing it.
- Do not add app code, project-specific assets, MCP servers, hooks, external runtime dependencies, or remote publishing without explicit scope.
- Update shared project policy only inside the managed block. `scripts/sync-policy.mjs` distributes that block without overwriting consumer-owned instructions.

<!-- frontend-workflows:start version=0.5.0 -->
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
| `$caveman` | Automatic token-efficient user-facing communication for every task | Explicit style requests, correctness, clarity, safety, and required progress updates override compression |
| `$wayfinder` | Explicit planning of uncertain efforts too large for one agent task as linked decision maps | Manual invocation only; plan decisions rather than implementing the destination |
| `$figma-ui-implementation` | One-shot UI implementation from Figma, screenshots, exports, or layer CSS | Own evidence-to-code orchestration; do not approve its own final work |
| `$design-system-governance` | Reuse, extend, local-create, or shared-create decisions | Do not force reuse without semantic and consumer fit |
| `$api-state-contracts` | Data-backed UI, schemas, fixtures, races, rollback, and drift | Do not invent backend behavior or values |
| `$visual-regression` | Deterministic screenshots, Figma comparison, baselines, and diff diagnosis | Pixel thresholds never excuse structural differences |
| `$frontend-accessibility-audit` | WCAG 2.2 AA automated and manual audit plus retesting | Automated scans are not conformance proof |
| `$frontend-performance-budget` | Field/lab metrics, bundles, rendering profiles, and regression budgets | Optimize measured problems, not intuition |
| `$fallow` | Complete dead-code, duplication, and health analysis before code-bearing commits | Findings require review; never auto-fix or suppress merely to pass |
| `$frontend-pr-review` | Final read-only adversarial frontend review | Findings-first; return fixes to the owning workflow |

For a Figma or image-to-UI task: run implementation, applicable design/API checks, visual regression, accessibility audit, measured performance, and final PR review in that order. A required failure returns to its owning workflow and invalidates affected evidence.

## Communication mode

Load `$caveman` automatically at the start of every task and keep it active for user-facing responses unless the user requests normal prose or another explicit style. Use its `full` level by default.

- Preserve technical accuracy, exact code, commands, paths, errors, numbers, units, qualifications, and negation.
- Let system, developer, repository, user, safety, accessibility, and tool-progress requirements override compression.
- Use normal concise prose when compression could make a warning, approval, ordered procedure, high-stakes qualification, or clarification ambiguous; resume afterward.
- Keep persisted artifacts in their required native style. Do not apply caveman voice to code, comments, documentation, commits, issues, pull requests, memory, or third-party messages unless explicitly requested.
- Honor `stop caveman`, `normal mode`, `/caveman off`, or equivalent immediately. Honor explicit intensity changes for the rest of the task.

## Wayfinder planning mode

Use `$wayfinder` only when the user explicitly invokes it for a foggy multi-session effort or supplies an existing Wayfinder map. Do not auto-trigger it for a clear request, ordinary task tracking, or an implementation plan.

- Prefer a repository-configured tracker; otherwise use Wayfinder's local Markdown fallback. Do not select an external tracker from a remote alone.
- Preview and obtain authority for issue creation, assignment, comments, labels, dependencies, and closure unless the user's request already explicitly authorizes those writes.
- Keep decision maps concurrency-safe: one non-research ticket per task, deterministic claim ownership, pre-resolution re-verification, and append-only map events.
- When the route is clear, hand execution to the applicable specialist workflow. Wayfinder does not implement or approve its own destination.

## Artifact handoff

Keep compact working artifacts in task memory or a temporary directory unless repository policy requires committed documentation:

- evidence manifest and state matrix;
- visual verification report and raw actual/expected/diff images;
- accessibility applicability and findings report;
- performance baseline and final measurements;
- API-state and contract report;
- design-system decision record;
- Wayfinder decision map, claim/event ledger, and cleared-route handoff when explicitly invoked;
- final verification record and PR-review verdict.
- complete Fallow analysis envelope and finding disposition for code commits.

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
- measured performance budgets when the surface changes materially;
- complete Fallow analysis against the final state of every code-bearing commit.

Do not claim a check that did not run successfully against the final code state. Do not weaken configuration, delete coverage, approve changed baselines blindly, or suppress failures to pass.

## Task branch gate

Create or switch to a dedicated branch before the first repository edit for every new task that may modify files. Treat a task as new when it is independently reviewable or materially different from the current branch's purpose.

1. Inspect the current branch, upstream and integration base, status, recent commits, and relevant diff before branching.
2. Continue the current branch only for a direct follow-up within the same task and acceptance criteria. Do not create a branch for read-only work or a separate branch for every commit within one task.
3. For a new task, branch from the correct current integration branch or an explicitly required parent before editing. Follow the repository naming convention; when none exists, use `ft/<short-kebab-case-task>`.
4. Do not commit task work directly to `main`, `master`, or another default/integration branch unless the user explicitly requests that exception.
5. If unrelated uncommitted work, unpushed commits, or an ambiguous base prevents safe branching, do not stash, reset, move, or carry the work silently. Use a separate worktree when safe and authorized; otherwise stop and request direction.
6. After switching, verify the active branch and starting point. Report the branch, base, commits, verification, and remaining worktree state at handoff.

## Fallow commit gate

Run the complete Fallow static flow for every commit containing code or code-affecting configuration, including executable frontend source, styles, schemas, manifests, lockfiles, and build or test configuration. Documentation-only and policy-only commits are exempt.

1. Load and follow the installed `$fallow` skill.
2. Stage the coherent commit, ensure no relevant unstaged edit makes the analysis scope ambiguous, and run the full repository analysis from the repository root:

   ```bash
   FALLOW_AGENT_SOURCE=codex fallow --format json --quiet --explain 2>/dev/null || true
   ```

3. Require the root JSON envelope to identify the combined full analysis. Review dead-code, duplication, and health results; distinguish pre-existing warnings from findings introduced by the staged change.
4. Block the commit when Fallow is unavailable, returns a runtime-error envelope, or leaves an error-severity finding attributable to the commit. Do not auto-fix, suppress, or reconfigure a rule merely to pass.
5. Record the command, analyzed revision and dirty state, finding disposition, and any accepted pre-existing warning. Any later relevant edit invalidates the result and requires a rerun before commit.

## Git safety and collaboration

- Keep branches and commits scoped to one coherent concern. Preserve unrelated changes and avoid destructive Git operations or history rewriting without explicit authorization.
- Treat the task branch gate as mandatory before repository edits; a later commit does not repair work that began on the wrong branch.
- Review staged and unstaged diffs before each commit. Commit only complete, verified units with truthful imperative messages.
- Treat the Fallow commit gate as mandatory for every code-bearing commit; never bypass it with `--no-verify` or a documentation-only classification that does not match the staged diff.
- Do not push, publish, merge, rebase, amend, force-push, or create external resources unless requested.
- Share concise progress and blockers during long work. Pause only for missing evidence, material scope decisions, required review boundaries, or external/destructive authorization.

## Completion

Work is complete only when requirements and evidence map to implemented behavior; applicable states and responsive layouts are intentional; accessibility and performance budgets are verified; visual differences are explained; tests and builds pass; required Fallow analysis covers the final code state; the final diff is focused; and independent review has no unresolved blocking finding.

Report the working outcome, important files, commands and real results, viewports and states checked, accessibility and performance evidence, approved departures, and anything incomplete ordered by user impact.
<!-- frontend-workflows:end -->
