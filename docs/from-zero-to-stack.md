# From zero to stack

This guide builds a local verified-free routing stack on a clean laptop. It uses synthetic checks and never requires a real database.

## Prerequisites and safe tooling

Use macOS with Git, Node.js 22+, npm, Python 3, and optionally `uv`. Install `ripgrep` and `ffmpeg` when agent workflows need them. Avoid `sudo npm`; use a user-owned prefix such as `$HOME/.local`. If Homebrew reports permissions, repair only the named path—never recursively change all of `/usr/local`.

## Install ZeroSpend

```bash
git clone https://github.com/sjfakharian/zerospend.git
cd zerospend
./install.sh
zerospend setup
npm run console
```

This creates `~/.zerospend/{config,secrets,data,logs,state,backups,runtime}` and a local client token without printing it.

Open `http://127.0.0.1:20131`, choose Providers, and add one OpenRouter or NVIDIA credential. Test the connection, run discovery, then run `zerospend doctor` and start the router. Keys are write-only and never returned to the browser after saving.

The terminal provides the same shared provider manager:

```bash
zerospend provider add
zerospend provider test openrouter
zerospend provider status
zerospend provider remove openrouter
```

Bearer credentials use hidden input and are never accepted as command arguments. `opencode-free` is a separate no-auth provider exposed through optional 9Router; it never creates `opencode.token` and does not substitute OpenCode Zen.

`zerospend setup` detects macOS architecture, Node/npm, the user npm prefix, Hermes, 9Router, Router, Console, and optional OmniRoute. `zerospend components` repeats the component inventory without exposing configuration or credentials.

Hermes is the recommended client, while any OpenAI-compatible client remains supported. The current official Hermes installer is shown for confirmation but is never executed silently. Prefer the official packaged macOS Desktop installer; source compilation is advanced.

9Router is recommended only for OpenCode Free no-auth. Direct OpenRouter and NVIDIA do not depend on it. Current official 9Router documentation uses `npm install -g 9router` and `9router --no-browser`; ZeroSpend first checks whether the active npm prefix is user-writable and never recommends `sudo npm`. For persistence, use the reviewed user LaunchAgent approach only after confirming the installed command; no secrets belong in its plist.

OpenRouter documents API-key creation at [OpenRouter API authentication](https://openrouter.ai/docs/api/reference/authentication). You need only one working provider for first success.

## Advanced manual credential entry

```bash
read -s "provider_key?Provider key: "
printf '\n'
umask 077
printf '%s' "$provider_key" > "$HOME/.zerospend/secrets/openrouter.token"
unset provider_key
chmod 600 "$HOME/.zerospend/secrets/openrouter.token"
```

Never paste keys into issues. Repeat with the documented filename for each enabled provider.

## Optional external components

ZeroSpend routes directly to providers by default. 9Router is an optional advanced gateway and OmniRoute is optional discovery/capacity infrastructure; neither is required. ZeroSpend does not vendor them.

OpenRouter routes require explicit `:free` IDs and zero input/output prices. OpenCode is experimental/advanced: its official flow uses `/connect` with integration-specific API key, OAuth, or environment methods, so ZeroSpend does not invent a generic credential source. NVIDIA needs the current `Free Endpoint` label, authenticated catalog membership, and a bounded chat probe.

## Routing, discovery, and benchmarking

Classification is deterministic: tools, structured output, long context, SQL, code, reasoning, fast, then general. Unknown cost is rejected. Exhausted capacity returns `FREE_CAPACITY_UNAVAILABLE`.

Daily discovery defaults to `04:10`. Weekly synthetic benchmarking defaults to Sunday `04:40`, consumes free quota, and uses an anti-churn promotion margin. Install schedules only after reviewing service templates.

## Hermes and TypingMind

Configure Hermes through its current official custom-provider syntax:

```text
API base: http://127.0.0.1:20129/v1
Model: smart-free
```

For TypingMind use model `smart-free`, endpoint `http://127.0.0.1:20129/v1/chat/completions`, a dedicated local token, streaming, and tools when supported. Restrict CORS to the required origin.

## Tools, MCP, and observability

Tool definitions receive routing priority. ZeroSpend records tool-call outcomes but never arguments, results, prompts, SQL, files, or MCP payloads. The console runs at `http://127.0.0.1:20131`; `npm run demo` requires no credentials.

## Troubleshooting

- Retry `uv`/PyPI timeouts conservatively; never disable TLS.
- Reinstall or relink only the affected Node/OpenSSL formula.
- Install Playwright browsers using its official command.
- Grant macOS Accessibility or Screen Recording only to the app that needs it.
- Diagnose CORS and local-token mismatches without printing tokens.
- Identify port collisions with `lsof`; never kill unrelated processes automatically.
- On 429 or exhausted quota, wait for reset or use another verified-free route.

## Final health check

```bash
zerospend doctor
zerospend status
curl -fsS http://127.0.0.1:20129/health
curl -fsS http://127.0.0.1:20131/health
```

Issue synthetic chat, streaming, and tool requests. Confirm metadata appears, content does not, and paid/unverified production routes remain zero.
