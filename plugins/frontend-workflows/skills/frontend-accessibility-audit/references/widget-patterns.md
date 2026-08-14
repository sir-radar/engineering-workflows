# Composite widget verification

Primary pattern reference: [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/). APG is non-normative; preserve native controls when available.

## Dialog and modal dialog

- Opening moves focus to a deliberate element inside the dialog.
- `Tab` and `Shift+Tab` remain inside a modal; `Escape` closes when product behavior permits.
- Closing restores focus to the invoker or the next logical element.
- The dialog has an accessible name; description is used only when it improves reading order.
- Background content is inert for a modal and not reachable by pointer or assistive technology.

## Tabs

- The tablist, tabs, and tabpanels have correct relationships and unique IDs.
- One tab is selected and in the tab sequence.
- Arrow keys move focus according to orientation, with documented wrapping behavior.
- Activation follows the chosen automatic or manual model consistently; manual activation uses `Enter` or `Space`.
- Hidden panels are removed from interaction and the accessibility tree.

## Combobox

- Use a native `select` when it satisfies the requirement.
- Expose the input or button, popup type, expanded state, and active option relationship.
- Support text editing keys without hijacking them.
- `ArrowDown` or the product's documented command opens and navigates; `Escape` closes without unexpected value loss; `Enter` commits when applicable.
- Announce selection and result-count changes without duplicating speech.

## Menu and menu button

- Use ordinary links or buttons for site navigation unless application-menu behavior is genuinely required.
- The trigger exposes expanded state and controls the menu.
- Arrow keys move among menuitems; `Home`, `End`, `Escape`, and typeahead work when applicable.
- Focus enters intentionally and returns to the trigger on dismissal.

## Tooltip

- A tooltip supplements an existing accessible name; it does not contain interactive content.
- It appears on keyboard focus as well as hover, remains while pointer or focus is over trigger/tooltip, and dismisses with `Escape`.
- Its relationship is conveyed with `aria-describedby` when the tooltip text is an accessible description.

## Disclosure

- Prefer a native `button` controlling a region.
- Expose expanded state and a stable controlled-element relationship.
- `Enter` and `Space` toggle. Collapsed content is not focusable or exposed as visible content.
