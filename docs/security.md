# Security

Services bind to `127.0.0.1`. Secrets live in `~/.zerospend/secrets` with `0600` files. The installer never uses `sudo npm`, changes Homebrew ownership recursively, kills arbitrary processes, or overwrites occupied ports. There is no cloud telemetry.
