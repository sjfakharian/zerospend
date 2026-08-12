export const UNSUPPORTED_MODEL=406;
export const RATE_LIMITED=429;
export function eligibleFallbacks(aliasRoutes,inventory,stale=new Set()){return aliasRoutes.filter(route=>!stale.has(route)&&inventory.routes?.[route]?.zero_cost===true&&inventory.routes[route].available===true&&inventory.routes[route].production_eligible===true&&inventory.routes[route].provider!=='opencode')}
export async function handleUnsupportedModel({route,inventory,state,refresh,now=Date.now,cooldownMs=60000}){state.stale.add(route);const proof=inventory.routes?.[route];if(proof?.provider!=='opencode-free'||now()-state.lastRefresh<cooldownMs)return false;state.lastRefresh=now();await refresh();return true}
export function handleRateLimited({route,state,retryAfter=null}){state.rateLimited||=new Map();state.rateLimited.set(route,{retry_after:retryAfter,observed_at:new Date().toISOString()});return false}
