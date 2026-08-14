# Remediation action policy

Use this policy for each Fallow finding or proposed action. Prefer a verified safe edit, but optimize for preserving code behavior and user flow rather than maximizing the number of removed warnings.

## Classify before acting

Record four independent judgments:

1. **Attribution:** task-introduced, pre-existing in a task-owned file, or unrelated.
2. **Truth:** confirmed, probable, false positive, or unresolved.
3. **Impact:** behavior-neutral, internal behavior, public contract, or user-visible flow.
4. **Action:** Fallow-native auto-fix, targeted mechanical edit, manual remediation, disposition only, or blocked.

Do not infer safety from finding severity, confidence, category, or repository-wide reach alone. A warning can describe a public contract; an error can be pre-existing and unrelated.

## Decision matrix

| Finding or action | Default action | Auto-apply only when | Never do automatically |
| --- | --- | --- | --- |
| Unused export keyword | Preview Fallow fix | The symbol remains locally used, no external or generated consumer exists, package exports are unchanged, and the file is task-owned | Delete the symbol or file solely because its export is unused |
| Unused dependency | Preview Fallow fix | Manifest and lockfile changes are task-scoped; scripts, config, plugins, CLIs, code generation, optional peers, and runtime loading do not use it; install/build/tests validate | Remove tooling or runtime packages based only on import-graph absence |
| Unused enum member | Preview Fallow fix | No serialized, persisted, API, schema, telemetry, reflection, or external value depends on the member | Renumber or reinterpret enum values |
| Unused pnpm catalog entry | Preview Fallow fix | No workspace, template, generator, release process, or external consumer references it | Rewrite unrelated catalog or lockfile content |
| Duplicate export | Prefer a targeted edit | One canonical export is proven and consumers keep the same import contract | Create or weaken Fallow configuration to silence the duplicate |
| Unused file, type, class, or variable | Investigate, then edit manually | Entry-point, framework discovery, dynamic loading, side effects, tests, generated files, public APIs, and off-graph consumers are ruled out | Recursively delete files or broad directories from a repository-wide report |
| Duplication | Refactor manually only when valuable | Semantics, lifecycle, accessibility, error behavior, types, and tests are equivalent; the abstraction reduces real maintenance cost | Merge superficially similar code or expand task scope merely to reduce a metric |
| Complexity or health recommendation | Add tests or refactor manually | The hotspot is exercised, behavior is characterized, and the focused change has a measurable maintenance or reliability benefit | Rewrite stable behavior solely to lower a score |
| Suppression, ignore, baseline, or rule change | Evidence-backed exception only | Repository policy explicitly authorizes it and the false-positive rationale, narrow scope, and expiry or owner are recorded | Use it to make the gate pass |

## Scope rules

- Prefer task-introduced findings first.
- Fix a pre-existing finding in a file already changed by the task only when the edit is mechanically behavior-neutral, validation is available, and it does not obscure the task diff.
- Report pre-existing findings outside task-owned files separately. Obtain explicit authority before repository-wide cleanup.
- If a global `fallow fix --dry-run` preview includes any out-of-scope edit, reject the global application. Reproduce only eligible edits with normal editing tools, then rerun analysis.
- Always pass `--no-create-config` to preview and apply commands. Existing configuration is project policy, not an automatic-fix target.

## Validation loop

After a fix:

1. Inspect the exact diff for collateral formatting, lockfile churn, API changes, generated output, and unrelated files.
2. Run focused regression tests for the affected symbol, route, state, build path, or security boundary.
3. Run applicable repository gates under the same environment used for the baseline.
4. Restage the coherent change and rerun full Fallow analysis plus staged-diff security analysis.
5. Stop after three remediation cycles or sooner if the same finding returns, the fix oscillates, scope expands, or behavior becomes uncertain.

No clean report compensates for a broken test, changed user flow, weakened rule, or incomplete analysis envelope.
