## 2024-05-24 - Interactive non-button elements lack accessibility
**Learning:** Table headers (`<th>`) and other non-button elements with `onclick` handlers in the vanilla JS frontend lack keyboard navigation (tabindex), semantic roles (role="columnheader"), ARIA state (aria-sort), and keyboard event handlers (Enter/Space), preventing screen reader and keyboard-only users from interacting with them.
**Action:** When adding interactivity to non-button DOM elements like `<span>` or `<th>`, explicitly add `tabindex="0"`, semantic ARIA roles, and `keydown` event handlers for 'Enter' and 'Space' to ensure keyboard accessibility.
## 2025-02-18 - Explicit Label Associations in Complex JS Forms
**Learning:** In purely vanilla JS applications building forms with complex template literals, developers frequently omit the `for` attribute on visually-associated labels. This not only causes severe screen reader issues but limits interaction areas for mouse/touch inputs.
**Action:** When inspecting manual DOM string assembly in vanilla JS, explicitly check for `<label>` elements missing a matching `for` attribute and ensure all inputs have a corresponding `id`.
