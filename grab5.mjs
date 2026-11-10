import fs from 'fs';
const appJs = fs.readFileSync('apps/console/public/app.js', 'utf8');
const lines = appJs.split('\n');

const res = lines.map((l, i) => [i + 1, l]).filter(([i, l]) => l.includes("onclick=\"providerAction('"));
for (const r of res) {
  console.log(`Line ${r[0]}: ${r[1].slice(0, 100)}...`);
}
