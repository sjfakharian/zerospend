# OpenCode (experimental / advanced)

OpenCode’s official provider flow is `/connect`; the selected integration may use an API key, OAuth, environment variables, or a combination. There is no single beginner credential URL that ZeroSpend can safely assume. OpenCode is therefore disabled by default and is not part of first-run onboarding. Advanced users should first establish a supported connection using the [official provider documentation](https://opencode.ai/docs/providers/).

Free offerings can change. A route becomes eligible only when current official advertised-free evidence, normalized catalog metadata, and live availability agree. Ambiguous or stale offers remain excluded.

ZeroSpend's `opencode-free` CLI option is different: it is a no-auth OpenCode Free route supplied by optional local 9Router. It does not use OpenCode Zen and does not create or request `opencode.token`.

Eligibility requires two current signals: OpenCode's official catalog identifies a current free model, and a bounded model probe succeeds through local 9Router using its `oc/` provider alias. Neither model names nor the public catalog alone prove local capacity. The aggregate `/v1/models` endpoint is connection-driven and may omit the no-auth OpenCode Free provider. 9Router's dashboard uses `/api/providers/suggested-models`, but that management endpoint can require dashboard authentication and is not ZeroSpend's unattended adapter contract. The inventory and evidence timestamp are refreshed by `zerospend discover`; unsupported-model HTTP 406 responses stale the old route and trigger one cooldown-bounded refresh.

The official catalog currently returns an OpenAI-style `{ "object": "list", "data": [...] }` object. Each model entry has an `id`, but no price field; ZeroSpend accepts only the catalog's explicit `-free` IDs and rejects ambiguous entries. No individual model name is hardcoded. 9Router's current registry declares provider ID `opencode`, alias `oc`, no authentication at the upstream provider, and passthrough models. Therefore official `model-id` maps explicitly to local `oc/model-id`; already-prefixed `oc/model-id` is normalized once, and other provider prefixes are rejected.

9Router can independently require an API key at its local `/v1` boundary even though OpenCode Free itself needs no authentication. If provider test reports `local_backend_auth_required`, open the loopback dashboard, go to Endpoint settings, disable **Require API Key**, and retry. This is appropriate only while 9Router remains loopback-only. ZeroSpend does not change that security setting or read 9Router's private key database automatically.

Bounded local diagnostics (they expose no credentials):

```sh
curl --fail --max-time 3 http://127.0.0.1:20128/api/health
curl --fail --max-time 5 https://opencode.ai/zen/v1/models
zerospend provider test opencode-free
zerospend discover
zerospend models
```

The second command is current provider evidence only; it does not establish local availability. `zerospend discover` performs the required bounded local probes. Provider test reports backend reachability, inventory endpoint reachability, no-auth identity, current model count, evidence availability, and zero production eligibility until those probes succeed. A reachable backend with zero models is not healthy production capacity.

OpenCode discovery fetches health within three seconds and the catalog within five seconds. It probes no more than three current candidates, allows five seconds per probe, and stops after the first success. Failures are classified by stage, including `official_catalog_unavailable`, `official_catalog_timeout`, `official_catalog_invalid`, `no_current_free_models`, `local_route_mapping_failed`, `local_backend_auth_required`, `local_probe_rejected`, and `local_probe_timeout`.
