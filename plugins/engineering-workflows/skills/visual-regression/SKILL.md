---
name: visual-regression
description: Create, normalize, run, and diagnose deterministic frontend visual-regression tests. Use when Codex needs Playwright screenshots, reference-image or Figma comparisons, baseline governance, pixel-diff thresholds, animation or clock stabilization, font-readiness checks, screenshot naming, or visual failure analysis.
---

# Visual Regression

Build visual evidence that is repeatable enough to block regressions. A passing pixel threshold never excuses an unexplained difference in structure, content, assets, or state.

## Workflow

1. Identify the authoritative references, exact viewport, browser, device scale, theme, locale, data, and UI state.
2. Inspect the repository's existing browser-test configuration and baseline convention. Extend it narrowly.
3. Read [determinism.md](references/determinism.md) and remove uncontrolled time, randomness, network data, fonts, focus, scroll, animation, caret, and transient UI.
4. Copy and adapt the files in `assets/` only when the repository lacks equivalent setup.
5. Name screenshots with `scripts/screenshot-name.mjs`; never rely on auto-numbered snapshot names for durable baselines.
6. Capture the smallest stable surface that proves the requirement. Add full-page captures only when page composition matters.
7. Apply the budgets in [thresholds.md](references/thresholds.md). Keep structural and semantic checks beside the image assertion.
8. For supplied design evidence, follow [figma-comparison.md](references/figma-comparison.md).
9. Diagnose failures with [failure-artifacts.md](references/failure-artifacts.md). Fix the product or stabilization cause before considering a baseline update.
10. Record environment, commands, screenshots, results, and any approved exception using `assets/visual-report.md`.

## Baseline rules

- Generate and compare a baseline on the same operating system, browser build, headless mode, device scale, font set, and color profile.
- Commit intentional baselines with the test that owns them. Never generate baselines silently in CI.
- Require human review of actual, expected, and diff artifacts before updating.
- Reject baseline changes containing unrelated pages, dynamic content masks, hidden product behavior, or broader thresholds.
- Invalidate affected evidence after code, fonts, fixtures, browser versions, or screenshot normalization changes.

## Required output

Report:

- code revision and dirty state;
- reference provenance and dimensions;
- capture matrix and snapshot names;
- normalization applied;
- threshold and raw diff result;
- structural assertions paired with the image;
- baseline decision and reviewer;
- unresolved differences or blockers.

Do not claim exactness when the authoritative reference could not be captured under equivalent conditions.
