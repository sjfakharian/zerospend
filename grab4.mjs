import fs from 'fs';
const appJs = fs.readFileSync('apps/console/public/app.js', 'utf8');

// Looking for ARIA labels on buttons without text
// Also looking for missing aria attributes on things that act as buttons

const btnMatches = appJs.match(/<button.*?<\/button>/g);
if (btnMatches) {
  for (const b of btnMatches) {
    if (b.includes('icon') || !b.includes('aria-label')) {
      // console.log(b);
    }
  }
}

// look for custom UI elements that lack keyboard support (tabindex/keydown)
const spanMatches = appJs.match(/<span.*?>.*?<\/span>/g);
if (spanMatches) {
  for (const s of spanMatches) {
    if (s.includes('onclick')) {
      console.log(s);
    }
  }
}
