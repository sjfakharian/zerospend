## 2026-10-28 - Interactive Non-Button Elements Missing Keyboard Support
**Learning:** Interactive non-button DOM elements (like `<th>` used for sorting) in the vanilla JS frontend lack keyboard navigation and semantic roles, making them inaccessible to screen readers and keyboard users.
**Action:** When adding interactivity to `<th>`, `<span>`, or `<div>` elements, always include `tabindex="0"`, `role="button"`, and `onkeydown` event handlers for 'Enter' and 'Space'.
