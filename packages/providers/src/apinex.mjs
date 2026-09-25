import {OpenAICompatibleProvider} from './openai-compatible.mjs';

const numericZero=value=>value!==null&&value!==undefined&&value!==''&&Number.isFinite(Number(value))&&Number(value)===0;
const firstDefined=(source,keys)=>keys.map(key=>source?.[key]).find(value=>value!==undefined&&value!==null);

export function apiNexPricing(model={}){
  const pricing=model.pricing||model.price||{};
  return {
    input:firstDefined(pricing,['prompt','input','input_per_million','input_per_1m','input_usd_per_1m'])??firstDefined(model,['input_price','input_price_per_million']),
    output:firstDefined(pricing,['completion','output','output_per_million','output_per_1m','output_usd_per_1m'])??firstDefined(model,['output_price','output_price_per_million'])
  };
}

export function hasExplicitApiNexFreeEvidence(model={}){
  const id=String(model.id||'').toLowerCase();
  const tier=String(model.tier||model.plan||model.access||model.pricing_tier||'').toLowerCase();
  return model.free===true||model.is_free===true||tier==='free'||/(^|[:/_-])free($|[:/_-])/.test(id);
}

export class ApiNexProvider extends OpenAICompatibleProvider{
  constructor(options={}){
    super({
      baseUrl:'https://api.apinex.bond/v1',
      catalogUrl:'https://apinex.bond/api/public/models',
      ...options
    });
  }

  async freeEvidence(){
    try{
      const r=await this.fetch(this.options.catalogUrl,{signal:AbortSignal.timeout(30000)});
      if(!r.ok)return new Set();
      const data=await r.json();
      const models=Array.isArray(data)?data:data.models||[];
      const ids=new Set();
      for(const m of models){
        if(m?.allowFree===true&&(m.provider==='Free'||String(m.id||'').startsWith('free/'))){
          ids.add(m.id);
        }
      }
      return ids;
    }catch{
      return new Set();
    }
  }

  async verifyFree(model,evidence){
    const pricing=apiNexPricing(model);
    const hasZeroPricing=numericZero(pricing.input)&&numericZero(pricing.output);
    const explicitFree=hasExplicitApiNexFreeEvidence(model);

    if(evidence instanceof Set){
      return evidence.has(model?.id)||(explicitFree&&hasZeroPricing);
    }
    if(evidence?.ids instanceof Set){
      return evidence.ids.has(model?.id)||(explicitFree&&hasZeroPricing);
    }

    return explicitFree&&hasZeroPricing;
  }

  async healthCheck(model){
    const started=Date.now();
    try{
      let r=await this.fetch(`${this.options.baseUrl}/chat/completions`,{
        method:'POST',
        headers:this.headers(),
        body:JSON.stringify({model,messages:[{role:'user',content:'Reply OK'}],max_tokens:8}),
        signal:AbortSignal.timeout(15000)
      });
      if(r.status===429){
        await new Promise(resolve=>setTimeout(resolve,3000));
        r=await this.fetch(`${this.options.baseUrl}/chat/completions`,{
          method:'POST',
          headers:this.headers(),
          body:JSON.stringify({model,messages:[{role:'user',content:'Reply OK'}],max_tokens:8}),
          signal:AbortSignal.timeout(15000)
        });
      }
      await r.body?.cancel();
      return {
        available:r.ok,
        status:r.status,
        error_class:r.status===429?'local_rate_limited':undefined,
        latency_ms:Date.now()-started
      };
    }catch(e){
      return {available:false,status:null,error:e.name,latency_ms:Date.now()-started};
    }
  }
}
