# Figma inspection checklist

Inspect the exact node and relevant nested instances:

- file key, node ID, frame dimensions, export scale, theme, and state;
- component sets, properties, variants, nested instances, swaps, and exposed text;
- variables, collections, modes, aliases, styles, and local overrides;
- auto-layout direction, gap, padding, alignment, wrapping, grids, constraints, min/max dimensions, and absolute children;
- typography family, weight, size, line height, tracking, paragraph behavior, wrapping, truncation, and baseline alignment;
- fills, strokes, opacity, blends, radii, effects, shadows, masks, clips, and overflow;
- prototype links, overlays, focus or scroll behavior, transitions, and authored motion;
- icon, image, illustration, chart, and font assets plus export settings;
- responsive sibling frames and intentional differences rather than proportional scaling.

Record computed measurements in a compact token and geometry map. Export assets into repository-owned paths; do not commit expiring Figma URLs. If a node contains authored motion, load the applicable Figma motion skill before implementation.
