import {OpenAICompatibleProvider} from './openai-compatible.mjs';
export class NvidiaProvider extends OpenAICompatibleProvider{
  constructor(options={}){super({baseUrl:'https://integrate.api.nvidia.com/v1',catalogUrl:'https://build.nvidia.com/explore/discover',...options})}
  async freeEvidence(){
    const r=await fetch(this.options.catalogUrl,{signal:AbortSignal.timeout(30000)});
    if(!r.ok)throw Error(`free evidence ${r.status}`);
    const text=await r.text(),ids=new Set();
    const clean=id=>id&&!id.startsWith('assets/')&&!id.startsWith('search')&&!id.startsWith('explore');
    for(const m of text.matchAll(/Free Endpoint[\s\S]{0,2500}?href(?:=|\\":\\")"?\/([a-z0-9._-]+\/[a-z0-9._-]+)/gi)){
      if(clean(m[1]))ids.add(m[1]);
    }
    const templateIds=new Set();
    for(const m of text.matchAll(/Free Endpoint<\/span><\/div><script>\$RC\("([^"]+)"/g))templateIds.add(m[1]);
    for(const tid of templateIds){
      const mAfter=text.match(new RegExp(`<template id="${tid}"><\\/template>[\\s\\S]{0,1500}?href="\\/([a-z0-9._-]+\\/[a-z0-9._-]+)"`));
      if(mAfter&&clean(mAfter[1]))ids.add(mAfter[1]);
      const mBefore=text.match(new RegExp(`href="\\/([a-z0-9._-]+\\/[a-z0-9._-]+)"[\\s\\S]{0,1500}?<template id="${tid}"><\\/template>`));
      if(mBefore&&clean(mBefore[1]))ids.add(mBefore[1]);
    }
    return ids;
  }
  async verifyFree(model,evidence){return evidence?.label==='Free Endpoint'&&evidence?.current===true&&Boolean(model?.id)}
}
