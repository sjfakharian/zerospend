## 2025-02-14 - Fix Timing Attack Vulnerability in Token Comparison
**Vulnerability:** The token comparison logic uses early return based on the length of tokens, which introduces a timing attack vulnerability that can leak token length and make it easier to bypass authentication.
**Learning:** Returning early during token comparisons based on length defeats the purpose of `timingSafeEqual`, as an attacker can still glean information about token length through the initial check and potentially infer characters when matching identical prefixes.
**Prevention:** Always compare length in constant time. If lengths mismatch, use `timingSafeEqual` comparing `x` and `x` and return `false`, which hides the token length.
