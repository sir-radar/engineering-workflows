# Breaking-change review

Treat a change as potentially breaking when it alters:

- rendered element, role, focus order, keyboard behavior, accessible name, or announcement;
- default visual variant, token value, spacing, size, or responsive behavior;
- prop type, default, event timing, slot shape, ref target, or controlled-state semantics;
- CSS selector or data attribute documented for consumers;
- server/client boundary, hydration output, or package entrypoint;
- snapshot, story, or test behavior relied on by downstream packages.

Inspect every repository consumer and public package surface. Prefer additive migration with a deprecation window when compatibility matters. Provide a codemod only when the transformation is deterministic and tested. Never hide a breaking change behind a patch version or a broad snapshot update.
