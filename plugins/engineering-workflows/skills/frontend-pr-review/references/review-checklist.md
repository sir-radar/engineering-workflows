# Adversarial frontend review checklist

## Scope and diff hygiene

- Does every changed file map to the request?
- Did generated output, debug code, secrets, lockfile churn, broad formatting, or unrelated cleanup enter the diff?
- Are new dependencies justified, compatible, maintained, and used narrowly?

## Behavior and states

- Are loading, background refresh, success, empty, partial, malformed, offline, failure, retry, disabled, validation, and unknown-identifier states intentional where applicable?
- Can rapid input, navigation, unmount, or out-of-order responses show stale data?
- Do mutations prevent duplicates and roll back safely?
- Do apparently actionable controls complete their promise?

## Rendering boundaries

- Are server/client boundaries minimal and correct?
- Can server and client render different time, locale, random IDs, viewport state, or data?
- Are suspense, streaming, hydration, and error boundaries placed around the owning resource?
- Are subscriptions, observers, listeners, and timers cleaned up?

## Components and accessibility

- Are native elements, names, roles, keyboard behavior, focus, and announcements correct?
- Does the component API represent one coherent concept with stable defaults?
- Do variants, tokens, content extremes, responsive states, forced colors, and reduced motion hold?
- Has a local concern polluted a shared API or duplicated an existing component?

## Tests and evidence

- Would a relevant implementation defect make the test fail for the correct reason?
- Are tests deterministic, user-observable, and below the level of the behavior owner?
- Were regression tests proven red when practical?
- Do visual, accessibility, performance, and API-state artifacts describe the final code state?
- Were baselines or assertions weakened to pass?

## Fidelity and performance

- Does the code match exact Figma/reference evidence for copy, assets, typography, geometry, states, and breakpoints?
- Are fonts and images loaded with stable dimensions and priority?
- Did initial JavaScript, route chunks, duplicates, rerenders, long tasks, or layout shifts regress?
