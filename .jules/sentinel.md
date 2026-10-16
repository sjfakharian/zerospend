## 2025-02-14 - HTML Injection via Untrusted Interpolation in Template Literals

**Vulnerability:** Untrusted property (`l.type`) from Server-Sent Events (SSE) data stream was directly injected into the DOM within a `class` attribute (`<span class="${l.type}">`) in `apps/console/public/app.js` using raw template literals and `innerHTML`.

**Learning:** The frontend avoids modern frameworks (like React/Vue) and instead uses vanilla JS with raw `innerHTML` assignments for dynamic rendering. While there is a global `esc()` sanitization function, its usage is not enforced mechanically (e.g., via ESLint or type checkers). It is easy to miss escaping variables, particularly in attributes (like `class`) where developers might not anticipate XSS vectors, but an attacker controlling the value can break out of the attribute context and inject arbitrary HTML.

**Prevention:**
1. When working with raw `innerHTML` and template literals, *every* dynamic interpolation (`${...}`) sourced from external data or APIs must be explicitly wrapped in `esc()` unless the value is verifiably static and safe.
2. Consider implementing a custom lint rule or pre-commit hook to detect unescaped template literal interpolations within `.innerHTML` assignments across the codebase.
