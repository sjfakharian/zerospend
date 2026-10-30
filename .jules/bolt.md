## 2025-02-12 - Schwartzian Transform for orderRoutes in ZeroSpend Policy
**Learning:** The ZeroSpend router policy dynamically grades and sorts hundreds of routes per request. The original `orderRoutes` used `Array.prototype.sort()` and calculated the grade for each route on every comparison using inline string checks and math. This generated excessive computational overhead on the hot path (O(N log N) complex calculations instead of O(N)).
**Action:** Always pre-calculate expensive sorting criteria using an O(N) map pass (the Schwartzian transform pattern: decorate-sort-undecorate) to perform the math and string checks exactly once per item, and then sort based on the primitive results.

## 2024-05-18 - Deferring expensive regex on large text inputs
**Learning:** In LLM proxies/routers, request body messages can be massive (e.g., hundreds of kilobytes or even megabytes of context). Running expensive operations like `.toLowerCase().replace(/\s+/g, " ")` eagerly at the beginning of a function for *every* request creates a massive synchronous CPU spike (Event Loop blocking) on long contexts, even when that variable is only used in a fallback edge-case (e.g., checking if the prompt is < 240 chars).
**Action:** Defer heavy string manipulations and regex operations until immediately before they are needed. Use fast pre-conditions (like `text.length <= 1000`) to avoid running heavy Regexes at all if the outcome is deterministically false.

## 2026-10-06 - Deferring text extraction in classification
**Learning:** Extracting stringified message context sequentially across large array inputs for deterministic classification carries unnecessary O(N) cost if fast object checks (like `body.tools`) would immediately cause an early return.
**Action:** Defer extracting or aggregating text components from complex JSON bodies until all fast, metadata-based preconditions are evaluated, effectively turning an O(N) operation into O(1) on certain paths.

## 2024-10-08 - String Concatenation vs Array.join
**Learning:** When generating large strings from complex nested objects (like chat messages in `textOf`), using standard `for` loops with direct string concatenation (`+=`) is up to ~4x faster than using array methods (`.filter()`, `.map()`, `.join()`). The array methods allocate multiple intermediate arrays that the garbage collector has to clean up, which causes noticeable overhead on hot paths like request classification.
**Action:** Whenever a function needs to parse structures and concatenate strings on a hot path, prefer a single-pass `for` loop over chained higher-order array methods.

## 2025-02-12 - Fast structural preconditions for regex in streams
**Learning:** Eagerly running complex regular expressions (like those for LLM tool extraction) on raw, potentially massive request bodies or chunks of text streams can cause significant CPU spikes and block the Node.js Event Loop.
**Action:** Always check fast structural preconditions (e.g. `!text.includes('<')`) before executing expensive regular expressions on streaming text paths to achieve massive speedups on non-matching strings.

## 2024-10-11 - Double Array Filter vs Map/Dictionary vs For-Loop Optimization
**Learning:** In V8, while single-pass dictionary/Map grouping avoids nested looping, a simple nested `for` loop over small arrays (e.g. `providers` array of size 5, `routes` array of size ~100) actually outperforms Map grouping and object dictionary grouping, while single-pass `for..of` iterations heavily outperform dual `Array.filter` calls that create intermediate arrays, likely due to avoiding V8 object/Map allocation and GC overhead in hot metadata loops.
**Action:** When counting occurrences matching specific criteria in an array inside a `.map`, always prefer a single `for..of` or `for` loop that aggregates multiple counts in one pass rather than calling `.filter().length` repeatedly on the same array.

## 2025-03-05 - Avoid chained array methods on object keys/values for hot paths
**Learning:** `capacityHealth` was computing system capacity stats using `Object.entries(aliases).filter(...).map(...)` and `Object.values(proofs).filter(...).length` on every invocation. This caused large numbers of intermediate arrays and garbage collection pressure when running against many aliases and routes.
**Action:** Replace `Object.entries`, `Object.values`, `.filter`, and `.map` chains on hot paths with single-pass `for...in` loops to minimize intermediate allocations and GC overhead.
