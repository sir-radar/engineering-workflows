# Manual accessibility verification

## Keyboard

- Complete every primary journey with keyboard only.
- Verify logical focus order, visible focus, skip navigation, no traps, no focus loss, and correct focus restoration.
- Check controls in default, disabled, loading, error, expanded, and validation states.

## Zoom and reflow

- Test browser zoom at 200% for all content and controls.
- Test reflow at a 320 CSS-pixel-wide viewport or equivalent 400% zoom at 1280 CSS pixels.
- Confirm no two-dimensional scrolling except content that inherently requires it, no clipped controls, and no lost information or function.
- Apply text-spacing overrides from WCAG 1.4.12 and verify content remains usable.

## Forced colors and contrast

- Emulate or enable forced-colors mode, then inspect text, focus, selected state, borders, icons, and custom controls.
- Verify text, non-text UI, focus indicators, and state distinctions with a contrast measurement tool.
- Confirm meaning is not encoded only by color.

## Motion

- Enable `prefers-reduced-motion: reduce` before navigation.
- Confirm nonessential motion is removed or reduced and essential state changes remain understandable.
- Verify pause, stop, or hide behavior for applicable moving content.

## Screen-reader-oriented checks

Use at least the project's supported desktop pairing, such as VoiceOver with Safari on macOS or NVDA with Chrome/Firefox on Windows. Record the pairing.

- Navigate by landmarks and headings.
- Inspect links, buttons, form controls, tables, and regions through element lists or shortcuts.
- Verify names, roles, values, descriptions, required/invalid state, expanded/selected state, and current location.
- Exercise dynamic loading, errors, validation, dialogs, and composite widgets; listen for missing, duplicated, or badly timed announcements.
- Confirm reading order matches visual and task order.

Do not treat a DOM accessibility-tree snapshot as a substitute for an assistive-technology interaction check.
