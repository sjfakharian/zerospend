import path from 'node:path';
import {copyFile,mkdir,readFile} from 'node:fs/promises';
import {paths} from '../../shared/src/paths.mjs';
import {atomicJson,readJson,withLock} from '../../shared/src/files.mjs';

export const categories=['code','sql','reasoning','general','tools','fast','long-context','structured'];

const tests={
  code:{prompt:'Return only JSON with result=6 for sum([1,2,3]).'},
  sql:{prompt:'Return only JSON with sql containing SELECT COUNT and GROUP BY department.'},
  reasoning:{prompt:'Return only JSON with result=102 for 17*6.'},
  general:{prompt:'Return only JSON with answer=Paris for the capital of France.'},
  fast:{prompt:'Reply exactly OK.'},
  'long-context':{prompt:'Return only JSON with marker=retained after reading this synthetic context.'},
  structured:{prompt:'Return only JSON with ok=true.'},
  tools:{
    prompt:'Call calculator for 7+5.',
    tools:[{type:'function',function:{name:'calculator',description:'Calculate',parameters:{type:'object',properties:{expression:{type:'string'}},required:['expression']}}}],
    tool_choice:{type:'function',function:{name:'calculator'}}
  }
};

export function score(result,category){
  const weights={correctness:45,instruction:15,reliability:20,latency:10,tools:10};
  if(category==='tools'){weights.tools=45;weights.correctness=10}
  return Number(Object.entries(weights).reduce((n,[k,w])=>n+(Number(result[k])||0)*w,0).toFixed(2))
}

export function shouldPromote(current,challenger,threshold=7){
  return (challenger?.score||0)-(current?.score||0)>=threshold||(current?.reliability||0)<.7
}

export function reliability(stat={}){
  if(!stat.request_count)return .75;
  return Math.max(0,Math.min(1,(stat.success_count||0)/stat.request_count-(stat.rate_limit_count||0)/stat.request_count*.6))
}

export function grade(category,json){
  const msg=json.choices?.[0]?.message||{};
  if(category==='tools'){
    const hasToolCall=msg.tool_calls?.[0]?.function?.name==='calculator';
    return {correctness:hasToolCall?1:0,instruction:1,tools:hasToolCall?1:0};
  }
  let content=(msg.content||'').trim();
  content=content.replace(/<think>[\s\S]*?<\/think>/gi,'').trim();
  if(content.startsWith('```')){
    content=content.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
  }
  let v={};
  try{v=JSON.parse(content)}catch{
    const match=content.match(/\{[\s\S]*\}/);
    if(match){try{v=JSON.parse(match[0])}catch{}}
  }
  const ok=category==='code'?(Number(v.result)===6||content.includes('"result": 6')||content.includes('"result":6')):
           category==='sql'?((v.sql&&/SELECT/i.test(v.sql)&&/COUNT/i.test(v.sql)&&/GROUP BY/i.test(v.sql))||(/SELECT/i.test(content)&&/COUNT/i.test(content)&&/GROUP BY/i.test(content))):
           category==='reasoning'?(Number(v.result)===102||content.includes('"result": 102')||content.includes('"result":102')):
           category==='general'?(String(v.answer||'').toLowerCase()==='paris'||/paris/i.test(content)):
           category==='fast'?(content.toUpperCase().startsWith('OK')):
           category==='long-context'?(v.marker==='retained'||content.includes('"marker": "retained"')||content.includes('"marker":"retained"')):
           category==='structured'?(v.ok===true||content.includes('"ok": true')||content.includes('"ok":true')):false;
  return {correctness:ok?1:0,instruction:ok?1:0,tools:0}
}

