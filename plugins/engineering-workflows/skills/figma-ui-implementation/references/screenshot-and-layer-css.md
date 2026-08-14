# Screenshot and Figma layer CSS workflow

Use this mode when image screenshots and copied Figma layer CSS are the complete design input. Do not require a Figma URL, node ID, or live design-context access.

## Establish the evidence boundary

1. Inspect every screenshot at original resolution. Record its pixel dimensions, visible state, theme, scroll position, and viewport or device-pixel ratio when known.
2. When viewport metadata is absent, use the screenshot pixel canvas as the exact comparison size and record that assumption. Do not invent a device class or scale factor.
3. Label each CSS block with its source layer name when supplied. Otherwise map it to the smallest unambiguous visible region and record the mapping.
4. Build a compact region map covering hierarchy, order, bounds, spacing, alignment, typography, fills, strokes, radii, effects, clipping, and visible assets.
5. Classify uncovered facts. Ask only for blocking behavior, content, or asset identity; do not ask for Figma access merely to increase confidence.

## Translate the evidence

- Use the screenshot for visible hierarchy, content, relative geometry, wrapping, crop, overlap, state, and final rendered appearance.
- Use layer CSS for exact declared values at that layer and state: dimensions, flex properties, gaps, padding, typography, colors, borders, radii, shadows, opacity, and effects.
- Treat copied Figma CSS as measurement output, not a DOM structure or stylesheet to paste. Translate it into semantic HTML and the repository's existing layout and token system.
- Reuse an existing token only when its computed value matches the evidence. Preserve an exact local value when no matching token exists; do not change shared tokens for a single screenshot.
- Prefer normal document flow, Flexbox, or Grid. Use absolute positioning only for genuine overlays or independently positioned children evidenced by the screenshot and CSS.
- Treat screenshot pixels as the visual authority when rasterization makes CSS values appear slightly different. Record material conflicts instead of averaging values.

## Do not infer unsupported design facts

A screenshot does not prove hidden content, hover or focus states, interaction behavior, accessible names, breakpoint rules, intrinsic asset files, or off-canvas layout. Layer CSS does not prove semantic grouping, DOM order, reusable component boundaries, or responsive intent.

Derive semantics and behavior from product contracts and existing repository patterns without changing the visible target. Implement authored states only when evidence or product behavior requires them. Keep unknown responsiveness structurally sound at intermediate widths, but label it inferred rather than design-authoritative.

## Handle icons and assets

Inventory supplied and repository-owned assets before asking for anything. If a dedicated icon visible in the screenshot has no exact match, follow [asset-and-svg.md](asset-and-svg.md): request the precise missing files in one batch, continue independent work, and do not substitute, trace, crop, or redraw them.

## Verify

Render the implemented state at each evidence size with deterministic content. Compare actual and reference images through overlays and pixel diffs, then diagnose differences against the region and CSS maps. Also test intermediate widths for overflow and usability; do not claim screenshot-exact responsive behavior where no responsive evidence exists.
