## 2024-05-24 - Interactive non-button elements lack accessibility
**Learning:** Table headers (`<th>`) and other non-button elements with `onclick` handlers in the vanilla JS frontend lack keyboard navigation (tabindex), semantic roles (role="columnheader"), ARIA state (aria-sort), and keyboard event handlers (Enter/Space), preventing screen reader and keyboard-only users from interacting with them.
**Action:** When adding interactivity to non-button DOM elements like `<span>` or `<th>`, explicitly add `tabindex="0"`, semantic ARIA roles, and `keydown` event handlers for 'Enter' and 'Space' to ensure keyboard accessibility.
## 2024-05-18 - Add confirmation to destructive provider actions
**Learning:** Destructive actions like removing or disconnecting a provider can easily happen by mistake on a cluttered interface if they lack a confirmation dialog.
**Action:** Added a native `confirm()` check for 'delete' and 'disconnect' provider actions.
