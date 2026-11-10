import fs from 'fs';
const appJs = fs.readFileSync('apps/console/public/app.js', 'utf8');

// I am looking for button elements in JS template literals
const btnMatches = appJs.match(/<button[^>]*>.*?<\/button>/g);
if (btnMatches) {
  for (const b of btnMatches) {
    // If it's just an icon without text, it needs aria-label
    // Or if it's missing hover states, we could add them, but that's CSS.
    // Let's check for "danger" or other icon-only buttons
    if (!b.match(/aria-label/)) {
        console.log("No aria-label:", b.slice(0, 100));
    }
  }
}
