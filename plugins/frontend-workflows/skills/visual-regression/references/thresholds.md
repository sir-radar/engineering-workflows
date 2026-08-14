# Thresholds and baseline approval

Use repository budgets when they are stricter. Otherwise use:

| Capture | `threshold` | `maxDiffPixelRatio` |
| --- | ---: | ---: |
| Full page | `0.1` | `0.001` |
| Component or region | `0.1` | `0.0005` |

These are rasterization tolerances, not design tolerances.

- Allow at most 1 CSS pixel of unexplained positional or dimensional variance. Allow 2 only for a documented browser rasterization cause.
- Fail any changed text, asset, state, responsive behavior, clipping, wrapping, font family, weight, or semantic control even when the pixel ratio passes.
- Never mask the target component, widen a threshold, or hide an animation merely to make a failure disappear.
- Prefer a focused region snapshot when unrelated page pixels dominate the diff.

Approve a baseline only when:

1. The requirement or authoritative evidence changed.
2. Actual, expected, and diff artifacts were inspected.
3. The new image was generated in the pinned environment.
4. Structural assertions and accessibility semantics still pass.
5. The baseline change contains no unrelated output.
6. The approval and evidence source are recorded.
