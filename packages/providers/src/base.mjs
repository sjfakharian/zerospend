export class ProviderAdapter {
  constructor(options={}){this.options=options}
  async discover(){throw Error("discover() not implemented")}
  async verifyFree(){throw Error("verifyFree() not implemented")}
  async healthCheck(){throw Error("healthCheck() not implemented")}
  async chat(){throw Error("chat() not implemented")}
  async *stream(){throw Error("stream() not implemented")}
  supportsTools(){return false}
  getCapabilities(){return {}}
  normalizeUsage(usage={}){return {prompt_tokens:Number(usage.prompt_tokens||0),completion_tokens:Number(usage.completion_tokens||0),total_tokens:Number(usage.total_tokens||0)}}
}
