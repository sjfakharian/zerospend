## 2024-05-14 - Keyboard Accessibility on Non-Button Interactive Elements
**Learning:** Vanilla JS interactive elements like `<span>` and `<th>` used as toggles or sort headers require explicit keyboard support, otherwise they are inaccessible to keyboard-only users.
**Action:** When adding interactivity to non-button DOM elements, ensure keyboard accessibility by explicitly adding `tabindex="0"`, semantic ARIA roles (like `role="button"`), and `keydown` event handlers for 'Enter' and 'Space'.
