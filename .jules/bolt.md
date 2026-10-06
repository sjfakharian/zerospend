## 2024-03-20 - Per-Request File I/O Optimization
**Learning:** Reading configuration or secrets directly from the filesystem on every request (via `fs/promises`) introduces significant event loop blocking and latency overhead, especially under high concurrency, even if the files are small and OS-level caching is present.
**Action:** Utilize an in-memory `Map` to cache hot-path secrets after reading them once, ensuring to clear the cache during scheduled or dynamic inventory refresh operations to maintain correctness. Use synthetic benchmarking tools to prove the elimination of I/O blocking.
