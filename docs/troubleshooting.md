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
