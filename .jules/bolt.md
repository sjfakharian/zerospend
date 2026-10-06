## 2025-02-12 - Schwartzian Transform for orderRoutes in ZeroSpend Policy
**Learning:** The ZeroSpend router policy dynamically grades and sorts hundreds of routes per request. The original `orderRoutes` used `Array.prototype.sort()` and calculated the grade for each route on every comparison using inline string checks and math. This generated excessive computational overhead on the hot path (O(N log N) complex calculations instead of O(N)).
**Action:** Always pre-calculate expensive sorting criteria using an O(N) map pass (the Schwartzian transform pattern: decorate-sort-undecorate) to perform the math and string checks exactly once per item, and then sort based on the primitive results.

## 2024-05-18 - Deferring expensive regex on large text inputs
**Learning:** In LLM proxies/routers, request body messages can be massive (e.g., hundreds of kilobytes or even megabytes of context). Running expensive operations like `.toLowerCase().replace(/\s+/g, " ")` eagerly at the beginning of a function for *every* request creates a massive synchronous CPU spike (Event Loop blocking) on long contexts, even when that variable is only used in a fallback edge-case (e.g., checking if the prompt is < 240 chars).
**Action:** Defer heavy string manipulations and regex operations until immediately before they are needed. Use fast pre-conditions (like `text.length <= 1000`) to avoid running heavy Regexes at all if the outcome is deterministically false.
## 2026-10-06 - Deferring text extraction in classification
**Learning:** Extracting stringified message context sequentially across large array inputs for deterministic classification carries unnecessary O(N) cost if fast object checks (like `body.tools`) would immediately cause an early return.
**Action:** Defer extracting or aggregating text components from complex JSON bodies until all fast, metadata-based preconditions are evaluated, effectively turning an O(N) operation into O(1) on certain paths.
## 2026-10-06 - Parallelizing async operations in loops
**Learning:** Sequential `await` in loops can lead to poor performance, particularly when the inner body contains multiple async calls (e.g. network checks like `verifyFree` and `healthCheck`). It multiplies the latency by the number of iterations.
**Action:** Use `Promise.all` with `Array.prototype.map` to execute loop bodies concurrently when the iterations are independent.
