#!/bin/sh
set -eu
[ "$(uname -s)" = Darwin ] || { echo 'Linux support is experimental; run npm install and zerospend setup manually.'; exit 1; }
command -v node >/dev/null || { echo 'Node.js 22 or newer is required.'; exit 1; }
command -v npm >/dev/null || { echo 'npm is required.'; exit 1; }
major=$(node -p 'process.versions.node.split(".")[0]')
[ "$major" -ge 22 ] || { echo 'Node.js 22 or newer is required.'; exit 1; }
for port in 20129 20131; do if lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then echo "Port $port is occupied. ZeroSpend will not terminate that process."; exit 1; fi; done
npm install --ignore-scripts
node cli/zerospend.mjs setup
echo 'Install complete. Run: npm run demo, or configure a provider and run npm start.'
