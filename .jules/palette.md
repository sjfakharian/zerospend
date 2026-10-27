
## 2026-10-27 - Make non-button interactive elements keyboard accessible
**Learning:** In the vanilla JS frontend, adding interactivity to non-button DOM elements like <span> or <th> requires explicit tabindex="0", ARIA roles, and keydown handlers for Enter/Space to ensure keyboard accessibility.
**Action:** Always add tabindex="0", role="button", and Enter/Space keyboard handlers when attaching click listeners to non-native interactive elements.
