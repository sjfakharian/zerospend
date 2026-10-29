## 2025-02-23 - Interactive Element Accessibility
**Learning:** The vanilla JS console frontend uses non-semantic elements (like `<span>` and `<th>`) for interactive controls. This requires manual addition of `role="button"`, `tabindex="0"`, and specific `keydown` event listeners for 'Enter' and 'Space' to ensure keyboard accessibility.
**Action:** When adding or modifying interactive elements that aren't `<button>` or `<a>`, explicitly implement ARIA roles, tabindex, and keyboard event handlers to maintain accessibility.
