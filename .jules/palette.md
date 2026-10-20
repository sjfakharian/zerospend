## 2024-11-20 - Keyboard Accessibility for Non-Button Elements
**Learning:** When non-button elements (like `<span>` or `<th>`) are given interactive behaviors via `onclick` in vanilla JavaScript, they remain invisible to keyboard navigation. This requires explicitly adding `tabindex="0"`, `role="button"`, and handling `keydown` events for 'Enter' and 'Space' to be fully accessible.
**Action:** Always ensure that custom interactive components built with non-semantic elements include keyboard event handlers, explicit roles, and tab flow management.
