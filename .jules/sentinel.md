## 2025-02-14 - Fix length-based timing attack in authorization
**Vulnerability:** The codebase implemented constant-time string comparison for authorization tokens using `timingSafeEqual(match ? x : y, y)`. This compares the secret against itself when lengths don't match, causing the execution time to be proportional to the secret's length, thereby leaking it.
**Learning:** Comparing the secret against itself in a fallback branch still leaks the secret's length because `timingSafeEqual` takes time proportional to the buffer lengths.
**Prevention:** Ensure constant-time string comparisons perform work proportional to the user-provided input's length by comparing the user input against itself when lengths don't match (e.g., `timingSafeEqual(x, match ? y : x)`).
