export function isVerifiedFree(route,inventory){const proof=inventory?.routes?.[route];return proof?.zero_cost===true&&proof?.available===true&&proof?.production_eligible!==false}
export function validateConfig(config,inventory){if(config?.zero_cost_policy!=="strict")throw Error("strict zero-cost policy required");for(const [alias,routes] of Object.entries(config.aliases||{})){if(!alias.startsWith("free-")||!Array.isArray(routes))throw Error(`invalid alias: ${alias}`);for(const route of routes)if(!isVerifiedFree(route,inventory))throw Error(`unverified route rejected: ${route}`)}return true}
export function capacityHealth(config,inventory){validateConfig(config,inventory);const aliases=config.aliases||{},empty_aliases=Object.entries(aliases).filter(([,routes])=>routes.length===0).map(([alias])=>alias),proofs=Object.values(inventory?.routes||{}),paid_routes=proofs.filter(route=>route.production_eligible&&route.zero_cost!==true).length,unverified_routes=proofs.filter(route=>route.production_eligible&&!isVerifiedFree(route.route,inventory)).length;return {status:empty_aliases.length?'degraded':'ok',strict_free:true,paid_routes,unverified_routes,empty_aliases}}
export function orderRoutes(routes,stats={},options={}){
  const rateLimited=options.rateLimited||new Map(),benchmarkScores=options.benchmarkScores||{},category=options.category||'';
  const now=Date.now();
  const getScore = r => {
    const entry=rateLimited.get?.(r);
    const cool=entry&&now-(entry.timestamp||now)<(Number(entry.retry_after)?Number(entry.retry_after)*1000:60000)?1:0;
    const s=stats[r]||{};
    const statScore=(s.success_rate??.75)*100-(s.rate_limit_rate||0)*60-Math.min(25,(s.p50_latency_ms||0)/1000);
    const bench=Number(benchmarkScores[r]||0);
    const str=String(r||'').toLowerCase();
    let tier=0;
    if(str.includes('ultra')||str.includes('550b')||str.includes('340b')||str.includes('gpt-6')||str.includes('deepseek-v4-pro'))tier=35;
    else if(str.includes('super')||str.includes('120b')||str.includes('deepseek-v4.1')||str.includes('deepseek-v4')||str.includes('mimo-v2.6-pro'))tier=25;
    else if(str.includes('lightning')||str.includes('70b')||str.includes('pro')||str.includes('coder')||str.includes('kimi'))tier=20;
    else if(str.includes('flash')||str.includes('30b')||str.includes('27b')||str.includes('qwen')||str.includes('glm'))tier=12;
    else if(str.includes('2.6b')||str.includes('2b')||str.includes('mini')||str.includes('note-preview'))tier=category==='fast'?15:-10;
    return { cool, score: statScore + bench + tier, route: r };
  };
  return [...routes].map(getScore).sort((a,b)=>{
    if(a.cool!==b.cool)return a.cool-b.cool;
    return b.score-a.score;
  }).map(x=>x.route);
}
