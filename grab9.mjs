import fs from 'fs';
const appJs = fs.readFileSync('apps/console/public/app.js', 'utf8');

// I am looking for empty state that might have missing call-to-actions, or inline validation
const m = appJs.match(/function empty\(t,d\)\{.*?\}/s);
console.log(m ? m[0] : "Not found");
