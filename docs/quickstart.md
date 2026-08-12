# Quickstart

Requirements: macOS, Node.js 22+, npm, and at least one supported provider account.

```bash
git clone https://github.com/sjfakharian/zerospend.git
cd zerospend
./install.sh
zerospend setup
zerospend doctor
```

Enable at least one provider in `~/.config/zerospend/providers.json`, store its named secret file under `~/.config/zerospend/secrets/` with mode `600`, then run:

```bash
zerospend discover
zerospend benchmark --dry-run
zerospend benchmark
zerospend automation install
```

`--dry-run` writes recommendations but never changes production routing. Review generated LaunchAgents before loading them. The credential-free synthetic console is available with `npm run demo` at `http://127.0.0.1:20131` and contacts no provider.
