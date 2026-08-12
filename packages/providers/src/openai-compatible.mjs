import {ProviderAdapter} from './base.mjs';
export class OpenAICompatibleProvider extends ProviderAdapter{
  headers(){return {'content-type':'application/json',...(this.options.apiKey?{authorization:`Bearer ${this.options.apiKey}`}:{})}}
  async discover(){const r=await fetch(`${this.options.baseUrl}/models`,{headers:this.headers()});if(!r.ok)throw Error(`catalog ${r.status}`);return (await r.json()).data||[]}
  async healthCheck(model){const started=Date.now();try{const r=await fetch(`${this.options.baseUrl}/chat/completions`,{method:'POST',headers:this.headers(),body:JSON.stringify({model,messages:[{role:'user',content:'Reply OK'}],max_tokens:8}),signal:AbortSignal.timeout(15000)});await r.body?.cancel();return {available:r.ok,status:r.status,latency_ms:Date.now()-started}}catch(e){return {available:false,status:null,error:e.name,latency_ms:Date.now()-started}}}
  async chat(body){return fetch(`${this.options.baseUrl}/chat/completions`,{method:'POST',headers:this.headers(),body:JSON.stringify(body)})}
  supportsTools(){return true}
  getCapabilities(model={}){const p=model.supported_parameters||[];return {context_window:model.context_length||null,tools:p.includes('tools')||p.includes('tool_choice'),structured_output:p.includes('response_format')||p.includes('structured_outputs')}}
}
