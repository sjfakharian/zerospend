import {OpenAICompatibleProvider} from './openai-compatible.mjs';
export class NvidiaProvider extends OpenAICompatibleProvider{
  constructor(options={}){super({baseUrl:'https://integrate.api.nvidia.com/v1',catalogUrl:'https://build.nvidia.com/explore/discover',...options})}
  async freeEvidence(){const r=await fetch(this.options.catalogUrl,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(`free evidence ${r.status}`);const text=await r.text(),ids=new Set();for(const m of text.matchAll(/Free Endpoint[\s\S]{0,2500}?href(?:=|\\\":\\\")\"?\/([a-z0-9._-]+\/[a-z0-9._-]+)/gi))ids.add(m[1]);return ids}
  async verifyFree(model,evidence){return evidence?.label==='Free Endpoint'&&evidence?.current===true&&Boolean(model?.id)}
}
