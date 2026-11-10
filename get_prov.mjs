import fs from 'fs';
const appJs = fs.readFileSync('apps/console/public/app.js', 'utf8');

const m = appJs.match(/async function providerAction\(provider,action\)\{.*?\}/s);
console.log(m ? m[0] : "Not found");
