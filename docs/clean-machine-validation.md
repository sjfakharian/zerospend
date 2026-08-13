# Clean-machine validation

ZeroSpend v0.2.0 was exercised on macOS 26.5.1, Apple Silicon (`darwin-arm64`). The pass found and fixed npm global-permission guidance, architecture/path assumptions, provider credential onboarding, an empty-alias router crash, and 9Router’s overly prominent default role. Hermes/Homebrew troubleshooting now recommends exact-path ownership repair and the packaged Desktop build on Apple Silicon.

No username, credential, private route, or machine-specific path is recorded here. Repeatable validation is covered by synthetic isolated-home tests; no live provider quota is used in CI.
