import fs from 'fs';
let appJs = fs.readFileSync('apps/console/public/app.js', 'utf8');
const search = `async function providerAction(provider,action){if((action==='delete'||action==='disconnect')&&!confirm(\`Are you sure you want to \${action} \${provider}?\`))return;const input=document.querySelector(\`#key-\${provider}\`)`;
console.log(appJs.includes(search));
