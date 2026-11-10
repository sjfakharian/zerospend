import fs from 'fs';
let appJs = fs.readFileSync('apps/console/public/app.js', 'utf8');

const search = `async function providerAction(provider,action){const input=document.querySelector(\`#key-\${provider}\`)`;
const replace = `async function providerAction(provider,action){if((action==='delete'||action==='disconnect')&&!confirm(\`Are you sure you want to \${action} \${provider}?\`))return;const input=document.querySelector(\`#key-\${provider}\`)`;

if (appJs.includes(search)) {
    console.log("Search string found. Replacing...");
    appJs = appJs.replace(search, replace);
    fs.writeFileSync('apps/console/public/app.js', appJs);
} else {
    console.log("Search string not found!");
}
