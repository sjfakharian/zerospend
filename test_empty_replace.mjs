import fs from 'fs';
let appJs = fs.readFileSync('apps/console/public/app.js', 'utf8');

const search = `empty=(t,d)=>\`<div class="empty"><span>◇</span><h3>\${t}</h3><p>\${d}</p></div>\`;`;
// Not going to modify this since I don't see a clear UX win right now.

// Wait, looking at the button aria-labels:
const btnMatches = appJs.match(/<button[^>]*>.*?<\/button>/g);
if (btnMatches) {
  for (const b of btnMatches) {
    if (!b.match(/aria-label/)) {
        console.log("No aria-label:", b.slice(0, 100));
    }
  }
}
