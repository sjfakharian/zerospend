import {OpenAICompatibleProvider} from './openai-compatible.mjs';
const markers=new Set(['opencode-free','opencode_free','opencodefree']);
const text=value=>String(value||'').trim().toLowerCase();
export function openCodeFreeEvidence(model,{observedAt=new Date().toISOString()}={}){const sources=[model.provider,model.provider_id,model.owned_by,model.source,model.upstream_provider,model.metadata?.provider,model.metadata?.source].map(text),noAuth=model.auth_mode==='none'||model.metadata?.auth_mode==='none',explicit=sources.some(source=>markers.has(source));return explicit&&noAuth?{provider:'opencode-free',backend:'9router',auth_mode:'none',model_id:model.id,observed_at:observedAt,source:'current 9Router OpenCode Free inventory metadata'}:null}
export class OpenCodeFreeProvider extends OpenAICompatibleProvider{
  async freeEvidence(models=[]){const observedAt=new Date().toISOString();return new Map(models.map(model=>[model.id,openCodeFreeEvidence(model,{observedAt})]).filter(([,evidence])=>evidence))}
  async verifyFree(model,evidence){return evidence?.get(model.id)||false}
}
