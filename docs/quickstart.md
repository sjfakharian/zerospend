# Quickstart

Requirements: macOS, Node.js 22+, npm, and at least one supported provider account.

```bash
git clone https://github.com/sjfakharian/zerospend.git
cd zerospend
./install.sh
zerospend setup
zerospend doctor
```

Configure one provider from the terminal or the local Console:

```bash
zerospend provider add
zerospend provider test openrouter
zerospend providers
zerospend discover
zerospend benchmark --dry-run
zerospend benchmark
zerospend automation install
```

`--dry-run` writes recommendations but never changes production routing. Review generated LaunchAgents before loading them. The credential-free synthetic console is available with `npm run demo` at `http://127.0.0.1:20131` and contacts no provider.

Bearer credentials are entered with terminal echo disabled and stored by the same provider manager used by the Console. Manual `.token` file creation is an advanced recovery/configuration option only.
