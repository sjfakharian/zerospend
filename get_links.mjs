import fs from 'fs';
const appJs = fs.readFileSync('apps/console/public/app.js', 'utf8');

// I am looking for empty state, disabled states, confirmation dialogs for destructive actions.
const m = appJs.match(/<button class="danger".*?<\/button>/g);
console.log(m ? m[0] : "Not found");
