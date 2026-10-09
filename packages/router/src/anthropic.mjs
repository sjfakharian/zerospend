import {randomUUID} from 'node:crypto';

export function anthropicToOpenAIPayload(body={}){
  const messages=[];
  if(body.system){
    const sysText=typeof body.system==='string'?body.system:Array.isArray(body.system)?body.system.map(b=>b.text||'').join('\n'):String(body.system||'');
    if(sysText.trim())messages.push({role:'system',content:sysText});
  }
  if(Array.isArray(body.messages)){
    for(const m of body.messages){
      const role=m.role||'user';
      if(typeof m.content==='string'){
        if(role==='assistant'&&(m.content.includes('DSML')||m.content.includes('<tool_call>'))){
          const parsed=extractTextToolCalls(m.content);
          const msgObj={role:'assistant',content:parsed.cleanContent||null};
          if(parsed.toolCalls.length>0)msgObj.tool_calls=parsed.toolCalls;
          messages.push(msgObj);
        }else if(role==='user'&&(m.content.includes('DSML')||m.content.includes('<tool_call>'))){
          messages.push({role:'user',content:m.content.replace(/<[|｜]DSML[|｜]>/gi,'[tool]')});
        }else{
          messages.push({role,content:m.content});
        }
      }else if(Array.isArray(m.content)){
        if(role==='assistant'){
          const textBlocks=[];
          const toolCalls=[];
          for(const b of m.content){
            if(typeof b==='string')textBlocks.push(b);
            else if(b.type==='text'&&b.text)textBlocks.push(b.text);
            else if(b.type==='tool_use'){
              toolCalls.push({
                id:b.id||`call_${randomUUID().replace(/-/g,'').slice(0,8)}`,
                type:'function',
                function:{
                  name:b.name,
                  arguments:typeof b.input==='string'?b.input:JSON.stringify(b.input||{})
                }
              });
            }
          }
          let combinedText=textBlocks.join('\n');
          if(combinedText.includes('DSML')||combinedText.includes('<tool_call>')){
            const parsed=extractTextToolCalls(combinedText);
            if(parsed.toolCalls.length>0){
              toolCalls.push(...parsed.toolCalls);
              combinedText=parsed.cleanContent;
            }
          }
          const msgObj={role:'assistant',content:combinedText||null};
          if(toolCalls.length>0)msgObj.tool_calls=toolCalls;
          messages.push(msgObj);
        }else{
          const textBlocks=[];
          const toolResults=[];
          for(const b of m.content){
            if(typeof b==='string')textBlocks.push(b);
            else if(b.type==='text'&&b.text)textBlocks.push(b.text);
            else if(b.type==='tool_result'){
              toolResults.push({
                role:'tool',
                tool_call_id:b.tool_use_id,
                content:typeof b.content==='string'?b.content:Array.isArray(b.content)?b.content.map(c=>c.text||JSON.stringify(c)).join('\n'):JSON.stringify(b.content||'')
              });
            }
          }
          for(const tr of toolResults)messages.push(tr);
          if(textBlocks.length>0){
            let userText=textBlocks.join('\n');
            if(userText.includes('DSML'))userText=userText.replace(/<[|｜]DSML[|｜]>/gi,'[tool]');
            messages.push({role:'user',content:userText});
          }
        }
      }else{
        messages.push({role,content:String(m.content||'')});
      }
    }
  }
  let tools=undefined;
  if(Array.isArray(body.tools)&&body.tools.length>0){
    tools=body.tools.map(t=>({
      type:'function',
      function:{
        name:t.name,
        description:t.description||'',
        parameters:t.input_schema||{type:'object',properties:{}}
      }
    }));
  }
  let tool_choice=undefined;
  if(body.tool_choice){
    if(body.tool_choice.type==='auto')tool_choice='auto';
    else if(body.tool_choice.type==='any')tool_choice='required';
    else if(body.tool_choice.type==='tool'&&body.tool_choice.name)tool_choice={type:'function',function:{name:body.tool_choice.name}};
  }
  return {
    model:body.model||'smart-free',
    messages,
    tools,
    tool_choice,
    max_tokens:body.max_tokens,
    temperature:body.temperature,
    stream:body.stream===true
  };
}

