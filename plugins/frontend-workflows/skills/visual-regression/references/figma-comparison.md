# Figma and reference-image comparison

1. Export or capture the exact node and state at the authoritative frame dimensions. Record file key, node ID, theme, viewport, and export scale.
2. Match browser viewport and CSS pixel dimensions. Do not rescale one image to disguise a frame mismatch.
3. Load the exact fonts and assets before capture.
4. Use deterministic fixture content matching the design evidence. Do not replace real application states with a screenshot.
5. Compare hierarchy first: frame bounds, major regions, overflow, fixed or sticky behavior, and responsive condensation.
6. Compare typography, spacing, color, borders, radii, shadows, opacity, crop, and baseline alignment.
7. Inspect the heatmap. Classify every material cluster as implementation defect, evidence difference, environment variance, or approved departure.
8. Retest required intermediate widths for layout integrity even when no reference image exists there.

Do not average conflicting references. Determine whether they represent different states, variants, breakpoints, or stale evidence; otherwise surface the conflict.
