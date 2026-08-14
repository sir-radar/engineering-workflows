---
name: frontend-accessibility-audit
description: Audit frontend interfaces against applicable WCAG 2.2 Level A and AA requirements using native-semantics review, axe, keyboard and widget testing, zoom and reflow, forced colors, reduced motion, and screen-reader-oriented verification. Use for new or materially changed UI, accessibility reviews, remediation verification, or accessibility defect triage.
---

# Frontend Accessibility Audit

Audit behavior, not the presence of ARIA attributes. Treat automated scanning as one evidence source, never as conformance proof.

## Audit workflow

1. Freeze the code revision, route matrix, states, target browsers, and user journeys under review.
2. Read [wcag22-aa.md](references/wcag22-aa.md). Mark each criterion applicable, not applicable with rationale, passed with evidence, failed, or blocked.
3. Inspect native HTML, accessible names and descriptions, landmarks, headings, relationships, status messages, forms, errors, tables, and media before inspecting ARIA.
4. Inventory composite widgets. Read [widget-patterns.md](references/widget-patterns.md) only for patterns present in the interface.
5. Run the repository's existing axe integration. If absent and Playwright is present, adapt `assets/playwright-axe.ts` without weakening tags or excluding nodes.
6. Execute keyboard-only journeys and widget scripts. Adapt `assets/widget-keyboard-helpers.ts` to real locators and product behavior.
7. Complete zoom, reflow, contrast-mode, motion, pointer, and screen-reader-oriented checks in [manual-verification.md](references/manual-verification.md).
8. Classify findings with [severity.md](references/severity.md). Cite the criterion, user impact, evidence, location, and minimum valid remediation.
9. Return defects to implementation. Retest the exact failure and affected journey against the final code state.
10. Produce `assets/accessibility-report.md`. Separate verified passes, unresolved failures, blockers, and untested assumptions.

## Native-first rule

- Use native elements and browser behavior whenever they express the control.
- Add ARIA only when native semantics cannot represent the required composite widget.
- Never add a role that removes useful native semantics or pair a role with incomplete keyboard behavior.
- Treat WAI-ARIA APG examples as pattern guidance, not production components or a normative conformance standard.
- Do not invent inaccessible custom behavior to match a visual reference. Resolve the design conflict explicitly.

## Completion gate

Do not report WCAG 2.2 AA conformance from an audit of a subset. Report the exact routes, states, criteria, assistive technology, browser, and checks covered. Any open P0 or P1 finding blocks completion; any lower-severity applicable failure remains a disclosed failure until fixed or explicitly accepted by the responsible owner.
