import fs from 'fs';
const appJs = fs.readFileSync('apps/console/public/app.js', 'utf8');

// Are there missing ARIA labels? Let's check some non-text buttons like "icon"
const btnMatches = appJs.match(/<button class="icon"[^>]*>.*?<\/button>/g);
if (btnMatches) {
  for (const b of btnMatches) {
    console.log(b);
  }
}
