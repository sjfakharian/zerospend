import fs from 'fs';
const appJs = fs.readFileSync('apps/console/public/app.js', 'utf8');

const m1 = appJs.match(/const modeBtn.*?modeBtn\.click\(\);\}\}\}/);
console.log(m1 ? m1[0] : "Not found");
