#!/bin/sh
set -eu
system=$(uname -s)
[ "$system" = Darwin ] || { echo 'Linux support is experimental; run npm install and zerospend setup manually.'; exit 1; }
architecture=$(uname -m)
echo "Detected macOS"
echo "Detected architecture: darwin-$architecture"
command -v node >/dev/null || { echo 'Node.js 22 or newer is required.'; exit 1; }
command -v npm >/dev/null || { echo 'npm is required.'; exit 1; }
major=$(node -p 'process.versions.node.split(".")[0]')
[ "$major" -ge 22 ] || { echo 'Node.js 22 or newer is required.'; exit 1; }
echo "Node version: $(node --version)"
echo "npm availability: $(command -v npm)"
npm_prefix=$(npm config get prefix 2>/dev/null || true)
if [ -n "$npm_prefix" ] && [ ! -w "$npm_prefix" ]; then echo "Note: npm global prefix $npm_prefix is not user-writable. ZeroSpend does not use sudo npm; use a user-owned prefix only if you later need global packages."; fi
router_port=${ZEROSPEND_ROUTER_PORT:-20129}
console_port=${ZEROSPEND_CONSOLE_PORT:-20131}
for port in "$router_port" "$console_port"; do if lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then echo "Port $port is occupied. ZeroSpend will not terminate that process. Set the matching ZEROSPEND_*_PORT variable to choose another port."; exit 1; fi; done
npm install --ignore-scripts
node cli/zerospend.mjs setup
mkdir -p "$HOME/.local/bin"
launcher="$HOME/.local/bin/zerospend"
if [ -e "$launcher" ] && [ ! -L "$launcher" ]; then echo "$launcher already exists and was not overwritten."; else ln -sfn "$PWD/cli/zerospend.mjs" "$launcher"; fi
case ":$PATH:" in *":$HOME/.local/bin:"*) ;; *) echo 'Add $HOME/.local/bin to PATH before using the zerospend command.';; esac
echo 'Install complete. Run: zerospend doctor, then npm run console.'
