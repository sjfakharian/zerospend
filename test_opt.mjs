import fs from 'fs';
let content = fs.readFileSync('apps/console/server.mjs', 'utf8');

const original = `events=store?.recent(5000)||[],summary=aggregate(events),routes=Object.values(inventory.routes||{}).map(r=>({...r,aliases:Object.entries(config.aliases||{}).filter(([,v])=>v.includes(r.route)).map(([a,v])=>({alias:a,rank:v.indexOf(r.route)+1})),runtime:aggregate(events.filter(e=>e.model===r.route)),benchmark:benchmark.records?.filter(x=>x.route===r.route)||[]})),providers=await providerMetadata(p);`;

const optimized = `events=store?.recent(5000)||[],summary=aggregate(events);/* ⚡ Bolt: Replace O(N*M) array filtering with single-pass hash map building for O(N) performance */const eventsByModel={};for(const e of events){if(e.model){eventsByModel[e.model]||=[];eventsByModel[e.model].push(e)}}const benchByRoute={};for(const b of benchmark.records||[]){benchByRoute[b.route]||=[];benchByRoute[b.route].push(b)}const aliasesByRoute={};for(const[a,v]of Object.entries(config.aliases||{})){for(let i=0;i<v.length;i++){aliasesByRoute[v[i]]||=[];aliasesByRoute[v[i]].push({alias:a,rank:i+1})}}const routes=Object.values(inventory.routes||{}).map(r=>({...r,aliases:aliasesByRoute[r.route]||[],runtime:aggregate(eventsByModel[r.route]||[]),benchmark:benchByRoute[r.route]||[]}));const providers=await providerMetadata(p);`;

fs.writeFileSync('apps/console/server.mjs', content.replace(original, optimized));
console.log("Done")
