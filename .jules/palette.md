
## 2026-10-24 - Keyboard Accessibility for Non-Button Elements
**Learning:** When making non-button elements (like `span` or `th`) interactive in vanilla JS, they must explicitly be given `tabindex="0"`, a semantic ARIA role (e.g. `role="button"`), and keyboard event handlers (like `keydown` for Enter and Space) to ensure they are accessible to keyboard and screen reader users.
**Action:** Always verify keyboard accessibility (focus states, tab order, and interaction) when attaching click handlers to non-semantic interactive elements.
