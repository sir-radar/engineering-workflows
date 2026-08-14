# Deterministic browser state

Normalize only nondeterminism; do not change the product state being verified.

## Environment

- Pin the browser and runner version in the lockfile or CI image.
- Use the same operating system, headless mode, viewport, device scale, locale, timezone, color scheme, forced-colors setting, and reduced-motion setting for baseline and comparison.
- Set browser zoom to 100%. Disable extensions and browser UI that can affect the page.

## Page readiness

Wait for explicit product readiness, not arbitrary sleeps:

1. Route navigation completes.
2. Required fixture requests resolve.
3. The target state is visible and stable.
4. `document.fonts.ready` resolves and required families report loaded.
5. Images in the capture region are complete with nonzero intrinsic dimensions.
6. Two consecutive layout measurements match when the UI has asynchronous layout.

## Controlled inputs

- Freeze `Date`, timers used for display, timezone, locale, random IDs, and generated data through application fixtures or dependency injection.
- Fulfill network requests with deterministic fixtures. Preserve realistic lengths, missing fields, and ordering.
- Set focus and scroll explicitly. Hide the text caret through screenshot options rather than product CSS.
- Disable CSS animations and transitions through Playwright screenshot settings or the supplied stability stylesheet. Do not disable meaningful end states.
- Replace third-party frames only when their content is outside the accepted product contract; assert the replacement separately.

## Font readiness assertion

Use a page assertion equivalent to:

```ts
await page.waitForFunction(async () => {
  await document.fonts.ready;
  return [...document.fonts].every((font) => font.status === 'loaded');
});
```

Treat a fallback font as a failed precondition, not an acceptable pixel variance.
