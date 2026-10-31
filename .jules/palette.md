## 2024-10-31 - Keyboard Accessibility for Non-Button Interactive Elements
**Learning:** In the vanilla JS frontend, custom interactive elements (like `<span>` or `<th>`) often lack basic keyboard accessibility since they aren't native `<button>`s.
**Action:** When adding interactivity to non-button DOM elements, ensure keyboard accessibility by explicitly adding `tabindex="0"`, semantic ARIA roles (like `role="button"`), and `keydown` event handlers for 'Enter' and 'Space'.
