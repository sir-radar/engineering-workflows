---
name: frontend-pr-review
description: Perform an adversarial, read-only, findings-first review of frontend pull requests and diffs across accessibility, security, state completeness, rendering and hydration boundaries, request races, component APIs, test integrity, visual fidelity, bundle impact, and unrelated change contamination. Use when a frontend implementation is ready for independent review or when the user asks to review a frontend PR or patch.
---

# Frontend PR Review

Review as a strict maintainer deciding whether the exact change is safe to merge. Do not implement fixes during the review pass.

## Review workflow

1. Establish the base, head, merge base, changed files, uncommitted state, requested scope, acceptance criteria, and repository instructions.
2. Read the final diff before trusting summaries. Identify generated files, dependency changes, broad formatting, and unrelated edits.
3. Inspect surrounding ownership code, tests, schemas, and consumers required to understand the diff.
4. Use [review-checklist.md](references/review-checklist.md) to examine behavior, rendering, races, APIs, tests, fidelity, and performance.
5. Apply [security-review.md](references/security-review.md) to changed trust boundaries and browser behavior.
6. Inspect raw specialist evidence with [evidence-review.md](references/evidence-review.md). A report conclusion is not evidence by itself.
7. Load `$fallow` and `$fallow-remediation` for code-bearing changes. Read the complete remediation record and inspect or rerun the complete root analysis plus staged-diff security scan; verify that their revision and dirty state match the reviewed diff. Treat missing, runtime-failing, stale, unsafe-auto-fix, undispositioned error-severity, unresolved security-candidate, or relevant-blind-spot evidence as a blocking review finding. Keep this review pass read-only.
8. Reproduce high-risk paths or run the smallest relevant commands when safe. Do not mutate application source, baselines, snapshots, or configuration.
9. Classify only actionable findings with [severity-and-output.md](references/severity-and-output.md).
10. Produce `assets/frontend-review-report.md`. Put findings first, ordered by severity, with tight file and line locations.

## Independence rules

- Do not accept implementation intent as proof of behavior.
- Do not review from the intended verdict. Look for counterexamples, missing states, and stale evidence.
- Do not fix findings while presenting the review as independent. Return blocking findings to the owning implementation or audit workflow, then review the resulting diff again.
- Do not invent findings to appear thorough. If no actionable issue remains, say so and list residual risk or unverified scope.
- Do not waive a defect because a test passes; inspect whether the test exercises the real failure mode.

## Review output

For every finding include severity, concise title, user or system impact, exact evidence, reproduction or failing scenario, tight file/line location, and remediation contract. Keep summaries after findings. Separate pre-existing issues and out-of-scope observations.

The verdict is one of: ready, ready with non-blocking findings, changes required, or blocked by missing evidence.
