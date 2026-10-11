## 2023-10-11 - Global Keyboard Focus Styles
**Learning:** The console lacked explicit keyboard focus indicators (`:focus-visible`), relying on browser defaults which can be inconsistent or invisible on dark backgrounds, severely hindering keyboard-only navigation.
**Action:** Implemented a global `:focus-visible` rule using the theme's primary accent color (`var(--violet)`) and an `outline-offset` to ensure interactive elements are always clearly distinguishable when navigating via keyboard.
