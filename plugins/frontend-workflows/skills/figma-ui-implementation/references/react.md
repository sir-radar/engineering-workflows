# React implementation reference

- Preserve the repository's router, server/client boundaries, query layer, styling system, and component conventions.
- Keep static layout and data rendering on the server when the architecture supports it. Add a client boundary only around stateful browser behavior.
- Prevent hydration drift from time, locale, randomness, media queries, invalid HTML, and client-only data.
- Build focused semantic components around meaningful responsibilities; avoid a component for every wrapper and avoid premature shared primitives.
- Keep transport, normalization, query state, formatting, behavior, and presentation separable at existing architecture seams.
- Use controlled or uncontrolled state intentionally. Do not mirror props into state without a synchronization contract.
- Use stable keys from domain identity. Measure before applying memoization, virtualization, or downsampling.
- Use router links for navigation, buttons for actions, form elements for input, and tables for tabular data.
- Convert exact SVGs into typed components. Expose `title` or the consuming accessible name; hide decorative instances.
- Test user-observable behavior with the existing React test stack and complete journeys with Playwright.

For React 19 or version-sensitive framework APIs, inspect installed documentation rather than relying on older conventions.
