import fs from 'fs';
const content = fs.readFileSync('apps/console/public/app.js', 'utf8');

// I am looking for buttons missing aria-labels where we might want to add them
const m1 = content.match(/<button class="model-name"/);
console.log(m1 ? m1[0] : "Not found 1");

const m2 = content.match(/<button class="icon"/);
console.log(m2 ? m2[0] : "Not found 2");

const m3 = content.match(/<button class="dialog-close"/);
console.log(m3 ? m3[0] : "Not found 3");

const m4 = content.match(/<button onclick="providerAction/);
console.log(m4 ? m4[0] : "Not found 4");
