import {OpenAICompatibleProvider} from './openai-compatible.mjs';
export class OpenRouterProvider extends OpenAICompatibleProvider{
  async verifyFree(model){const p=model?.pricing||{};return typeof model?.id==='string'&&model.id.endsWith(':free')&&Number(p.prompt)===0&&Number(p.completion)===0&&model.id!=='openrouter/free'}
}
