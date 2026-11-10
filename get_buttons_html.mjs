import fs from 'fs';
const html = fs.readFileSync('apps/console/public/index.html', 'utf8');

const btnMatches = html.match(/<button[^>]*>.*?<\/button>/g);
if (btnMatches) {
  for (const b of btnMatches) {
    if (!b.match(/aria-label/)) {
        console.log("No aria-label:", b);
    }
  }
}
