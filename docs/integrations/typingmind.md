# TypingMind

Create a custom model:

- Name: `ZeroSpend`
- Model ID: `smart-free`
- Endpoint: `http://127.0.0.1:20129/v1/chat/completions`
- API key: a dedicated local bearer token
- Streaming: enabled
- Tools/plugins: enabled when the selected verified-free model supports them

Allow only the required TypingMind origin in CORS. Never reuse a provider API key as the browser-facing token.
