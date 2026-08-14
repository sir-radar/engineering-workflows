# UI state matrix

| Component/resource | Category | State | Evidence or contract | UI behavior | Test | Status |
| --- | --- | --- | --- | --- | --- | --- |

Evaluate applicable states:

- Interaction: default, hover, focus-visible, pressed, selected, expanded, disabled.
- Data: initial loading, background loading, success, empty, partial, malformed, failure, retry.
- Form: pristine, edited, valid, invalid, submitting, success, rollback or failure.
- Content: short, long, missing, wrapped, truncated, repeated, localized where supported.
- Responsive: authoritative frames, breakpoints, and required intermediate behavior.
- Accessibility: keyboard, screen-reader semantics, zoom/reflow, forced colors, reduced motion.

Status values: implemented, not applicable with evidence, or blocked.
