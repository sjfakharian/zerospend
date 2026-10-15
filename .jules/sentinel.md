## 2024-10-13 - XSS vulnerability in live benchmark provider display
**Vulnerability:** `liveBenchmarkState.currentProvider` was injected into the DOM without escaping in `apps/console/public/app.js` during live benchmark updates.
**Learning:** SSE (Server-Sent Events) payloads received from the backend must be treated as untrusted input when updating the frontend DOM, especially for fields like provider or model names which might originate from external APIs.
**Prevention:** Always wrap dynamically injected string variables with `esc()` when building HTML via template literals.
