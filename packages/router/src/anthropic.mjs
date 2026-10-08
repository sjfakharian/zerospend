import {randomUUID} from 'node:crypto';

export function anthropicToOpenAIPayload(body={}){
  const messages=[];
  if(body.system){
    const sysText=typeof body.system==='string'?body.system:Array.isArray(body.system)?body.system.map(b=>b.text||'').join('\n'):String(body.system||'');
    if(sysText.trim())messages.push({role:'system',content:sysText});
  }
  if(Array.isArray(body.messages)){
    for(const m of body.messages){
      let text='';
      if(typeof m.content==='string'){
        text=m.content;
      }else if(Array.isArray(m.content)){
        text=m.content.map(b=>{
          if(typeof b==='string')return b;
          if(b.type==='text')return b.text||'';
          if(b.type==='tool_result')return typeof b.content==='string'?b.content:JSON.stringify(b.content||'');
          return '';
        }).filter(Boolean).join('\n');
      }else{
        text=String(m.content||'');
      }
      messages.push({role:m.role||'user',content:text});
    }
  }
  return {
    model:body.model||'smart-free',
    messages,
    max_tokens:body.max_tokens,
    temperature:body.temperature,
    stream:body.stream===true
  };
}

export function openAIToAnthropicResponse(openAiObj={},route='zerospend-route',msgId=randomUUID()){
  const choice=openAiObj.choices?.[0]||{};
  const contentText=choice.message?.content||'';
  return {
    id:`msg_${msgId}`,
    type:'message',
    role:'assistant',
    content:[{type:'text',text:contentText}],
    model:route,
    stop_reason:choice.finish_reason==='length'?'max_tokens':'end_turn',
    stop_sequence:null,
    usage:{
      input_tokens:openAiObj.usage?.prompt_tokens||0,
      output_tokens:openAiObj.usage?.completion_tokens||0
    }
  };
}

export function formatAnthropicEvent(event,data){
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}
