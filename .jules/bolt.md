## 2024-10-16 - Intermediate arrays on hot paths
**Learning:** In the ZeroSpend router, when generating large strings from complex nested objects (like chat messages or tool results), array chains like `.map().join()` allocate intermediate arrays and cause measurable garbage collection bottlenecks on hot paths.
**Action:** Replace functional array methods (`.map().join()`) with traditional `for` loops and direct string concatenation (`+=`) on critical performance paths.
