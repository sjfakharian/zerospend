## 2025-02-12 - Schwartzian Transform for orderRoutes in ZeroSpend Policy
**Learning:** The ZeroSpend router policy dynamically grades and sorts hundreds of routes per request. The original `orderRoutes` used `Array.prototype.sort()` and calculated the grade for each route on every comparison using inline string checks and math. This generated excessive computational overhead on the hot path (O(N log N) complex calculations instead of O(N)).
**Action:** Always pre-calculate expensive sorting criteria using an O(N) map pass (the Schwartzian transform pattern: decorate-sort-undecorate) to perform the math and string checks exactly once per item, and then sort based on the primitive results.

## 2024-05-18 - Deferring expensive regex on large text inputs
**Learning:** In LLM proxies/routers, request body messages can be massive (e.g., hundreds of kilobytes or even megabytes of context). Running expensive operations like `.toLowerCase().replace(/\s+/g, " ")` eagerly at the beginning of a function for *every* request creates a massive synchronous CPU spike (Event Loop blocking) on long contexts, even when that variable is only used in a fallback edge-case (e.g., checking if the prompt is < 240 chars).
**Action:** Defer heavy string manipulations and regex operations until immediately before they are needed. Use fast pre-conditions (like `text.length <= 1000`) to avoid running heavy Regexes at all if the outcome is deterministically false.
## 2026-10-06 - Deferring text extraction in classification
**Learning:** Extracting stringified message context sequentially across large array inputs for deterministic classification carries unnecessary O(N) cost if fast object checks (like `body.tools`) would immediately cause an early return.
**Action:** Defer extracting or aggregating text components from complex JSON bodies until all fast, metadata-based preconditions are evaluated, effectively turning an O(N) operation into O(1) on certain paths.
## 2025-02-12 - Fast structural preconditions for regex in streams
**Learning:** Eagerly running complex regular expressions (like those for LLM tool extraction) on raw, potentially massive request bodies or chunks of text streams can cause significant CPU spikes and block the Node.js Event Loop.
**Action:** Always check fast structural preconditions (e.g. `!text.includes('<')`) before executing expensive regular expressions on streaming text paths to achieve massive speedups on non-matching strings.
