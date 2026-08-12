import {OpenAICompatibleProvider} from './openai-compatible.mjs';
export class NvidiaProvider extends OpenAICompatibleProvider{
  constructor(options={}){super({baseUrl:'https://integrate.api.nvidia.com/v1',...options})}
  async verifyFree(model,evidence){return evidence?.label==='Free Endpoint'&&evidence?.current===true&&Boolean(model?.id)}
}
