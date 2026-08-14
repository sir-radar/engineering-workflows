---
name: fallow-remediation
description: Run guarded Fallow remediation before code-bearing commits, including full dead-code, duplication, and health analysis; safe auto-fix previews and applications; staged-diff security scanning; manual security and health remediation; validation; and final finding disposition. Use automatically when repository policy requires a Fallow commit gate, when Fallow reports issues, or when Codex should fix Fallow findings without breaking behavior, contracts, or user flows.
---

# Fallow Remediation

Prefer fixing a verified finding over recording it. Apply a fix automatically only when evidence shows that the change is task-scoped, behavior-preserving, and covered by suitable validation.

## Required workflow

1. Load and follow the installed `$fallow` skill for CLI behavior, output envelopes, confidence limits, and rule semantics.
2. Inspect repository instructions, the current branch, base revision, status, staged and unstaged diffs, package manager, entry points, public exports, dynamic loading, framework conventions, and real validation commands.
3. Stage one coherent code-bearing change. Stop if relevant unstaged work makes attribution ambiguous; never move, discard, or absorb unrelated user work.
4. Run the complete repository analysis from the repository root:

   ```bash
   FALLOW_AGENT_SOURCE=codex fallow --format json --quiet --explain 2>/dev/null || true
   ```

5. Require a valid combined root JSON envelope. Treat an unavailable analyzer or runtime-error envelope as a blocker, not a clean result.
6. Run the separate security analysis against the staged patch:

   ```bash
   git diff --cached --unified=0 | FALLOW_AGENT_SOURCE=codex fallow security --diff-file - --format json --quiet 2>/dev/null || true
   ```

7. Classify every relevant finding by attribution, truth, impact, and action safety. Follow [action-policy.md](references/action-policy.md). Distinguish task-introduced findings, pre-existing findings in task-owned files, and unrelated repository findings.
8. For Fallow-native actions, inspect each finding's specific `auto_fixable` value and preview before mutation:

   ```bash
   FALLOW_AGENT_SOURCE=codex fallow fix --dry-run --no-create-config --format json --quiet 2>/dev/null || true
   ```

   Apply the preview automatically only when every proposed edit is eligible and task-scoped:

   ```bash
   FALLOW_AGENT_SOURCE=codex fallow fix --yes --no-create-config --format json --quiet 2>/dev/null || true
   ```

   If a global preview includes an unrelated or unsafe edit, do not run the global apply command. Make only the eligible targeted edits with normal repository editing tools.
9. Investigate health recommendations and security candidates before editing. Remediate verified security findings with [security-remediation.md](references/security-remediation.md). Implement tests, coverage, or focused refactors manually when health evidence proves the need.
10. After every mutation, inspect the diff and run the smallest tests that exercise the affected behavior, then the repository's applicable lint, typecheck, build, browser, contract, accessibility, and security checks. Revert only the task-owned mutation if validation shows a regression; preserve unrelated work.
11. Restage the coherent result and rerun both final analysis commands. Repeat remediation at most three times; stop on a repeated finding, oscillating fix, widening scope, or uncertain behavior.
12. Complete `assets/fallow-remediation-record.md` in task memory or a temporary directory unless repository policy requires a committed artifact. Record commands, revision, dirty state, previews, applied and skipped actions, validation, blind spots, and final dispositions.

## Automatic-fix threshold

Auto-apply only when all are true:

- The individual action reports `auto_fixable: true`, or the equivalent targeted edit is mechanically certain.
- The finding is attributable to the task, or is a behavior-neutral pre-existing issue in a file already owned by the task.
- The preview touches only task-owned files and does not create configuration.
- Static and repository evidence rule out public API, runtime registration, dynamic import, reflection, framework discovery, generated-code, test-fixture, contract, persistence, or user-flow dependencies.
- The change removes no user-visible state or behavior, needs no product judgment, and has deterministic validation.

Do not auto-apply when any condition is uncertain. Do not suppress a finding, update a baseline, weaken a rule, add an ignore, or create Fallow configuration merely to obtain a passing result. Record an evidence-backed false-positive disposition or request direction when a material behavior choice remains.

## Commit blockers

Block a code-bearing commit when any of these remains:

- Fallow is unavailable, the envelope is invalid, or analysis reports a runtime error.
- An attributable error-severity finding is unresolved.
- A staged security candidate is verified, uninvestigated, or cannot be ruled out with evidence.
- An unresolved import, unresolved call edge, or other reported blind spot intersects staged code and could hide a relevant finding.
- A proposed fix is broad, ambiguous, behavior-changing, or fails validation.
- A relevant mutation has not been covered by a fresh final analysis and security scan.

Pre-existing findings outside task scope do not become silent cleanup authority. Record them separately and continue only when repository policy permits their severity.

## Handoff

Report applied fixes first. Then report skipped findings with reasons, final analysis and security results, validation commands and real outcomes, remaining blind spots, and any security follow-up such as credential rotation that requires user or external authority.
