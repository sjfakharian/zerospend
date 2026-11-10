import fs from 'fs';
const appJs = fs.readFileSync('apps/console/public/app.js', 'utf8');
const search = `async function providerAction(provider,action){const input=document.querySelector(\`#key-\${provider}\`),body=action==='credential'?JSON.stringify({api_key:input?.value||''}):'{}';if(input)input.value='';const token=await ensureCsrf();const response=await fetch(\`/api/manage/providers/\${provider}/\${action}\`,{method:'POST',headers:{'content-type':'application/json','x-zerospend-csrf':token},body}),result=await response.json();await load(false);announce(response.ok?\`\${provider}: \${result.status||'operation completed safely'}\`:\`\${provider}: \${result.error||'operation failed'}\`,response.ok)}`;

const html = fs.readFileSync('apps/console/public/index.html', 'utf8');

console.log(html.includes("aria-live"));
console.log(appJs.includes("tabindex="));
