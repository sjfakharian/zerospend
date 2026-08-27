import {OpenAICompatibleProvider} from './openai-compatible.mjs';

const numericZero=value=>value!==null&&value!==undefined&&value!==''&&Number.isFinite(Number(value))&&Number(value)===0;
const firstDefined=(source,keys)=>keys.map(key=>source?.[key]).find(value=>value!==undefined&&value!==null);

export function tokenHarborPricing(model={}){
  const pricing=model.pricing||model.price||{};
  return {
    input:firstDefined(pricing,['prompt','input','input_per_million','input_per_1m','input_usd_per_1m'])??firstDefined(model,['input_price','input_price_per_million']),
    output:firstDefined(pricing,['completion','output','output_per_million','output_per_1m','output_usd_per_1m'])??firstDefined(model,['output_price','output_price_per_million'])
  };
}

export class TokenHarborProvider extends OpenAICompatibleProvider{
  constructor(options={}){super({baseUrl:'https://tokenharbor.ai/v1',...options})}
  async verifyFree(model){
    const pricing=tokenHarborPricing(model);
    return typeof model?.id==='string'&&model.id.endsWith(':free')&&numericZero(pricing.input)&&numericZero(pricing.output);
  }
}
