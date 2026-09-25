const pages=[['Overview','⌂','Verified-free routing health at a glance.'],['Live Routing','↝','Recent metadata-only routing decisions.'],['Models','◇','Every production-eligible verified-free route.'],['Routing','⇄','Task aliases and ordered fallback chains.'],['Benchmarks','△','Quota-efficient quality and reliability evidence.'],['Usage','▥','Operational counts without prompt content.'],['Performance','⌁','Latency, outcomes, fallbacks, and temporary capacity.'],['Providers','◎','Connection, evidence, and capacity status.'],['Safety','⬡','Strict-free policy evidence and exclusions.'],['Automation','◷','Bounded discovery and benchmark schedules.'],['Settings','⚙','Local endpoint and privacy posture.']];
const nav=document.querySelector('#nav'),app=document.querySelector('#app'),toast=document.querySelector('#toast');let page=location.hash.slice(1)||'Overview',data,csrfToken=null,modelQuery='',autoRefreshEnabled=true,refreshTimer=null,isFetching=false,requestedDemo=null;
for(const [name,icon] of pages){const b=document.createElement('button');b.dataset.page=name;b.innerHTML=`<i>${icon}</i><span>${name}</span>`;b.onclick=()=>{page=name;location.hash=name;render();load(true)};nav.append(b)}
const n=x=>Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1}).format(x||0),ms=x=>x>=1000?`${(x/1000).toFixed(2)}s`:`${x||0}ms`,pct=x=>`${((x||0)*100).toFixed(1)}%`,esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),date=x=>x?new Date(x).toLocaleString():'Never',badge=(v,tone='neutral')=>`<span class="badge ${tone}">${esc(v)}</span>`,card=(l,v,d='')=>`<article class="metric"><label>${l}</label><strong>${v}</strong>${d?`<small>${d}</small>`:''}</article>`,panel=(t,b,a='')=>`<article class="panel"><div class="panel-head"><h2>${t}</h2>${a}</div>${b}</article>`,empty=(t,d)=>`<div class="empty"><span>◇</span><h3>${t}</h3><p>${d}</p></div>`;
const table=(headers,rows)=>rows.length?`<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th>${h[0]}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${headers.map(h=>`<td>${typeof h[1]==='function'?h[1](r):esc(r[h[1]]??'—')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:empty('No records yet','Run discovery or send a request to populate this view.');
function announce(message,good=true){toast.textContent=message;toast.className=good?'show good':'show';setTimeout(()=>toast.className='',3500)}
async function load(silent=false){if(isFetching)return;isFetching=true;const refreshBtn=document.querySelector('#refresh-btn');if(!silent&&refreshBtn)refreshBtn.classList.add('spin');try{const q=requestedDemo!==null?`?demo=${requestedDemo?1:0}`:'';const r=await fetch(`/api/dashboard${q}`);if(!r.ok)throw Error(`HTTP ${r.status}`);data=await r.json();const modeEl=document.querySelector('#mode');if(modeEl){if(data.demo===false){modeEl.className='mode live';modeEl.innerHTML=`<span class="status-dot pulse"></span> LIVE METADATA${autoRefreshEnabled?' <small>· 3s</small>':''}`;modeEl.title='Connected to live local metadata. Click to view demo fixtures.'}else{modeEl.className='mode demo';modeEl.innerHTML='<span class="status-dot amber"></span> SYNTHETIC DEMO <small>(CLICK FOR LIVE)</small>';modeEl.title='Synthetic fixtures. Click to switch to live metadata.'}}if(data.demo===false&&!csrfToken)csrfToken=await fetch('/api/manage/session').then(r=>r.ok?r.json():null).then(x=>x?.csrf_token);render()}catch(error){if(!silent)app.innerHTML=empty('Console unavailable',`The local metadata endpoint returned ${esc(error.message)}.`)}finally{isFetching=false;if(!silent&&refreshBtn)setTimeout(()=>refreshBtn.classList.remove('spin'),300)}}
async function ensureCsrf(){if(!csrfToken)csrfToken=await fetch('/api/manage/session').then(r=>r.ok?r.json():null).then(x=>x?.csrf_token);return csrfToken}
async function providerAction(provider,action){const input=document.querySelector(`#key-${provider}`),body=action==='credential'?JSON.stringify({api_key:input?.value||''}):'{}';if(input)input.value='';const token=await ensureCsrf();const response=await fetch(`/api/manage/providers/${provider}/${action}`,{method:'POST',headers:{'content-type':'application/json','x-zerospend-csrf':token},body}),result=await response.json();await load(false);announce(response.ok?`${provider}: ${result.status||'operation completed safely'}`:`${provider}: ${result.error||'operation failed'}`,response.ok)}
async function runAutomationJob(job){announce(`Starting ${job}... Please wait.`,true);try{const token=await ensureCsrf();const response=await fetch(`/api/manage/automation/${job}`,{method:'POST',headers:{'content-type':'application/json','x-zerospend-csrf':token}});const result=await response.json();await load(false);announce(response.ok?`${job}: completed successfully!`:`${job}: ${result.error||'failed'}`,response.ok)}catch(err){announce(`${job}: ${err.message}`,false)}}
async function discoverAll(){announce('Running discovery for all enabled providers...',true);try{const token=await ensureCsrf();const response=await fetch('/api/manage/discover',{method:'POST',headers:{'content-type':'application/json','x-zerospend-csrf':token}});const result=await response.json();await load(false);announce(response.ok?`Discovery complete: ${result.verified_free_models} models verified, ${result.production_eligible_models} eligible.`:`Discovery failed: ${result.error||'failed'}`,response.ok)}catch(err){announce(`Discovery failed: ${err.message}`,false)}}
function overview(){const s=data.summary,paid=data.routes.filter(r=>!r.zero_cost).length,unverified=data.routes.filter(r=>r.production_eligible&&!r.zero_cost).length;return `<section class="policy ${paid||unverified?'warn':''}"><div><p>STRICT-FREE POLICY</p><h2>${paid||unverified?'ATTENTION':'HEALTHY'}</h2><span>${paid} paid routes · ${unverified} unverified production routes</span></div><code>UNKNOWN COST = NOT FREE</code></section><div class="metrics">${card('Eligible models',data.routes.length,'current inventory')}${card('Providers',data.providers.filter(p=>p.connection_status==='connected'||p.connection_status==='PASS'||p.eligible).length,'available or eligible')}${card('Requests',n(s.requests),'recent metadata')}${card('Total tokens',n(s.total_tokens),'counts only')}${card('Success',pct(s.success_rate),'request outcomes')}${card('p95 latency',ms(s.p95_latency_ms),'end to end')}${card('Tool success',pct(s.tool_success),'when requested')}${card('Fallback',pct(s.fallback_rate),'depth > 0')}${card('429 rate',pct(s.rate_limit_rate),'temporary capacity')}</div>${panel('Recent routing decisions',events(data.events.slice(0,6)),badge('PROMPTS NEVER STORED','green'))}`}
function events(rows){return rows.length?`<div class="event-list">${rows.map(e=>{const model=String(e.model||'').replace(`${e.provider}/`,''),route=e.provider||e.model?`${esc(e.provider||'unknown')}/${esc(model||'unknown')}`:'no route selected';return `<div class="event"><div class="event-route"><span>${esc(e.client)}</span><i>→</i><span>${esc(e.category)}</span><i>→</i><b>${esc(e.alias)}</b><i>→</i><span>${route}</span></div><div class="event-meta">${badge(e.status,e.status===200?'green':e.status===503?'red':'amber')}<span>${ms(e.latency_ms)}</span><span>${n(e.total_tokens)} tok</span>${e.rate_limited?badge('temporary 429','amber'):''}${e.fallback_depth?badge(`depth ${e.fallback_depth}`,'violet'):''}${e.error_class?badge(e.error_class,'red'):''}</div></div>`}).join('')}</div>`:empty('No routing decisions yet','Send a request through the local OpenAI-compatible endpoint.');}
function performance(){const s=data.summary,failures=data.events.filter(e=>!e.success);return `<div class="metrics usage">${card('Success',pct(s.success_rate),'includes recorded 503 outcomes')}${card('p50 latency',ms(s.p50_latency_ms),'end to end')}${card('p95 latency',ms(s.p95_latency_ms),'end to end')}${card('Temporary 429',pct(s.rate_limit_rate),'capacity, not invalidation')}</div>${panel('Failure and fallback outcomes',events(failures),badge('FAILED REQUESTS INCLUDED','violet'))}`}
function models(){const rows=data.routes.filter(r=>`${r.model_id} ${r.provider}`.toLowerCase().includes(modelQuery.toLowerCase()));return panel('Model explorer',table([['Model',r=>`<button class="model-name" data-model="${esc(r.route)}">${esc(r.model_id)}</button>`],['Provider',r=>badge(r.provider)],['Cost',r=>badge(r.zero_cost?'VERIFIED FREE':'EXCLUDED',r.zero_cost?'green':'red')],['Eligibility',r=>badge(r.production_eligible?'PRODUCTION':'NO','violet')],['Alias / rank',r=>(r.aliases||[]).map(a=>`${esc(a.alias)} #${a.rank}`).join('<br>')],['Context',r=>n(r.context_window)],['Tools',r=>r.capabilities?.tools?'Yes':'No'],['Reliability',r=>pct(r.runtime?.success_rate)],['p95',r=>ms(r.runtime?.p95_latency_ms)]],rows),`<label class="search"><span>⌕</span><input id="model-search" value="${esc(modelQuery)}" placeholder="Filter models" aria-label="Filter models"></label>`)+`<dialog id="model-dialog"><button class="dialog-close" aria-label="Close">×</button><div id="model-detail"></div></dialog>`}
function routing(){return `${panel('Task-aware aliases',Object.entries(data.aliases).map(([alias,routes])=>`<div class="chain"><div><b>${esc(alias)}</b><small>${routes.length} verified-free route${routes.length===1?'':'s'}</small></div><ol>${routes.map((r,i)=>`<li><span>${i+1}</span>${esc(r)}</li>`).join('')||'<li>No current free capacity</li>'}</ol></div>`).join(''))}${panel('Classification order','<div class="flow">Tools <i>→</i> Structured <i>→</i> Long context <i>→</i> SQL <i>→</i> Code <i>→</i> Reasoning <i>→</i> Fast <i>→</i> General</div><p class="muted">Deterministic heuristics classify requests without a second LLM call.</p>')}`}
function providers(){const firstRun=!data.providers.some(p=>p.configured||p.eligible);return `${firstRun?panel('Connect your first provider','<ol class="steps"><li>Add a credential where required</li><li>Test the connection</li><li>Run bounded discovery</li><li>Start routing through verified-free models</li></ol>'):''}<div class="action-bar"><p class="muted" style="margin:0;">Configured API providers and verified-free eligibility status.</p>${data.demo?'':`<button class="run-job-btn" onclick="discoverAll()" style="font-weight:700;">⚡ Discover All Providers</button>`}</div><div class="provider-grid">${data.providers.map(p=>{const name=p.name||'provider',experimental=p.experimental||name==='opencode-free'||name==='opencode',configured=p.configured??Boolean(p.eligible),status=p.capacity_status||p.last_error_class||p.connection_status||(p.eligible?'AVAILABLE':'NOT TESTED');return `<article class="provider-card"><div class="provider-title"><div><span class="provider-icon">${esc((p.label||name).slice(0,2).toUpperCase())}</span><h2>${esc(p.label||name)}</h2></div>${badge(experimental?'ADVANCED':'PROVIDER',experimental?'violet':'neutral')}</div><div class="provider-state"><span class="status-dot ${/limit|capacity/i.test(status)?'amber':''}"></span><b>${esc(status)}</b></div><dl><div><dt>Configured</dt><dd>${configured?'Yes':'No'}</dd></div><div><dt>Verified-free models</dt><dd>${p.verified_free_models??p.eligible??0}</dd></div><div><dt>Production eligible</dt><dd>${p.production_eligible_models??p.eligible??0}</dd></div><div><dt>Last discovery</dt><dd>${esc(p.last_discovery||'Never')}</dd></div><div><dt>Last error class</dt><dd>${esc(p.last_error_class||'None')}</dd></div></dl>${data.demo?'<p class="muted">Controls are disabled in synthetic demo mode.</p>':`<div class="provider-actions">${p.auth_mode==='bearer'?`<input id="key-${esc(name)}" type="password" autocomplete="off" placeholder="${configured?'Replace API key':'Add API key'}" aria-label="${esc(name)} API key"><button onclick="providerAction('${esc(name)}','credential')">Save key</button>`:'<small>No provider credential requested</small>'}<button onclick="providerAction('${esc(name)}','test')">Test</button><button onclick="providerAction('${esc(name)}','discover')">Discover</button><button class="danger" onclick="providerAction('${esc(name)}','disconnect')">Disconnect</button></div>`}<p class="fine">${name.includes('opencode')?'Optional local 9Router executes dynamically discovered OpenCode Free candidates. Zen is never a fallback.':name==='nvidia'?'Requires current Free Endpoint evidence, catalog presence, and a bounded successful probe.':'Only explicit current zero-price evidence can enter production.'}</p></article>`}).join('')}</div>`}
function safety(){return `<section class="policy"><div><p>SAFETY INVARIANT</p><h2>UNKNOWN COST = NOT FREE</h2><span>Ambiguous and paid routes cannot enter production fallback chains.</span></div>${badge(`${data.routes.filter(r=>r.zero_cost).length} VERIFIED ROUTES`,'green')}</section>${panel('Verification evidence',table([['Route','route'],['Evidence','evidence'],['Verified at',r=>date(r.evidence_at)],['Eligibility',r=>badge(r.production_eligible?'ELIGIBLE':'EXCLUDED',r.production_eligible?'green':'red')]],data.routes))}${panel('Excluded inventory',table([['Route',(_,k)=>k],['Reason','reason']],Object.entries(data.rejected||{}).map(([route,value])=>({route,...value}))))}`}
function settings(){const routerUrl=data.endpoints?.router||'http://127.0.0.1:20229/v1',consoleUrl=data.endpoints?.console||`http://127.0.0.1:${location.port||20231}`;return `${panel('Local endpoints',`<dl class="settings"><div><dt>OpenAI-compatible API</dt><dd><code>${esc(routerUrl)}</code></dd></div><div><dt>Console</dt><dd><code>${esc(consoleUrl)}</code></dd></div><div><dt>Auto-refresh</dt><dd>${autoRefreshEnabled?'Active (every 3s)':'Paused'}</dd></div><div><dt>Network exposure</dt><dd>Loopback only</dd></div></dl>`)}${panel('Privacy posture','<ul class="checklist"><li>Prompt and completion content is not stored</li><li>SQL and tool arguments/results are not stored</li><li>No cloud telemetry or analytics SDK</li><li>Provider keys are write-only in the console</li></ul>')}`}
function bind(){const q=document.querySelector('#model-search');if(q){q.oninput=e=>{modelQuery=e.target.value;app.innerHTML=models();bind();const input=document.querySelector('#model-search');if(input){input.focus();input.setSelectionRange(input.value.length,input.value.length)}}}document.querySelectorAll('[data-model]').forEach(b=>b.onclick=()=>{const r=data.routes.find(x=>x.route===b.dataset.model),d=document.querySelector('#model-dialog');document.querySelector('#model-detail').innerHTML=`<p class="eyebrow">MODEL EVIDENCE</p><h2>${esc(r.model_id)}</h2><dl class="settings"><div><dt>Route</dt><dd><code>${esc(r.route)}</code></dd></div><div><dt>Why eligible?</dt><dd>${esc(r.evidence)}</dd></div><div><dt>Current role</dt><dd>${r.aliases?.[0]?.rank===1?'Primary by current ranking':'Verified fallback'}</dd></div><div><dt>Evidence observed</dt><dd>${date(r.evidence_at)}</dd></div></dl>`;d.showModal()});const d=document.querySelector('#model-dialog');if(d)document.querySelector('.dialog-close').onclick=()=>d.close()}
const testMeta={code:{icon:'💻',label:'Code',desc:'sum([1,2,3]) == 6'},sql:{icon:'🗄️',label:'SQL',desc:'SELECT COUNT GROUP BY'},reasoning:{icon:'🧠',label:'Reasoning',desc:'17 * 6 == 102'},general:{icon:'🌐',label:'General',desc:'Capital France == Paris'},fast:{icon:'⚡',label:'Fast',desc:'Reply OK'},'long-context':{icon:'📄',label:'Long-Ctx',desc:'Marker retained'},structured:{icon:'📐',label:'Schema',desc:'Strict JSON ok=true'},tools:{icon:'🛠️',label:'Tools',desc:'calculator(7+5)'}};
let benchmarkCategoryFilter='all';
let liveBenchmarkState={active:false,stage:'idle',isDryRun:false,progressPct:0,completedCount:0,totalTests:0,candidateIndex:0,candidateCount:0,currentRoute:'',currentProvider:'',activeCategories:{},liveRecords:[],logs:[],startTime:null,timerInterval:null};

function updateLiveVisuals(){
  if(page!=='Automation')return;
  const pill=document.querySelector('#live-status-pill');
  if(pill){
    pill.className=`live-status-pill ${liveBenchmarkState.active?'active':''}`;
    pill.innerHTML=liveBenchmarkState.active?`<span class="status-dot pulse"></span> RUNNING (${liveBenchmarkState.isDryRun?'DRY-RUN':'LIVE'})`:liveBenchmarkState.stage==='completed'?`<span class="status-dot"></span> COMPLETED`:liveBenchmarkState.stage==='error'?`<span class="status-dot amber"></span> ERROR`:`<span class="status-dot"></span> IDLE / READY`;
  }
  const fill=document.querySelector('#live-progress-fill');if(fill)fill.style.width=`${liveBenchmarkState.progressPct}%`;
  const pctEl=document.querySelector('#live-progress-pct');if(pctEl)pctEl.textContent=`${liveBenchmarkState.progressPct}%`;
  const cntEl=document.querySelector('#live-progress-count');if(cntEl){cntEl.textContent=liveBenchmarkState.totalTests>0?`${liveBenchmarkState.completedCount} of ${liveBenchmarkState.totalTests} evaluations`:'Ready to start';}
  const candName=document.querySelector('#active-candidate-name');if(candName)candName.textContent=liveBenchmarkState.currentRoute||'Awaiting candidate...';
  const candMeta=document.querySelector('#active-candidate-meta');if(candMeta){candMeta.textContent=liveBenchmarkState.candidateCount>0?`Candidate ${liveBenchmarkState.candidateIndex} of ${liveBenchmarkState.candidateCount} · ${liveBenchmarkState.currentProvider||'Direct'}`:'Queue initialized';}
  for(const [cat,meta] of Object.entries(testMeta)){
    const cardEl=document.querySelector(`#cat-card-${cat}`);
    const resEl=document.querySelector(`#cat-res-${cat}`);
    if(!cardEl||!resEl)continue;
    const rec=liveBenchmarkState.activeCategories[cat];
    if(rec){
      const pass=rec.status===200&&rec.score>0;
      cardEl.className=`cat-item-card ${pass?'pass':'fail'}`;
      resEl.className=`cat-result ${pass?'green':'red'}`;
      resEl.textContent=`${pass?'✓ ':'✗ '}${rec.score} pts · ${ms(rec.latency_ms)}`;
    }else if(liveBenchmarkState.active){
      cardEl.className='cat-item-card running';
      resEl.className='cat-result';
      resEl.textContent='Testing...';
    }else{
      cardEl.className='cat-item-card';
      resEl.className='cat-result';
      resEl.textContent=meta.desc;
    }
  }
  const feed=document.querySelector('#live-stream-feed');
  if(feed&&liveBenchmarkState.logs.length){
    feed.innerHTML=liveBenchmarkState.logs.slice(0,30).map(l=>`<div class="feed-row"><span class="ts">[${esc(l.ts)}]</span> <span class="${l.type}">${esc(l.text)}</span></div>`).join('');
  }
  const runBtn=document.querySelector('#btn-run-benchmark');if(runBtn)runBtn.disabled=liveBenchmarkState.active;
  const dryBtn=document.querySelector('#btn-dry-benchmark');if(dryBtn)dryBtn.disabled=liveBenchmarkState.active;
}

function handleBenchmarkEvent(ev){
  const ts=new Date().toLocaleTimeString();
  if(ev.type==='init'){
    liveBenchmarkState.candidateCount=ev.candidate_count||ev.candidates?.length||0;
    liveBenchmarkState.totalTests=ev.total_tests||0;
    liveBenchmarkState.logs.unshift({ts,text:`Admitted ${liveBenchmarkState.candidateCount} candidates for evaluation (${liveBenchmarkState.totalTests} total evaluations across 8 dimensions)`,type:'info'});
    updateLiveVisuals();
  }else if(ev.type==='candidate_start'){
    liveBenchmarkState.candidateIndex=ev.candidate_index;
    liveBenchmarkState.currentRoute=ev.route;
    liveBenchmarkState.currentProvider=ev.provider;
    liveBenchmarkState.activeCategories={};
    liveBenchmarkState.logs.unshift({ts,text:`[${ev.candidate_index}/${ev.candidate_count}] Testing candidate: ${ev.route} (${ev.provider})`,type:'info'});
    updateLiveVisuals();
  }else if(ev.type==='test_done'){
    liveBenchmarkState.completedCount++;
    if(liveBenchmarkState.totalTests>0){
      liveBenchmarkState.progressPct=Math.min(100,Math.round((liveBenchmarkState.completedCount/liveBenchmarkState.totalTests)*100));
    }
    const rec=ev.record||{};
    liveBenchmarkState.activeCategories[ev.category]=rec;
    liveBenchmarkState.liveRecords.push(rec);
    const pass=rec.status===200&&rec.score>0;
    liveBenchmarkState.logs.unshift({ts,text:`[${pass?'PASS':'FAIL'}] ${ev.category.toUpperCase().padEnd(9)} · ${rec.score} pts (${ms(rec.latency_ms)}) · ${ev.route}`,type:pass?'pass':'fail'});
    updateLiveVisuals();
  }else if(ev.type==='candidate_done'){
    updateLiveVisuals();
  }else if(ev.type==='complete'){
    if(liveBenchmarkState.timerInterval)clearInterval(liveBenchmarkState.timerInterval);
    liveBenchmarkState.active=false;
    liveBenchmarkState.stage='completed';
    liveBenchmarkState.progressPct=100;
    liveBenchmarkState.logs.unshift({ts,text:`Benchmark complete! Evaluated ${ev.result?.records?.length||liveBenchmarkState.completedCount} tests. Ranking updated safely.`,type:'pass'});
    updateLiveVisuals();
    announce('Benchmark completed and evaluated successfully!',true);
    setTimeout(()=>load(false),400);
  }else if(ev.type==='error'){
    if(liveBenchmarkState.timerInterval)clearInterval(liveBenchmarkState.timerInterval);
    liveBenchmarkState.active=false;
    liveBenchmarkState.stage='error';
    liveBenchmarkState.logs.unshift({ts,text:`Benchmark error: ${ev.error}`,type:'fail'});
    updateLiveVisuals();
    announce(`Benchmark error: ${ev.error}`,false);
  }
}

async function startLiveBenchmark(dryRun=false){
  if(liveBenchmarkState.active){announce('A benchmark is already running.',false);return}
  if(data?.demo){announce('Benchmark execution is disabled in synthetic demo mode.',false);return}
  const token=await ensureCsrf();
  liveBenchmarkState={active:true,stage:'running',isDryRun:dryRun,progressPct:0,completedCount:0,totalTests:0,candidateIndex:0,candidateCount:0,currentRoute:'',currentProvider:'',activeCategories:{},liveRecords:[],logs:[{ts:new Date().toLocaleTimeString(),text:`Starting ${dryRun?'dry-run ':''}benchmark... Connecting to runner.`,type:'info'}],startTime:Date.now(),timerInterval:null};
  render();
  liveBenchmarkState.timerInterval=setInterval(()=>{
    const el=document.querySelector('#live-benchmark-timer');
    if(el&&liveBenchmarkState.startTime){
      const sec=Math.floor((Date.now()-liveBenchmarkState.startTime)/1000);
      const m=String(Math.floor(sec/60)).padStart(2,'0');
      const s=String(sec%60).padStart(2,'0');
      el.textContent=`⏱ ${m}:${s}`;
    }
  },1000);
  try{
    const response=await fetch(`/api/manage/automation/benchmark?stream=1`,{method:'POST',headers:{'content-type':'application/json','x-zerospend-csrf':token,'accept':'text/event-stream'},body:JSON.stringify({dry_run:dryRun})});
    if(!response.ok){const errJson=await response.json().catch(()=>({}));throw Error(errJson.error||`HTTP ${response.status}`)}
    const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='';
    while(true){
      const {done,value}=await reader.read();if(done)break;
      buffer+=decoder.decode(value,{stream:true});
      const lines=buffer.split('\n\n');buffer=lines.pop()||'';
      for(const line of lines){
        const trimmed=line.trim();if(!trimmed.startsWith('data:'))continue;
        try{const ev=JSON.parse(trimmed.slice(5).trim());handleBenchmarkEvent(ev)}catch{}
      }
    }
    if(buffer.trim().startsWith('data:')){
      try{const ev=JSON.parse(buffer.trim().slice(5).trim());handleBenchmarkEvent(ev)}catch{}
    }
  }catch(err){
    if(liveBenchmarkState.timerInterval)clearInterval(liveBenchmarkState.timerInterval);
    liveBenchmarkState.active=false;liveBenchmarkState.stage='error';
    liveBenchmarkState.logs.unshift({ts:new Date().toLocaleTimeString(),text:`Benchmark error: ${err.message}`,type:'fail'});
    updateLiveVisuals();
    announce(`Benchmark error: ${err.message}`,false);
  }
}

function automation(){
  const b=data.benchmark||{},recs=b.records||[],recMap=b.recommendations||{};
  const candCount=b.candidate_count||new Set(recs.map(r=>r.route)).size||0;
  const reqCount=b.request_count||recs.length||0;
  const lastDate=date(b.benchmarked_at);
  const topCode=recMap['free-code']?.recommended_primary||data.aliases?.['free-code']?.[0]||'None';
  const aliasKeys=['free-code','free-reasoning','free-sql','free-general','free-tools','free-fast'];
  const aliasIcons={'free-code':'💻','free-reasoning':'🧠','free-sql':'🗄️','free-general':'🌐','free-tools':'🛠️','free-fast':'⚡'};
  const championCards=aliasKeys.map(alias=>{
    const recInfo=recMap[alias]||{},primary=recInfo.recommended_primary||recInfo.current_primary||data.aliases?.[alias]?.[0];
    const cat=alias.replace('free-','');
    const winningRec=recs.find(r=>r.route===primary&&r.category===cat)||{};
    const provider=primary?primary.split('/')[0]:'None';
    const shortName=primary?primary.split('/').slice(1).join('/'):'No primary';
    return `<article class="champion-card"><div class="champion-alias"><span>${aliasIcons[alias]||'★'} ${esc(alias)}</span><span class="crown">👑 #1</span></div><div class="champion-model" title="${esc(primary||'')}">${primary?`<button class="model-name" data-model="${esc(primary)}">${esc(shortName)}</button>`:'—'}</div><div class="champion-metrics"><span>${badge(provider)}</span><span class="champion-score">${winningRec.score?`${winningRec.score} <small style="font-size:10px;color:var(--muted)">pts</small>`:'Verified'}</span><span>${winningRec.latency_ms?ms(winningRec.latency_ms):'—'}</span></div></article>`;
  }).join('');
  const catKeys=['all','code','reasoning','sql','general','tools','fast','long-context','structured'];
  const filterTabs=catKeys.map(cat=>{
    const label=cat==='all'?`All Tests (${recs.length})`:`${testMeta[cat]?.icon||''} ${testMeta[cat]?.label||cat}`;
    const active=benchmarkCategoryFilter===cat?'active':'';
    return `<button class="filter-tab ${active}" onclick="setBenchmarkCategoryFilter('${esc(cat)}')">${label}</button>`;
  }).join('');
  let filteredRecs=recs;
  if(benchmarkCategoryFilter!=='all')filteredRecs=recs.filter(r=>r.category===benchmarkCategoryFilter);
  filteredRecs=[...filteredRecs].sort((a,b)=>(b.score||0)-(a.score||0));
  const recordsTable=table([
    ['Rank',(_,i)=>`<span style="font-weight:700;color:var(--violet)">#${i+1}</span>`],
    ['Route / Model',r=>`<button class="model-name" data-model="${esc(r.route)}">${esc(r.route)}</button>`],
    ['Category',r=>badge(r.category,'violet')],
    ['Score',r=>`<div class="score-pill-wrap"><div class="mini-score-bar"><div class="mini-score-fill" style="width:${Math.min(100,Math.max(0,r.score||0))}%"></div></div><b>${r.score}</b></div>`],
    ['Latency',r=>`<span style="color:${(r.latency_ms||0)<1000?'var(--green)':(r.latency_ms||0)<5000?'var(--amber)':'var(--muted)'}">${ms(r.latency_ms)}</span>`],
    ['Reliability',r=>pct(r.reliability)],
    ['Tools',r=>r.tool_correct?badge('PASS','green'):badge('N/A','neutral')],
    ['Result',r=>badge(r.status===200?'PASS':'FAIL',r.status===200?'green':'red')]
  ],filteredRecs);
  return `<section class="auto-hero"><div class="auto-hero-top"><div class="auto-hero-title"><h2><span>◷</span> Automated Quality Benchmark &amp; Routing Engine</h2><p>Continuous, quota-bounded evaluations that identify and promote the highest-quality verified-free models into production without prompt storage.</p></div><div class="auto-actions">${data.demo?'<small class="muted">Disabled in demo</small>':`<button class="btn-primary" id="btn-run-benchmark" onclick="startLiveBenchmark(false)" ${liveBenchmarkState.active?'disabled':''}>⚡ Run Live Benchmark</button><button class="btn-secondary" id="btn-dry-benchmark" onclick="startLiveBenchmark(true)" ${liveBenchmarkState.active?'disabled':''}>🧪 Dry Run</button><button class="btn-secondary" onclick="runAutomationJob('discovery')">🔍 Discover Free Models</button>`}</div></div><div class="auto-stats"><div class="auto-stat-item"><label>Scheduled Jobs</label><strong>2 Active (04:10 / 04:40)</strong></div><div class="auto-stat-item"><label>Last Benchmark</label><strong title="${esc(lastDate)}">${esc(lastDate)}</strong></div><div class="auto-stat-item"><label>Evaluated Matrix</label><strong>${candCount} Candidates · ${reqCount} Tests</strong></div><div class="auto-stat-item"><label>Top Code Model</label><strong title="${esc(topCode)}">${esc(topCode.split('/').pop())}</strong></div><div class="auto-stat-item"><label>Cost / Quota Impact</label><strong style="color:var(--green)">100% Free Tiers ($0.00)</strong></div></div></section><section class="live-benchmark-box ${liveBenchmarkState.active?'running':''}" id="live-benchmark-box"><div class="live-head"><div class="live-title-wrap"><span class="live-status-pill ${liveBenchmarkState.active?'active':''}" id="live-status-pill">${liveBenchmarkState.active?`<span class="status-dot pulse"></span> RUNNING (${liveBenchmarkState.isDryRun?'DRY-RUN':'LIVE'})`:liveBenchmarkState.stage==='completed'?`<span class="status-dot"></span> COMPLETED`:liveBenchmarkState.stage==='error'?`<span class="status-dot amber"></span> ERROR`:`<span class="status-dot"></span> IDLE / READY`}</span><h3 style="margin:0;font-size:14px;color:var(--text)">Live Benchmark Progress Visualizer</h3></div><span class="live-timer" id="live-benchmark-timer">⏱ 00:00</span></div><div class="progress-bar-container"><div class="progress-meta"><span>Progress: <strong id="live-progress-pct">${liveBenchmarkState.progressPct}%</strong></span><span id="live-progress-count">${liveBenchmarkState.totalTests>0?`${liveBenchmarkState.completedCount} of ${liveBenchmarkState.totalTests} evaluations`:'Ready to start'}</span></div><div class="progress-track"><div class="progress-fill" id="live-progress-fill" style="width:${liveBenchmarkState.progressPct}%"></div></div></div><div class="active-candidate-card"><div class="candidate-info-block"><small>CURRENT EVALUATION CANDIDATE</small><b id="active-candidate-name">${esc(liveBenchmarkState.currentRoute||'Awaiting benchmark start...')}</b></div><div class="candidate-info-block" style="text-align:right"><small>CANDIDATE QUEUE</small><span id="active-candidate-meta" style="color:var(--muted);font-size:12px">${liveBenchmarkState.candidateCount>0?`Candidate ${liveBenchmarkState.candidateIndex} of ${liveBenchmarkState.candidateCount} · ${liveBenchmarkState.currentProvider}`:'Ready to queue candidates'}</span></div></div><div class="categories-suite"><h4>Evaluation Dimensions (The 8 Quality Categories)</h4><div class="category-badges-grid">${Object.entries(testMeta).map(([cat,meta])=>{const rec=liveBenchmarkState.activeCategories[cat];let cardClass='cat-item-card',resClass='cat-result',resText=meta.desc;if(rec){const pass=rec.status===200&&rec.score>0;cardClass+=pass?' pass':' fail';resClass+=pass?' green':' red';resText=`${pass?'✓ ':'✗ '}${rec.score} pts · ${ms(rec.latency_ms)}`}else if(liveBenchmarkState.active){cardClass+=' running';resText='Testing...'}return `<div class="${cardClass}" id="cat-card-${cat}"><div class="cat-header"><span>${meta.icon} ${meta.label}</span></div><div class="${resClass}" id="cat-res-${cat}">${resText}</div></div>`}).join('')}</div></div><div class="live-stream-feed" id="live-stream-feed">${liveBenchmarkState.logs.length?liveBenchmarkState.logs.slice(0,30).map(l=>`<div class="feed-row"><span class="ts">[${esc(l.ts)}]</span> <span class="${l.type}">${esc(l.text)}</span></div>`).join(''):'<div class="feed-row"><span class="ts">[System]</span> <span class="info">Click "⚡ Run Live Benchmark" to execute real-time evaluations across candidate models.</span></div>'}</div></section><section class="champions-container"><div class="panel-head" style="margin-bottom:12px"><h2>Benchmark Champions (Primary #1 per Task Alias)</h2><span class="muted">Promoted by quality score, instruction compliance &amp; reliability</span></div><div class="champions-grid">${championCards}</div></section><article class="panel"><div class="panel-head"><h2>Detailed Quality &amp; Latency Matrix</h2><span class="muted">Last run: ${esc(lastDate)}</span></div><div class="filter-tabs">${filterTabs}</div>${recordsTable}</article>${panel('Scheduled Automation Jobs',table([['Job','job'],['Schedule','schedule'],['Last result',r=>badge(r.last?.status||'NOT RUN',r.last?.status==='PASS'?'green':'neutral')],['Last run',r=>date(r.last?.finished_at||r.last?.benchmarked_at)],['Actions',r=>data.demo?'<small class="muted">Disabled in demo</small>':`<button class="run-job-btn" onclick="runAutomationJob('${esc(r.job)}')">⚡ Run Now</button>`]],data.automation))}`;}

function render(){if(!data)return;const meta=pages.find(x=>x[0]===page)||pages[0];page=meta[0];document.querySelector('#title').textContent=page;document.querySelector('#subtitle').textContent=meta[2];[...nav.children].forEach(b=>b.classList.toggle('active',b.dataset.page===page));if(page==='Overview')app.innerHTML=overview();else if(page==='Live Routing')app.innerHTML=panel('Routing stream',events(data.events),badge('METADATA ONLY','green'));else if(page==='Models')app.innerHTML=models();else if(page==='Routing')app.innerHTML=routing();else if(page==='Benchmarks')app.innerHTML=panel('Current benchmark evidence',table([['Task','category'],['Route','route'],['Score',r=>`<b>${r.score}</b>`],['Latency',r=>ms(r.latency_ms)],['Reliability',r=>pct(r.reliability)],['Tool call',r=>r.tool_correct?badge('PASS','green'):badge('N/A')]],data.benchmark.records||[]),`<span class="muted">Last run ${date(data.benchmark.benchmarked_at)}</span>`);else if(page==='Usage')app.innerHTML=`<div class="metrics usage">${card('Input tokens',n(data.summary.prompt_tokens))}${card('Output tokens',n(data.summary.completion_tokens))}${card('Total tokens',n(data.summary.total_tokens))}${card('Requests',n(data.summary.requests))}</div>${panel('By recent request',table([['Client','client'],['Task','category'],['Provider','provider'],['Model','model'],['Tokens','total_tokens'],['Latency',r=>ms(r.latency_ms)]],data.events))}`;else if(page==='Performance')app.innerHTML=performance();else if(page==='Providers')app.innerHTML=providers();else if(page==='Safety')app.innerHTML=safety();else if(page==='Automation')app.innerHTML=automation();else app.innerHTML=settings();bind();document.querySelector('#sidebar').classList.remove('open')}
document.querySelector('#open-nav').onclick=()=>document.querySelector('#sidebar').classList.add('open');document.querySelector('#close-nav').onclick=()=>document.querySelector('#sidebar').classList.remove('open');document.querySelector('#theme').onclick=()=>{const light=document.documentElement.classList.toggle('light');localStorage.setItem('zs-theme',light?'light':'dark')};if(localStorage.getItem('zs-theme')==='light')document.documentElement.classList.add('light');
const refreshBtn=document.querySelector('#refresh-btn');if(refreshBtn)refreshBtn.onclick=()=>{load(false);announce('Refreshing live metadata...',true)};
const autoBtn=document.querySelector('#auto-btn');if(autoBtn){autoBtn.onclick=()=>{autoRefreshEnabled=!autoRefreshEnabled;autoBtn.style.color=autoRefreshEnabled?'var(--green)':'var(--muted)';const modeEl=document.querySelector('#mode');if(modeEl&&data?.demo===false)modeEl.innerHTML=`<span class="status-dot ${autoRefreshEnabled?'pulse':''}"></span> LIVE METADATA${autoRefreshEnabled?' <small>· 3s</small>':''}`;announce(autoRefreshEnabled?'Auto-refresh enabled (every 3s)':'Auto-refresh paused',true)};autoBtn.style.color='var(--green)'}
const modeBtn=document.querySelector('#mode');if(modeBtn)modeBtn.onclick=()=>{requestedDemo=data?.demo===false?true:false;announce(requestedDemo?'Switched to synthetic demo mode':'Switched to live metadata mode',true);load(false)};
globalThis.providerAction=providerAction;globalThis.runAutomationJob=runAutomationJob;globalThis.discoverAll=discoverAll;globalThis.startLiveBenchmark=startLiveBenchmark;globalThis.setBenchmarkCategoryFilter=c=>{benchmarkCategoryFilter=c;render()};addEventListener('hashchange',()=>{page=location.hash.slice(1)||'Overview';render()});
function initAutoRefresh(){if(refreshTimer)clearInterval(refreshTimer);refreshTimer=setInterval(()=>{if(!autoRefreshEnabled||document.hidden)return;const dialog=document.querySelector('#model-dialog');if(dialog&&dialog.open)return;const active=document.activeElement;if(active&&(active.tagName==='INPUT'||active.tagName==='TEXTAREA'))return;load(true)},3000)}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&autoRefreshEnabled)load(true)});
initAutoRefresh();load();