export async function runBenchmark(options={}){
  const p=options.paths||paths(),dryRun=options.dryRun??false,onProgress=typeof options.onProgress==='function'?options.onProgress:(()=>{});
  const defaultCaller=async(route,test)=>{
    const key=route.secret_file?(await readFile(path.join(p.secrets,route.secret_file),'utf8')).trim():'';
    const started=Date.now();
    const base=(route.base_url||'').replace(/\/$/,'');
    const response=await fetch(`${base}/chat/completions`,{
      method:'POST',
      headers:{...(key?{authorization:`Bearer ${key}`}:{}),'content-type':'application/json'},
      body:JSON.stringify({
        model:route.model_id,
        messages:[{role:'user',content:test.prompt}],
        ...(test.tools?{tools:test.tools,tool_choice:test.tool_choice}:{}),
        max_tokens:180,
        temperature:0
      }),
      signal:AbortSignal.timeout(20000)
    });
    let json={};
    try{json=await response.json()}catch{};
    return {status:response.status,latency_ms:Date.now()-started,json};
  };
  const caller=options.call||defaultCaller;
  return withLock(path.join(p.runtime,'benchmark.lock'),async()=>{
    const inventory=options.inventory||await readJson(path.join(p.state,'verified-routes.json'),{routes:{}}),
          config=options.config||await readJson(path.join(p.config,'routing.json')),
          runtime=options.runtime||await readJson(path.join(p.state,'runtime-stats.json'),{models:{}}),
          candidatePool=Object.values(inventory.routes||{}).filter(r=>r.zero_cost&&r.available&&r.production_eligible);
    const tier=r=>{
      const s=String(r?.route||r?.model_id||'').toLowerCase();
      if(s.includes('ultra')||s.includes('550b')||s.includes('340b')||s.includes('gpt-6')||s.includes('deepseek-v4-pro'))return 40;
      if(s.includes('super')||s.includes('120b')||s.includes('deepseek-v4.1')||s.includes('deepseek-v4')||s.includes('mimo-v2.6-pro'))return 30;
      if(s.includes('lightning')||s.includes('70b')||s.includes('coder')||s.includes('kimi'))return 20;
      if(s.includes('flash')||s.includes('30b')||s.includes('qwen')||s.includes('glm'))return 10;
      return 0;
    };
    candidatePool.sort((a,b)=>tier(b)-tier(a));
    const routes=candidatePool.slice(0,Number(options.maxCandidates||12));
    if(!routes.length)throw Error('FREE_CAPACITY_UNAVAILABLE');
    await onProgress({
      type: 'init',
      candidate_count: routes.length,
      categories,
      candidates: routes.map(r => ({ route: r.route, provider: r.provider, model_id: r.model_id })),
      total_tests: routes.length * categories.length
    });
    const records=[];
    for(let rIdx = 0; rIdx < routes.length; rIdx++){
      const route = routes[rIdx];
      await onProgress({
        type: 'candidate_start',
        candidate_index: rIdx + 1,
        candidate_count: routes.length,
        route: route.route,
        provider: route.provider
      });
      const routeRecords=await Promise.all(categories.map(async category=>{
        const started=Date.now();let result;
        try{
          result=await caller(route,tests[category]);
        }catch(error){
          result={status:0,json:{},error:error.message};
        }
        const is200=Boolean(result&&result.status===200);
        const quality=is200?grade(category,result.json||{}):{correctness:0,instruction:0,tools:0};
        const rel=is200?reliability(runtime.models?.[route.route]):0;
        const latency=is200?Math.max(0,1-(result.latency_ms??Date.now()-started)/20000):0;
        const rec = {
          route:route.route,
          category,
          status:result.status,
          latency_ms:result.latency_ms??Date.now()-started,
          quality,
          reliability:rel,
          score:score({...quality,reliability:rel,latency},category),
          tool_correct:quality.tools===1
        };
        await onProgress({
          type: 'test_done',
          candidate_index: rIdx + 1,
          candidate_count: routes.length,
          route: route.route,
          category,
          record: rec
        });
        return rec;
      }));
      records.push(...routeRecords);
      await onProgress({
        type: 'candidate_done',
        candidate_index: rIdx + 1,
        candidate_count: routes.length,
        route: route.route,
        completed_tests: records.length,
        total_tests: routes.length * categories.length
      });
    }
    const successfulRecords=records.filter(r=>r.status===200);
    if(!successfulRecords.length)throw Error('benchmark incomplete; production preserved');
    const next=structuredClone(config),recommendations={};
    for(const category of categories){
      const alias=`free-${category}`;
      const ranked=records.filter(r=>r.category===category&&r.status===200).sort((a,b)=>b.score-a.score);
      const existing=config.aliases[alias]||[];
      const current=ranked.find(r=>r.route===existing[0])||{route:existing[0],score:0,reliability:0};
      const challenger=ranked[0];
      const primary=challenger&&shouldPromote(current,challenger,config.promotion_score_margin||7)?challenger.route:(current.route||existing[0]||null);
      const ordered=[primary,...ranked.map(r=>r.route),...existing].filter((x,i,a)=>x&&a.indexOf(x)===i);
      next.aliases[alias]=ordered.slice(0,Math.max(existing.length,6));
      recommendations[alias]={current_primary:current.route||null,recommended_primary:primary,rankings:ranked};
    }
    const result={schema_version:2,benchmarked_at:new Date().toISOString(),dry_run:dryRun,candidate_count:routes.length,request_count:records.length,records,recommendations};
    await atomicJson(path.join(p.state,'benchmark-results.json'),result);
    if(!dryRun){
      await mkdir(p.backups,{recursive:true,mode:0o700});
      const backup=path.join(p.backups,`routing-${Date.now()}.json`);
      await copyFile(path.join(p.config,'routing.json'),backup);
      await atomicJson(path.join(p.config,'routing.json'),next);
      await atomicJson(path.join(p.state,'ranking-history.json'),{updated_at:new Date().toISOString(),backup,recommendations});
    }
    await onProgress({
      type: 'complete',
      result
    });
    return result;
  });
}
