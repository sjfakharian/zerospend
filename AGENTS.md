# Contributor Agent Guide

ZeroSpend is a metadata-only, strict-free LLM router. Keep provider adapters isolated, deterministic routing testable, and all network services bound to loopback by default.

Before submitting changes, run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run docs:build`.

Never commit credentials, prompts, completions, SQL, tool arguments/results, private logs, personal paths, or real provider telemetry. Tests and screenshots must use synthetic fixtures. Unknown cost is not free; no code path may silently select a paid or unverified route.

Document configuration, security impact, and user-visible behavior. Do not weaken fail-open observability: telemetry failures must never block inference.
