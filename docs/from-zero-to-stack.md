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
```

This creates `~/.zerospend/{config,secrets,data,logs,state,backups,runtime}` and a local client token without printing it.

## Enter credentials safely

```bash
read -s "provider_key?Provider key: "
printf '\n'
umask 077
printf '%s' "$provider_key" > "$HOME/.zerospend/secrets/openrouter.token"
unset provider_key
chmod 600 "$HOME/.zerospend/secrets/openrouter.token"
```

Never paste keys into issues. Repeat with the documented filename for each enabled provider.

## External components

Install Hermes Agent, 9Router, and optional OmniRoute from their official distributions. ZeroSpend does not vendor them. Keep 9Router on loopback port `20128` and OmniRoute on `20130`; review current upstream licenses and instructions.

OpenRouter routes require explicit `:free` IDs and zero input/output prices. OpenCode needs current advertised-free evidence plus availability. NVIDIA needs the current `Free Endpoint` label, authenticated catalog membership, and a bounded chat probe.

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
