# Launch claim ledger

This ledger was checked against the `docs/launch-media` source tree and its synthetic tests on 2026-08-13. Provider inventories and free offers are volatile; launch media therefore uses deterministic synthetic routes and never implies that a named external model is currently available.

## VERIFIED

| Claim | Evidence | Public wording boundary |
|---|---|---|
| Requests are classified deterministically into task aliases | `packages/router/src/classifier.mjs`; classifier unit tests | “Deterministic task-aware routing.” Do not imply ML-based intent classification. |
| Only verified zero-cost, available, production-eligible routes can enter configured chains | `packages/router/src/policy.mjs`; policy tests | “Unknown cost is not free.” Verification reflects current stored evidence, not a permanent guarantee. |
| Paid or unverified fallback is rejected | `validateConfig`, `eligibleFallbacks`, recovery tests | “No silent paid fallback.” If free capacity is exhausted, the request fails. |
| HTTP 429 is treated as temporary capacity state | `packages/router/src/recovery.mjs`; OpenCode Free 429 tests | “A rate-limited route can fall through to another verified-free route.” Do not call a synthetic 429 a live outage. |
| Provider discovery and probes are bounded | provider adapters and discovery tests | “Bounded verification.” Avoid “continuous probing”; scheduled discovery is periodic. |
| Quota-efficient synthetic benchmarking and ranking infrastructure exists | `packages/benchmark/src/index.mjs`; benchmark tests | “Synthetic benchmarks inform ranking.” Do not claim universal model quality. |
| OpenAI-compatible chat, streaming, tools, and structured request shapes are tested | `tests/integration/mock-openai.test.mjs` | Compatibility still depends on the selected provider/model capability. |
| Local console exposes routing, model, provider, benchmark, usage, safety, and automation metadata | console APIs, UI, and integration tests | Use only synthetic screenshots in public media. |
| Observability excludes prompt/completion/SQL/tool payload content | `packages/observability/src/store.mjs`; privacy tests | Token counts and operational metadata are stored; content is not. |
| Router and console bind to loopback by default | router and console servers; lint/test coverage | “Local by default,” not a claim that every optional dependency is local. |
| Hermes, TypingMind, and generic OpenAI-compatible clients can target the local endpoint | integration docs and OpenAI-compatible fixture test | Hermes/TypingMind configuration formats may change upstream. |

## DEMO/SYNTHETIC

- All model names, provider counts, requests, token counts, latency values, benchmark scores, 429 events, and successful fallback events shown in launch assets.
- The launch sequence `SQL → verified-free route A → synthetic 429 → verified-free route B → 200`.
- Console screenshots and provider-capacity badges in the media kit.
- Any “healthy” state, zero paid routes, or zero unverified routes shown in a frame is the deterministic demo fixture state.

## EXPERIMENTAL

- OpenCode Free through optional local 9Router. Eligibility requires current official free evidence, local mapping, and a bounded successful probe. OpenCode Zen is excluded from fallback.
- OmniRoute as optional discovery/capacity infrastructure. It is not required for core operation and only independently verified zero-cost routes may be admitted.
- Linux service installation. macOS is the primary supported platform.

## NOT READY FOR PUBLIC CLAIM

- That any particular external provider or model is available or free at publication time.
- “Zero cost forever,” unlimited capacity, guaranteed uptime, or guaranteed model quality.
- Production adoption, user count, request volume, savings, stars, or comparative benchmark leadership.
- Automatic real-time provider discovery on every request. Discovery and benchmark jobs are scheduled/manual and bounded.
- Endorsement by OpenRouter, NVIDIA, OpenCode, 9Router, OmniRoute, Hermes, or TypingMind.
- That the console stores no data. It stores metadata, but not prompt/completion/SQL/tool payload content.
