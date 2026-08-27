# Clean-machine validation

## v0.3.0 release validation

ZeroSpend v0.3.0 was validated on Intel macOS with Node.js 24 using an isolated temporary home and non-default loopback ports. The installer, generated launcher, local token creation, doctor output, Console health endpoint, and effective-port reporting passed. The full synthetic test suite passed 71/71, and lint, typecheck, application build, documentation build, and npm audit passed with zero reported vulnerabilities.

The configured TokenHarbor integration was also exercised separately with sanitized live acceptance checks: authenticated catalog access succeeded, bounded discovery produced current verified-free routes, and one synthetic request returned HTTP 200 through a verified `:free` route. No credential, prompt content, completion content, or provider telemetry is included in the repository. Availability remains time-varying and this validation is not a promise of continuous capacity.

ZeroSpend v0.2.0 was exercised on macOS 26.5.1, Apple Silicon (`darwin-arm64`). The pass found and fixed npm global-permission guidance, architecture/path assumptions, provider credential onboarding, an empty-alias router crash, and 9Router’s overly prominent default role. Hermes/Homebrew troubleshooting now recommends exact-path ownership repair and the packaged Desktop build on Apple Silicon.

No username, credential, private route, or machine-specific path is recorded here. Repeatable validation is covered by synthetic isolated-home tests; no live provider quota is used in CI.
