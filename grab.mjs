import fs from 'fs';
const appJs = fs.readFileSync('apps/console/public/app.js', 'utf8');

const m1 = appJs.match(/function toggleCustomProviderForm\(\)\{.*?\}/);
console.log("MATCH 1:", m1 ? m1[0] : "Not found");

const m2 = appJs.match(/<div id="custom-provider-form".*?<\/div><div style="display:flex;justify-content:space-between/s);
console.log("MATCH 2:", m2 ? "Found" : "Not found");
if(m2) console.log(m2[0].slice(0, 100));

const m3 = appJs.match(/\$\{name==='copilot'\?'':`<button class="danger".*?<\/button>`\}/);
console.log("MATCH 3:", m3 ? m3[0] : "Not found");
