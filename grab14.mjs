import fs from 'fs';
const appJs = fs.readFileSync('apps/console/public/app.js', 'utf8');

// I am looking for empty state that might have missing call-to-actions, or inline validation
// Let's check how many occurrences of danger button there are
const m = appJs.match(/class="danger"/g);
console.log(m ? m.length : 0);
