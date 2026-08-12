# OpenCode (experimental / advanced)

OpenCode’s official provider flow is `/connect`; the selected integration may use an API key, OAuth, environment variables, or a combination. There is no single beginner credential URL that ZeroSpend can safely assume. OpenCode is therefore disabled by default and is not part of first-run onboarding. Advanced users should first establish a supported connection using the [official provider documentation](https://opencode.ai/docs/providers/).

Free offerings can change. A route becomes eligible only when current official advertised-free evidence, normalized catalog metadata, and live availability agree. Ambiguous or stale offers remain excluded.

ZeroSpend's `opencode-free` CLI option is different: it is a no-auth OpenCode Free route supplied by optional local 9Router. It does not use OpenCode Zen and does not create or request `opencode.token`.
