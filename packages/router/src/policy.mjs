export function isVerifiedFree(route,inventory){const proof=inventory?.routes?.[route];return proof?.zero_cost===true&&proof?.available===true&&proof?.production_eligible!==false}
export function validateConfig(config,inventory){if(config?.zero_cost_policy!=="strict")throw Error("strict zero-cost policy required");for(const [alias,routes] of Object.entries(config.aliases||{})){if(!alias.startsWith("free-")||!Array.isArray(routes))throw Error(`invalid alias: ${alias}`);for(const route of routes)if(!isVerifiedFree(route,inventory))throw Error(`unverified route rejected: ${route}`)}return true}
export function capacityHealth(config,inventory){validateConfig(config,inventory);const aliases=config.aliases||{},empty_aliases=Object.entries(aliases).filter(([,routes])=>routes.length===0).map(([alias])=>alias),proofs=Object.values(inventory?.routes||{}),paid_routes=proofs.filter(route=>route.production_eligible&&route.zero_cost!==true).length,unverified_routes=proofs.filter(route=>route.production_eligible&&!isVerifiedFree(route.route,inventory)).length;return {status:empty_aliases.length?'degraded':'ok',strict_free:true,paid_routes,unverified_routes,empty_aliases}}
export function orderRoutes(routes,stats={},options={}){
  const rateLimited=options.rateLimited||new Map(),benchmarkScores=options.benchmarkScores||{},category=options.category||'';
  return [...routes].sort((a,b)=>{
    const now=Date.now();
    const entryA=rateLimited.get?.(a),entryB=rateLimited.get?.(b);
    const coolA=entryA&&now-(entryA.timestamp||now)<(Number(entryA.retry_after)?Number(entryA.retry_after)*1000:60000)?1:0;
    const coolB=entryB&&now-(entryB.timestamp||now)<(Number(entryB.retry_after)?Number(entryB.retry_after)*1000:60000)?1:0;
    if(coolA!==coolB)return coolA-coolB;
    const sa=stats[a]||{},sb=stats[b]||{};
    const statScore=x=>(x.success_rate??.75)*100-(x.rate_limit_rate||0)*60-Math.min(25,(x.p50_latency_ms||0)/1000);
    const benchA=Number(benchmarkScores[a]||0),benchB=Number(benchmarkScores[b]||0);
    const tier=r=>{
      const s=String(r||'').toLowerCase();
      if(s.includes('ultra')||s.includes('550b')||s.includes('340b'))return 30;
      if(s.includes('lightning')||s.includes('70b')||s.includes('pro')||s.includes('coder')||s.includes('kimi'))return 20;
      if(s.includes('flash')||s.includes('30b')||s.includes('27b'))return 10;
      if(s.includes('2.6b')||s.includes('2b')||s.includes('mini'))return category==='fast'?15:-10;
      return 0;
    };
    return (statScore(sb)+benchB+tier(b))-(statScore(sa)+benchA+tier(a));
  });
}
