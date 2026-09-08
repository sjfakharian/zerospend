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
  constructor(options={}){super({baseUrl:'https://api.apinex.bond/v1',...options})}
  async verifyFree(model){
    const pricing=apiNexPricing(model);
    return hasExplicitApiNexFreeEvidence(model)&&numericZero(pricing.input)&&numericZero(pricing.output);
  }
}
