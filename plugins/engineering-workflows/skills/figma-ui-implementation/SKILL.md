---
name: figma-ui-implementation
description: Implement production frontend interfaces exactly from Figma URLs or node IDs, image screenshots, copied Figma layer CSS, and exported assets in an existing React or Vue stack. Use for one-shot design-to-code work, including tasks where screenshots and layer CSS are the only design evidence and no Figma file access exists, that requires evidence manifests, state completeness, authoritative assets, semantic implementation, deterministic visual comparison, accessibility, measured performance, and adversarial final review.
---

# Figma UI Implementation

Own the complete evidence-to-code loop. Build exactly the requested surface and no speculative features, copy, states, assets, dependencies, or abstractions.

## One-shot workflow

1. Read every applicable `AGENTS.md`, requirement, design brief, repository convention, current diff, package manifest, route, test, data contract, token, component, and asset before editing.
2. Establish the acceptance checklist and source precedence. Classify uncertainty as blocking, verifiable, or incidental using [evidence-workflow.md](references/evidence-workflow.md).
3. Select the evidence mode; do not require live Figma access when screenshots and copied layer CSS are the available design contract.
   - For a Figma URL or node ID, load and follow the available `figma-design-to-code` prerequisite skill before any design-context call. Use exact file and node IDs; inspect with [figma-inspection.md](references/figma-inspection.md).
   - For screenshots plus Figma layer CSS, inspect the images at original resolution and follow [screenshot-and-layer-css.md](references/screenshot-and-layer-css.md). Record the observed viewport and state, map every CSS block to a visible layer, and state any evidence boundary without requesting a Figma link.
   - For mixed evidence, use each source only for what it proves and resolve conflicts through source precedence.
4. Create `assets/evidence-manifest.md` and keep it current. Inventory repository assets with `scripts/inventory-assets.mjs`. Record missing dedicated icons separately from layout uncertainty.
5. Load `$design-system-governance` to map Figma components and decide reuse, extension, or local creation when a component decision exists.
6. Load `$api-state-contracts` for every data-backed surface. Complete `assets/state-matrix.md`; mark states implemented, not applicable with evidence, or blocked.
7. Read [asset-and-svg.md](references/asset-and-svg.md). Validate SVGs with `scripts/validate-svg.mjs` and convert exact assets with `scripts/convert-svg-component.mjs` when the project does not already provide a matching component. If a visible dedicated icon has no exact supplied or repository-owned match, ask the user for the icon file in one concise, identified batch; continue independent work while affected instances remain blocked.
8. Read [react.md](references/react.md) or [vue.md](references/vue.md), never both unless the repository contains both target surfaces. Implement through the existing stack, TDD, semantic HTML, and real behavior.
9. Load `$visual-regression`; capture and remediate every required viewport, state, and variant with deterministic data.
10. Load `$frontend-accessibility-audit`; fix applicable WCAG 2.2 AA failures and rerun affected checks.
11. Load `$frontend-performance-budget`; measure changed routes and interactions. Fix only observed or budgeted regressions.
12. Run repository lint, format check, strict typecheck, focused tests, browser tests, production build, console/network checks, and [adversarial-self-check.md](references/adversarial-self-check.md).
13. Complete `assets/verification-record.md` against the final code state.
14. Before every code-bearing commit, load `$fallow` and run its complete root analysis against the coherent staged change. Review dead-code, duplication, and health findings; block the commit for an unavailable/runtime-failing analyzer or an unresolved error-severity finding caused by the change. Rerun after any relevant edit.
15. Load `$frontend-pr-review` for a read-only final pass. Return blocking findings to the owning workflow and repeat affected gates before handoff.

Proceed continuously unless design evidence is materially ambiguous, a required asset or permission is missing, a destructive or external action needs authorization, or repository policy requires a review boundary.

## Evidence rules

- Treat Figma-generated code as measurement evidence, not production code to paste.
- Treat a screenshot plus its copied Figma layer CSS as sufficient design evidence for the visible viewport and state. Do not require a Figma URL, node ID, or design-context call in that mode.
- Do not guess copy, assets, behavior, data, responsive intent, or accessible names.
- Do not substitute icon libraries, emoji, CSS drawings, generated images, or similar frames for missing authoritative assets.
- Ask for missing dedicated icon files after checking supplied and repository-owned assets. Identify each icon by screenshot location, role, state, and desired format; do not ask the user to re-provide unrelated design evidence.
- Do not implement the interface as a screenshot, canvas replica, absolute-positioned frame dump, or inaccessible interactive `div` tree.
- Preserve intentional clipping, overflow, fixed or sticky placement, stacking, and breakpoint condensation.
- Ask only when a missing fact materially changes user-visible output and cannot be derived from evidence.

## Handoff contract

Lead with the working outcome. Report important components, commands and real results, visual viewports and states, accessibility checks, performance measurements, approved departures, blockers, and the focused Git diff. Never claim a check that did not run against the final code state.
