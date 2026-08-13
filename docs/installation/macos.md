# macOS installation

Install Node.js 22+ through an official package or Homebrew, clone the repository, then run `./install.sh`. The installer refuses occupied ports, never terminates an existing process, uses only user-owned runtime directories, and creates `~/.local/bin/zerospend` without overwriting a regular file. Set `ZEROSPEND_ROUTER_PORT` or `ZEROSPEND_CONSOLE_PORT` before installation to select unused ports.

Install the maintenance schedules with `zerospend automation install`, review the generated user LaunchAgents in `~/Library/LaunchAgents`, then load them with `launchctl`. Discovery runs daily at 04:10 and the benchmark runs Sunday at 04:40 local time. Both jobs use exclusive locks, so overlapping invocations exit safely. `zerospend automation status` prints the configured files and schedules.
