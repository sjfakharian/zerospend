## 2024-05-25 - Interactive Header Accessibility
**Learning:** Non-button interactive DOM elements, such as sortable table headers ('th'), require explicit keyboard accessibility considerations (tabindex, ARIA attributes, keydown listeners for Enter/Space) for proper UX navigation.
**Action:** Always add tabindex='0', role='button', and keydown event handlers when creating custom interactive text elements.
