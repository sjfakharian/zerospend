# Hermes Agent

Install Hermes from its official distribution. On Apple Silicon, prefer the official packaged Desktop release/DMG described in the [Hermes Desktop guide](https://hermes-agent.nousresearch.com/docs/user-guide/desktop) instead of building native `node-pty` dependencies locally. Source builds are an advanced/developer path.

The current official CLI-only installer is documented at [Hermes installation](https://hermes-agent.nousresearch.com/docs/getting-started/installation). ZeroSpend displays the command and requires explicit confirmation before running any remote installer. Missing optional ripgrep, ffmpeg, Playwright, or Desktop functionality is reported separately from ZeroSpend core health.

Configure a custom OpenAI-compatible provider with base URL `http://127.0.0.1:20129/v1`, model `smart-free`, and the local ZeroSpend bearer token. Verify current Hermes configuration keys against its official documentation because its config format can change.
