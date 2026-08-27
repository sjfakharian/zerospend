# Configuration

Runtime state belongs under `~/.zerospend/` by default. Copy the JSON examples under `config/`; never add secrets to JSON configuration. Ports are configurable through environment variables and must bind to loopback unless the operator explicitly accepts network exposure.

Supported bearer-token files are `openrouter.token`, `nvidia.token`, and `tokenharbor.token` under `~/.zerospend/secrets/`. Prefer `zerospend provider add`, which uses hidden terminal input and writes mode `0600`. TokenHarbor's base URL is `https://tokenharbor.ai/v1`; only explicit `:free` routes with zero catalog prices can pass discovery.
