## 2025-02-14 - Fix length-based timing attack in authorization
**Vulnerability:** The codebase implemented constant-time string comparison for authorization tokens using `timingSafeEqual`, but the implementation early-returned if the token lengths did not match (i.e. `x.length===y.length && timingSafeEqual(x,y)`). This exposes the actual secret token's length through a timing attack because length mismatches return faster than matching lengths.
**Learning:** Using `timingSafeEqual` does not prevent timing vulnerabilities if there are early returns based on length prior to the constant-time check. An attacker can iteratively guess the required length by measuring response times.
**Prevention:** Ensure constant-time string comparisons always perform the same amount of work regardless of the input length by using a dummy comparison (e.g. comparing the target buffer against itself) when lengths don't match, while still returning false.

## 2025-02-14 - Fix DOM XSS in live benchmark feed
**Vulnerability:** The live benchmark feed in the ZeroSpend console (`apps/console/public/app.js`) rendered incoming log type text via raw DOM injection (`innerHTML`) without escaping. While most parameters were wrapped in `esc()`, the `.type` field was directly injected as a CSS class name.
**Learning:** Even fields considered "safe" or internal (like a log type, typically 'info', 'error', 'pass', etc.) must be strictly escaped when directly embedded in HTML attributes to prevent XSS if external data sources or future code changes introduce untrusted content into these fields.
**Prevention:** Consistently apply HTML escaping to all template variables injected into the DOM, particularly when rendering real-time or externally-sourced feeds, even for fields expected to be enums.
