# Troubleshooting

- **npm EACCES:** configure a user-level npm prefix; do not use `sudo npm`.
- **Homebrew permissions:** repair only the specific path Homebrew identifies; never recursively change all of `/usr/local`.
- **Node/OpenSSL errors:** reinstall or relink the affected formula, then verify `node --version`.
- **uv/PyPI timeout:** retry on a stable connection or increase the package-manager timeout; avoid disabling TLS.
- **Playwright:** install the required browser with the official Playwright command.
- **ffmpeg/ripgrep missing:** install the named packages with the platform package manager.
- **macOS permissions:** grant Accessibility or Screen Recording only to the application that needs it.
- **CORS/token mismatch:** verify the configured origin and local bearer token without printing it.
- **Port collision:** identify the listener and change ZeroSpend’s configured port; never kill an unrelated process automatically.
- **429/free quota exhausted:** wait for provider reset or use another independently verified-free fallback.
