# Configuration

Runtime state belongs under `~/.zerospend/` by default. Copy the JSON examples under `config/`; never add secrets to JSON configuration. Ports are configurable through environment variables and must bind to loopback unless the operator explicitly accepts network exposure.

Supported bearer-token files are `openrouter.token`, `nvidia.token`, and `tokenharbor.token` under `~/.zerospend/secrets/`. Prefer `zerospend provider add`, which uses hidden terminal input and writes mode `0600`. TokenHarbor's base URL is `https://tokenharbor.ai/v1`; only explicit `:free` routes with zero catalog prices can pass discovery.

The default loopback ports are `20129` for the router and `20131` for the Console. If either port is occupied, choose explicit alternatives and use the same values for installation, service startup, diagnostics, and clients:

```bash
ZEROSPEND_ROUTER_PORT=20229 ZEROSPEND_CONSOLE_PORT=20231 ./install.sh
ZEROSPEND_ROUTER_PORT=20229 ZEROSPEND_CONSOLE_PORT=20231 zerospend doctor
```

Hermes and other OpenAI-compatible clients must then use `http://127.0.0.1:20229/v1`. ZeroSpend never terminates an existing listener automatically.
