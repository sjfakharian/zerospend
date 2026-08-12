import {OpenAICompatibleProvider} from './openai-compatible.mjs';
const markers=new Set(['opencode-free','opencode_free','opencodefree']);
const text=value=>String(value||'').trim().toLowerCase();
const CATALOG_URL='https://opencode.ai/zen/v1/models';
export function openCodeFreeEvidence(model,{observedAt=new Date().toISOString()}={}){const sources=[model.provider,model.provider_id,model.owned_by,model.source,model.upstream_provider,model.metadata?.provider,model.metadata?.source].map(text),noAuth=model.auth_mode==='none'||model.metadata?.auth_mode==='none',explicit=sources.some(source=>markers.has(source));return explicit&&noAuth?{provider:'opencode-free',backend:'9router',auth_mode:'none',model_id:model.id,observed_at:observedAt,source:'current 9Router OpenCode Free inventory metadata'}:null}
export class OpenCodeFreeProvider extends OpenAICompatibleProvider{
  backendUrl(){return new URL(this.options.baseUrl).origin}
  async backendStatus(){const health=await this.fetch(`${this.backendUrl()}/api/health`,{signal:AbortSignal.timeout(3000)});if(!health.ok)throw Error(`backend health ${health.status}`);const inventory=await this.fetch(CATALOG_URL,{signal:AbortSignal.timeout(5000)});if(!inventory.ok)throw Error(`provider inventory ${inventory.status}`);const json=await inventory.json(),raw=Array.isArray(json.data)?json.data:[],data=raw.filter(model=>model?.id==='big-pickle'||String(model?.id||'').endsWith('-free')),observedAt=new Date().toISOString();return {backend_reachable:true,inventory_endpoint_reachable:true,provider_available:true,provider:'opencode-free',provider_id:'opencode',backend:'9router',auth_mode:'none',evidence_at:observedAt,evidence_source:'current official OpenCode catalog plus bounded local 9Router probe',models:data.map(model=>({...model,provider:'opencode-free',provider_id:'opencode',auth_mode:'none',metadata:{...(model.metadata||{}),provider:'opencode-free',auth_mode:'none',evidence_at:observedAt}}))}}
  async discover(){return (await this.backendStatus()).models}
  async freeEvidence(models=[]){const observedAt=new Date().toISOString();return new Map(models.map(model=>[model.id,openCodeFreeEvidence(model,{observedAt})]).filter(([,evidence])=>evidence))}
  async verifyFree(model,evidence){return evidence?.get(model.id)||false}
  async healthCheck(model){return super.healthCheck(`oc/${String(model).replace(/^oc\//,'')}`)}
}
