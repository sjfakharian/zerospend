import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { OpenRouterProvider, OpenCodeProvider, OpenCodeFreeProvider, NvidiaProvider } from '../../providers/src/index.mjs';
import { paths } from '../../shared/src/paths.mjs';
import { atomicJson, readJson, withLock } from '../../shared/src/files.mjs';

const now = () => new Date().toISOString();
const secret = async (file) => file ? (await readFile(path.join(paths().secrets, file), 'utf8')).trim() : '';
const capability = (adapter, model) => ({ ...adapter.getCapabilities(model), display_name: model.name || model.id });

export function normalizeRoute({ provider, backend, model, baseUrl, secretFile, evidence, available }) {
  return { route: `${provider}/${model.id}`, model_id: model.id, display_name: model.name || model.id, provider, backend,
    zero_cost: true, evidence, evidence_at: now(), available: available.available, availability_status: available.status,
    latest_latency_ms: available.latency_ms, production_eligible: available.available, base_url: baseUrl, secret_file: secretFile,
    context_window: model.context_length || null, capabilities: model.capabilities || {} };
}

export async function discoverConfigured(options = {}) {
  const p = options.paths || paths(), config = options.providers || await readJson(path.join(p.config, 'providers.json'), { providers: {} });
  const adapters = options.adapters || {};
  return withLock(path.join(p.runtime, 'discovery.lock'), async () => {
    const previous = await readJson(path.join(p.state, 'verified-routes.json'), { schema_version: 2, routes: {} });
    const routes = {}, rejected = {}, providerResults = {};
    try {
      for (const [name, setting] of Object.entries(config.providers || {})) {
        if (!setting.enabled || name === 'omniroute') continue;
        const apiKey = options.apiKeys?.[name] ?? await secret(setting.secret_file).catch(() => '');
        if (!apiKey && setting.auth_mode !== 'none' && name !== 'openrouter') { providerResults[name] = { status: 'SKIPPED', reason: 'credential not configured' }; continue; }
        const adapter = adapters[name] || (name === 'openrouter' ? new OpenRouterProvider({ baseUrl: setting.base_url, apiKey }) : name === 'opencode' ? new OpenCodeProvider({ baseUrl: setting.base_url, apiKey }) : name === 'nvidia' ? new NvidiaProvider({ baseUrl: setting.base_url, apiKey }) : name === 'opencode-free' ? new OpenCodeFreeProvider({ baseUrl: setting.base_url, apiKey:'' }) : null);
        if (!adapter) continue;
        const discovered = await adapter.discover(), models=name==='opencode-free'?discovered.slice(0,3):discovered, evidence = adapter.freeEvidence ? await adapter.freeEvidence(name==='opencode-free'?models:undefined) : null;
        let eligible = 0;
        for (const model of models) {
          const free = name === 'nvidia' ? await adapter.verifyFree(model, { label: evidence.has(model.id) ? 'Free Endpoint' : null, current: true }) : await adapter.verifyFree(model, evidence);
          if (!free) { rejected[`${name}/${model.id}`] = { provider: name, reason: 'UNKNOWN COST = NOT FREE' }; continue; }
          const health = await adapter.healthCheck(model.id);
          const item = normalizeRoute({ provider: name, backend: setting.backend||name, model: { ...model, capabilities: capability(adapter, model) }, baseUrl: setting.base_url, secretFile: setting.secret_file, evidence: name === 'nvidia' ? 'current official Free Endpoint label plus live catalog' : name === 'openrouter' ? 'explicit :free ID and zero prompt/completion pricing' : name==='opencode-free'?free.source:'current advertised-free evidence plus live catalog', available: health });
          if (item.production_eligible) { routes[item.route] = item; eligible += 1; } else rejected[item.route] = { ...item, reason: 'bounded availability check failed',error_class:health.error_class||'local_probe_rejected',local_model_id:health.local_model_id||null };
        }
        const failures=Object.values(rejected).filter(item=>item.provider===name),allRateLimited=failures.length>0&&failures.every(item=>item.error_class==='local_rate_limited');
        providerResults[name] = { status: eligible?'PASS':allRateLimited?'TEMPORARY_CAPACITY':'UNAVAILABLE', discovered: discovered.length,probed:models.length, eligible,error_class:eligible?null:allRateLimited?'temporary_free_capacity_unavailable':failures.at(-1)?.error_class||null };
      }
      if (!Object.keys(routes).length) throw Error('no configured provider produced verified-free capacity');
      const inventory = { schema_version: 2, verified_at: now(), policy: 'UNKNOWN COST = NOT FREE', providers: providerResults, routes, rejected };
      await atomicJson(path.join(p.state, 'verified-routes.json'), inventory);
      await atomicJson(path.join(p.state, 'discovery-report.json'), { status: 'PASS', finished_at: now(), providers: providerResults, eligible_routes: Object.keys(routes).length, rejected_routes: Object.keys(rejected).length });
      return inventory;
    } catch (error) {
      await atomicJson(path.join(p.state, 'discovery-report.json'), { status: 'FAILED_SAFE', finished_at: now(), error: error.message, previous_inventory_preserved: true });
      if (!Object.keys(previous.routes || {}).length) throw error;
      return { ...previous, discovery_error: error.message, previous_inventory_preserved: true };
    }
  }, { onRecovered: options.onLockRecovered });
}

export async function discoverOpenRouter() { return Object.values((await discoverConfigured()).routes).filter(route => route.provider === 'openrouter'); }
