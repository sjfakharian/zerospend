# Claude Desktop (Custom Inference Gateway)

Connect **Claude Desktop** directly to ZeroSpend so you can use verified-free LLM models right inside Claude's desktop interface.

---

## Overview

Claude Desktop includes support for third-party custom inference gateways using the native Anthropic Messages API. ZeroSpend provides built-in compatibility with:
- **Anthropic Messages protocol** (`/v1/messages` and `/v1/messages/count_tokens`)
- **Automated model discovery** (`/v1/models` formatted with Anthropic family tiers: `sonnet`, `opus`, `haiku`)
- **Real-time SSE token streaming** (`content_block_delta`, `message_delta`, etc.)
- **Strict zero-cost routing** across your configured free providers (OpenRouter, NVIDIA NIM, TokenHarbor, APINex, OpenCode)

---

## Configuration & Credentials

1. Retrieve your ZeroSpend local authorization token:
   ```bash
   cat ~/.zerospend/secrets/local.token
   ```

2. Confirm your router port (default is `20129` or custom `20229` if specified via `ZEROSPEND_ROUTER_PORT`):
   ```bash
   zerospend doctor
   ```

---

## Step-by-Step Setup in Claude Desktop

1. Open **Claude Desktop**.
2. Go to **Settings** (`Cmd+,` on macOS or via the app menu) → navigate to **Developer** (or **Inference / Custom Gateway**).
3. Fill in the connection settings:
   - **Base URL:**
     ```
     http://127.0.0.1:20129/v1
     ```
     *(Use `http://127.0.0.1:20229/v1` if using port 20229)*
   - **Authentication:** `x-api-key` (or `Bearer Token`)
   - **API Key:** Paste your token from `~/.zerospend/secrets/local.token`
4. Click **Test Connection** / **Apply Changes**.
5. Claude Desktop will discover available models and verify end-to-end inference.

---

## Available Models & Smart Routing

ZeroSpend exposes Claude-compatible family tiers that route dynamically to your verified-free backends:

| Model ID | Family Tier | ZeroSpend Routing Behavior |
|---|---|---|
| `claude-3-5-sonnet` *(Default)* | `sonnet` | **Smart Free**: Deterministically classifies prompt into code, reasoning, SQL, or general free models. |
| `claude-3-7-sonnet` | `sonnet` | **Smart Free**: Routes to top-ranked verified-free capacity. |
| `claude-3-opus` | `opus` | **Reasoning**: Routes to heavy reasoning models (`free-reasoning`). |
| `claude-3-5-haiku` | `haiku` | **Fast**: Routes to high-throughput, low-latency models (`free-fast`). |
| `claude-free-code` | `sonnet` | **Code**: Optimizes for programming and debugging tasks. |
| `claude-free-tools` | `sonnet` | **Tools**: Prioritizes models with verified function/tool calling reliability. |

---

## Verification via CLI

You can also test the Anthropic endpoint directly using `curl`:

```bash
TOKEN=$(cat ~/.zerospend/secrets/local.token)

# Model discovery test
curl -s -H "x-api-key: $TOKEN" http://127.0.0.1:20129/v1/models

# Non-streaming message test
curl -s -X POST http://127.0.0.1:20129/v1/messages \
  -H "x-api-key: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet",
    "max_tokens": 50,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'

# Streaming message test
curl -s -N -X POST http://127.0.0.1:20129/v1/messages \
  -H "x-api-key: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet",
    "stream": true,
    "max_tokens": 50,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```
