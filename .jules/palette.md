## 2024-11-01 - Add keyboard support to interactive DOM elements
**Learning:** Found an accessibility issue pattern where `<span>` elements handling click events to toggle modes in vanilla JS lacked keyboard support (e.g. `tabindex="0"`, `role="button"`, `keydown` events). Adding these improves accessibility.
**Action:** When adding interactivity to non-button DOM elements like `<span>` in the vanilla JS frontend, ensure keyboard accessibility by explicitly adding `tabindex="0"`, `role="button"`, and `keydown` event handlers for 'Enter' and 'Space'.
