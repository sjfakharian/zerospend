import fs from 'fs';
const appJs = fs.readFileSync('apps/console/public/app.js', 'utf8');

// Are there any missing disabled states with explanations?
const m1 = appJs.match(/<button class="run-job-btn".*?onclick="submitCustomProvider\(\)".*?<\/button>/);
console.log(m1 ? m1[0] : "Not found");
