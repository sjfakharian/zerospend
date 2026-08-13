#!/bin/sh
set -eu
system=$(uname -s)
[ "$system" = Darwin ] || { echo 'Linux support is experimental; run npm install and zerospend setup manually.'; exit 1; }
echo "Detected macOS"
shell_arch=$(uname -m)
hardware_arch=$(sysctl -n hw.optional.arm64 2>/dev/null || echo 0)
translated=$(sysctl -in sysctl.proc_translated 2>/dev/null || echo 0)
if [ "$hardware_arch" = 1 ]; then echo 'Hardware: Apple Silicon (arm64)'; else echo "Hardware: Intel ($shell_arch)"; fi
if [ "$translated" = 1 ]; then echo "Shell: $shell_arch (Rosetta translated)"; else echo "Shell: $shell_arch"; fi
command -v node >/dev/null || { echo 'Node.js 22 or newer is required.'; exit 1; }
command -v npm >/dev/null || { echo 'npm is required.'; exit 1; }
major=$(node -p 'process.versions.node.split(".")[0]')
[ "$major" -ge 22 ] || { echo 'Node.js 22 or newer is required.'; exit 1; }
echo "Node version: $(node --version)"
echo "Node architecture: $(node -p 'process.arch')"
echo "npm availability: $(command -v npm)"
npm_prefix=$(npm config get prefix 2>/dev/null || true)
if [ -n "$npm_prefix" ] && [ ! -w "$npm_prefix" ]; then echo "Note: npm global prefix $npm_prefix is not user-writable. ZeroSpend does not use sudo npm; use a user-owned prefix only if you later need global packages."; fi
router_port=${ZEROSPEND_ROUTER_PORT:-20129}
console_port=${ZEROSPEND_CONSOLE_PORT:-20131}
for port in "$router_port" "$console_port"; do if lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then echo "Port $port is occupied. ZeroSpend will not terminate that process. Set the matching ZEROSPEND_*_PORT variable to choose another port."; exit 1; fi; done
npm install --ignore-scripts
mkdir -p "$HOME/.local/bin"
launcher="$HOME/.local/bin/zerospend"
if [ -e "$launcher" ] && [ ! -L "$launcher" ]; then echo "$launcher already exists and was not overwritten."; else ln -sfn "$PWD/cli/zerospend.mjs" "$launcher"; fi
test -x "$launcher" || { echo "Launcher verification failed: $launcher"; exit 1; }
case ":$PATH:" in *":$HOME/.local/bin:"*) command -v zerospend >/dev/null || { echo 'Launcher exists but is not resolvable. Run: hash -r'; exit 1; };; *) echo 'To use ZeroSpend now, run:'; echo 'export PATH="$HOME/.local/bin:$PATH"'; echo 'To persist it for zsh, add that exact line to ~/.zshrc. ZeroSpend will not edit shell files without confirmation.';; esac
if ! node cli/zerospend.mjs setup; then echo 'Setup failed, but the CLI launcher remains installed. Fix the reported issue and recover with:'; echo 'zerospend setup'; exit 1; fi
echo 'Install complete. Run: zerospend doctor, then npm run console.'
