# Vue implementation reference

- Preserve the repository's Vue version, router, SSR or SPA architecture, store/query layer, styling, and single-file-component conventions.
- Prefer Composition API and `<script setup>` when established. Keep props and emits explicit and typed.
- Keep domain data out of visual primitives. Use slots for genuine composition and named variants for stable design states.
- Prevent SSR hydration drift from time, locale, randomness, media state, invalid HTML, and client-only branches.
- Do not destructure reactive state in ways that lose reactivity. Keep computed values pure and effects scoped with cleanup.
- Use stable keys from domain identity. Measure before `v-memo`, shallow reactivity, virtualization, or async components.
- Use native elements and Vue Router links according to semantics. Preserve keyboard and focus behavior through conditional rendering.
- Convert exact SVGs into typed SFC components. For assets with internal IDs, use Vue's `useId` on supported versions or require a collision-safe prefix from the existing app.
- Test component behavior with the repository's Vue test stack and complete journeys with Playwright.

Inspect installed Vue and router documentation for version-sensitive APIs.
