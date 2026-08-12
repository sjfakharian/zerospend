# Troubleshooting

- **npm EACCES:** do not use `sudo npm`. When a global install is truly required, use a user-owned prefix: `mkdir -p "$HOME/.local" && npm config set prefix "$HOME/.local"`, and add `$HOME/.local/bin` to `PATH`. ZeroSpend itself creates its launcher there and does not require global npm installation.
- **Homebrew permissions:** inspect the exact directory Homebrew names (for example `/usr/local/lib/pkgconfig`) and its owner. If ownership is genuinely stale, repair only that path; never recursively change all of `/usr/local`. Hermes may work without optional `ripgrep`/`ffmpeg` features until those dependencies are repaired.
- **Node/OpenSSL errors:** reinstall or relink the affected formula, then verify `node --version`.
- **uv/PyPI timeout:** retry on a stable connection or increase the package-manager timeout; avoid disabling TLS.
- **Playwright:** install the required browser with the official Playwright command.
- **ffmpeg/ripgrep missing:** install the named packages with the platform package manager.
- **macOS permissions:** grant Accessibility or Screen Recording only to the application that needs it.
- **CORS/token mismatch:** verify the configured origin and local bearer token without printing it.
- **Port collision:** identify the listener and change ZeroSpend’s configured port; never kill an unrelated process automatically.
- **429/free quota exhausted:** wait for provider reset or use another independently verified-free fallback.
- **`~/.local/bin` missing from PATH:** add `export PATH="$HOME/.local/bin:$PATH"` to your shell profile, then open a new terminal.
- **9Router installed but offline:** run `9router --no-browser`, verify `http://127.0.0.1:20128`, then use a reviewed user LaunchAgent if persistence is needed. Direct OpenRouter/NVIDIA routes remain available without it.
- **OpenCode Free unavailable:** it is a no-auth 9Router backend, not OpenCode Zen. Start/configure 9Router; never create `opencode.token` for this route.
