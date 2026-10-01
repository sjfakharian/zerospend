# LibreChat & Open-WebUI

Connect self-hosted web frontends to ZeroSpend for a zero-cost ChatGPT alternative with automatic free model routing.

## Endpoint & Authentication

- **Base URL:** `http://127.0.0.1:20129/v1`
- **Model:** `smart-free` (or aliases like `free-reasoning`, `free-general`)
- **API Key:** Local bearer token from `~/.zerospend/secrets/local.token`

---

## LibreChat

Add a custom endpoint to your `librechat.yaml`:

```yaml
endpoints:
  custom:
    - name: "ZeroSpend"
      apiKey: "${ZEROSPEND_TOKEN}"
      baseURL: "http://host.docker.internal:20129/v1"
      models:
        default: ["smart-free", "free-code", "free-reasoning", "free-general", "free-tools"]
        fetch: false
      titleConvo: true
      titleModel: "free-fast"
```

> If LibreChat is running natively outside Docker, use `http://127.0.0.1:20129/v1`.

---

## Open-WebUI

1. Go to **Admin Panel** → **Settings** → **Connections**.
2. Under **OpenAI API**, set:
   - **URL:** `http://host.docker.internal:20129/v1` (or `http://127.0.0.1:20129/v1` if running on host)
   - **Key:** Enter your local token from `~/.zerospend/secrets/local.token`
3. Click **Verify** to load models (`smart-free`, `free-code`, etc.).
