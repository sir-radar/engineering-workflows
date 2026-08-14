# Default frontend performance budgets

Project-owned budgets override these defaults when they are explicit and no weaker exception was introduced by the current change.

## User-experience budgets

| Metric | Budget |
| --- | ---: |
| Field LCP at p75 | 2,500 ms |
| Field INP at p75 | 200 ms |
| Field CLS at p75 | 0.1 |
| Lighthouse performance score, median of 5 | 0.90 |
| Lighthouse FCP | 1,800 ms |
| Lighthouse LCP | 2,500 ms |
| Lighthouse TBT | 200 ms |
| Lighthouse CLS | 0.1 |
| Core-interaction long task | no task above 50 ms |

Core Web Vitals source: [web.dev thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds).

## Route transfer budgets

Measure compressed bytes required for the changed route's initial state, not every artifact in a monorepo.

| Resource | Budget |
| --- | ---: |
| Initial JavaScript | 200 KiB |
| Individual route or lazy JavaScript chunk | 100 KiB |
| Initial CSS | 100 KiB |
| Initial fonts | 150 KiB |
| Initial images | 500 KiB |

For each category, permit a baseline increase no larger than `max(5% of baseline, 10 KiB compressed)` while still requiring the absolute budget. New duplicate runtime packages are zero-budget unless version divergence is proven necessary.
