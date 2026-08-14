# Measurement protocol

## Production baseline

- Use the production build, a pinned browser, deterministic content, and the same host and throttling for baseline and result.
- Record warm and cold cache behavior separately.
- Run Lighthouse five times and use the median result. Preserve all reports so variance remains visible.
- Measure each materially changed route and a representative shared-shell route.

## Field data

Use representative Real User Monitoring or CrUX data when available. Segment p75 by route or page type, device class, geography, and release window where sample sizes permit. Do not compare unmatched populations.

## Assets and dependencies

- Derive the assets required by a route from framework build manifests or captured network requests.
- Measure transferred compressed bytes. Also inspect parse and execution cost for JavaScript.
- Inspect duplicate versions in the lockfile and generated bundle. A shared package can appear in separate route chunks without being a runtime duplicate; verify emitted code.
- Check responsive image dimensions, codecs, preload priority, lazy loading, font subsets, `font-display`, and layout reservation.

## Runtime

- Record a performance trace for the exact interaction. Identify long tasks, scripting, style, layout, paint, and input delay.
- Use `PerformanceObserver` or the browser trace to attribute layout-shift entries to moving nodes and missing space reservation.
- Verify server rendering and hydration before moving work to the client.
- Measure list and chart behavior with realistic data sizes before adding virtualization or downsampling.

## Lighthouse CI

Adapt `assets/lighthouserc.cjs` to real production routes. Use the official [Lighthouse CI configuration](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md). Keep deterministic authentication and fixture setup local; do not upload private reports to public temporary storage.