export function extractTextToolCalls(text=''){
  if(!text.includes('<'))return {toolCalls:[],cleanContent:text};
  const toolCalls=[];
  let clean=text;
  const dsmlRegex=/<[|｜]DSML[|｜]>?\s*invoke(?:\s+name="([^"]+)"|:([a-zA-Z0-9_.-]+))[\s\S]*?(?:<\/[|｜]DSML[|｜]>?\s*invoke>?|<[|｜]call end[|｜]>|$)/gi;
  let match;
  while((match=dsmlRegex.exec(clean))!==null){
    const fullBlock=match[0];
    const name=match[1]||match[2];
    const args={};
    const paramRegex=/<[|｜]DSML[|｜]>?\s*parameter(?:\s+name="([^"]+)"|\s+([^>]+))[^>]*>([\s\S]*?)(?:<\/[|｜]DSML[|｜]>?\s*parameter>?|<\/[|｜]DSML[|｜]>?|$)/gi;
    let pMatch;
    let hasParams=false;
    while((pMatch=paramRegex.exec(fullBlock))!==null){
      hasParams=true;
      args[pMatch[1]]=pMatch[3].trim();
    }
    if(!hasParams){
      const jsonMatch=fullBlock.match(/\{[\s\S]*\}/);
      if(jsonMatch){
        try{Object.assign(args,JSON.parse(jsonMatch[0]))}catch{}
      }
    }
    toolCalls.push({
      id:`toolu_${randomUUID().replace(/-/g,'').slice(0,16)}`,
      type:'function',
      function:{name,arguments:JSON.stringify(args)}
    });
    clean=clean.replace(fullBlock,'').trim();
  }
  const dsToolRegex=/<[|｜]tool call begin[|｜]>(?:function)?<[|｜]tool sep[|｜]>([a-zA-Z0-9_.-]+)\s*```(?:json)?\s*([\s\S]*?)\s*```\s*<[|｜]tool call end[|｜]>/gi;
  while((match=dsToolRegex.exec(clean))!==null){
    toolCalls.push({
      id:`toolu_${randomUUID().replace(/-/g,'').slice(0,16)}`,
      type:'function',
      function:{name:match[1],arguments:match[2].trim()}
    });
    clean=clean.replace(match[0],'').trim();
  }
  const xmlToolRegex=/<tool_call>\s*([\s\S]*?)\s*<\/tool_call>/gi;
  while((match=xmlToolRegex.exec(clean))!==null){
    try{
      const obj=JSON.parse(match[1]);
      if(obj.name){
        toolCalls.push({
          id:`toolu_${randomUUID().replace(/-/g,'').slice(0,16)}`,
          type:'function',
          function:{
            name:obj.name,
            arguments:typeof obj.arguments==='string'?obj.arguments:JSON.stringify(obj.arguments||{})
          }
        });
        clean=clean.replace(match[0],'').trim();
      }
    }catch{}
  }
  return {toolCalls,cleanContent:clean};
}

export function openAIToAnthropicResponse(openAiObj={},route='zerospend-route',msgId=randomUUID()){
  const choice=openAiObj.choices?.[0]||{};
  const message=choice.message||{};
  const content=[];
  let rawContent=typeof message.content==='string'?message.content:'';
  const toolCalls=Array.isArray(message.tool_calls)?[...message.tool_calls]:[];
  if(toolCalls.length===0&&rawContent){
    const parsed=extractTextToolCalls(rawContent);
    if(parsed.toolCalls.length>0){
      toolCalls.push(...parsed.toolCalls);
      rawContent=parsed.cleanContent;
    }
  }
  if(rawContent.trim()){
    content.push({type:'text',text:rawContent});
  }
  for(const tc of toolCalls){
    let input={};
    try{
      input=typeof tc.function?.arguments==='string'?JSON.parse(tc.function.arguments):(tc.function?.arguments||{});
    }catch{
      input={raw:tc.function?.arguments||''};
    }
    content.push({
      type:'tool_use',
      id:tc.id||`toolu_${randomUUID().replace(/-/g,'').slice(0,16)}`,
      name:tc.function?.name||'tool',
      input
    });
  }
  if(content.length===0){
    content.push({type:'text',text:''});
  }
  const isTool=toolCalls.length>0;
  let stop_reason='end_turn';
  if(isTool||choice.finish_reason==='tool_calls'){
    stop_reason='tool_use';
  }else if(choice.finish_reason==='length'){
    stop_reason='max_tokens';
  }
  return {
    id:`msg_${msgId}`,
    type:'message',
    role:'assistant',
    content,
    model:route,
    stop_reason,
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
