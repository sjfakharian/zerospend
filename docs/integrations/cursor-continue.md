# Cursor & Continue (VS Code)

Use ZeroSpend as your local OpenAI-compatible provider for IDE code completion, inline generation, and chat without paying for API keys.

## Endpoint & Authentication

- **Base URL:** `http://127.0.0.1:20129/v1`
- **Model:** `smart-free` (or task alias `free-code` / `free-fast`)
- **API Key:** Any non-empty string or your local bearer token from `~/.zerospend/secrets/local.token`

---

## Continue (VS Code / JetBrains)

Add ZeroSpend to your `~/.continue/config.json` inside the `models` array:

```json
{
  "models": [
    {
      "title": "ZeroSpend (Free)",
      "provider": "openai",
      "model": "smart-free",
      "apiBase": "http://127.0.0.1:20129/v1",
      "apiKey": "local-token"
    }
  ],
  "tabAutocompleteModel": {
    "title": "ZeroSpend Autocomplete",
    "provider": "openai",
    "model": "free-fast",
    "apiBase": "http://127.0.0.1:20129/v1",
    "apiKey": "local-token"
  }
}
```

---

## Cursor

1. Open **Cursor Settings** (`Cmd+,` or `Ctrl+,`) → **Models**.
2. Under **OpenAI API Key**, enter your local ZeroSpend token (found in `~/.zerospend/secrets/local.token`).
3. Turn on **Override OpenAI Base URL** and enter:
   ```
   http://127.0.0.1:20129/v1
   ```
4. In the model selector, add `smart-free` or `free-code`.
