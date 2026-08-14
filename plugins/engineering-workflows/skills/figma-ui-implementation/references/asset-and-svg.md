# Asset and SVG handling

1. Inventory supplied exports and existing repository assets by path, checksum, dimensions or `viewBox`, IDs, and references.
2. Match by authoritative source and rendered geometry, not filename resemblance.
3. Preserve original raster bytes unless format or optimization is explicitly required and visually verified.
4. Provide intrinsic dimensions, responsive sizing, crop behavior, loading priority, and meaningful `alt`; use empty `alt` for decorative raster images.
5. Validate SVGs before conversion. Reject scripts, `foreignObject`, inline event handlers, external references, duplicate IDs, unresolved local references, or missing `viewBox`.
6. Preserve paths, groups, masks, gradients, clip paths, filters, strokes, and aspect ratio.
7. Prevent ID collisions for reusable components. The bundled converter generates per-instance prefixes for React and Vue components when local IDs exist.
8. Keep decorative SVGs out of the accessibility tree. Give informative instances a consumer-appropriate title or accessible name.

Do not trace, redraw, recolor, optimize, or simplify an exact design asset without explicit evidence and a rendered comparison.
