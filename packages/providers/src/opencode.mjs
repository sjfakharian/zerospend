import { OpenAICompatibleProvider } from './openai-compatible.mjs';

export class OpenCodeProvider extends OpenAICompatibleProvider {
  constructor(options = {}) { super({ baseUrl: 'https://opencode.ai/zen/v1', pricingUrl: 'https://opencode.ai/docs/zen/', ...options }); }
  async freeEvidence() {
    const response = await fetch(this.options.pricingUrl, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw Error(`pricing evidence ${response.status}`);
    const text = await response.text();
    return new Set(text.match(/\b(?:big-pickle|[a-z0-9.-]+-free)\b/g) || []);
  }
  async verifyFree(model, evidence) { return Boolean(model?.id && evidence?.has(model.id)); }
}
