# Component contracts

Review these as one public contract:

- semantic element, role, accessible name, description, relationships, keyboard behavior, focus management, and announcements;
- props, events/emits, slots/children, refs, controlled and uncontrolled behavior, defaults, and error handling;
- variants, sizes, states, content constraints, responsive rules, themes, and motion preferences;
- token names and fallback behavior;
- server/client and hydration behavior;
- supported composition and prohibited nesting;
- tests, examples, and migration expectations.

Variant completeness must evaluate default, hover, focus-visible, active, selected, expanded, disabled, loading, empty, error, long content, missing content, responsive layouts, forced colors, and reduced motion where applicable.

Document behavior through executable examples and public tests. Do not expose internal DOM structure as an API unless consumers genuinely require it.
