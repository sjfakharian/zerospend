import fs from 'fs';
let appJs = fs.readFileSync('apps/console/public/app.js', 'utf8');
const search = `empty=(t,d)=>\`<div class="empty"><span>◇</span><h3>\${t}</h3><p>\${d}</p></div>\`;`;
console.log(appJs.includes(search));
