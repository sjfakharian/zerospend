export const aliases=["free-code","free-sql","free-reasoning","free-general","free-tools","free-fast","free-long-context","free-structured"];
export function textOf(messages=[]){return messages.filter(m=>m?.role==="user").map(m=>typeof m.content==="string"?m.content:Array.isArray(m.content)?m.content.map(p=>p.text||"").join("\n"):"").join("\n")}
export function classify(body={}){
  const text=textOf(body.messages), compact=text.toLowerCase().replace(/\s+/g," "), tools=Array.isArray(body.tools)&&body.tools.length>0;
  if(body.functions||(body.tool_choice&&!['auto','none'].includes(String(body.tool_choice).toLowerCase()))||tools)return {alias:"free-tools",reason:"tool-definition-or-choice"};
  if(body.response_format||body.json_schema||/json schema|return (?:only )?json|structured output/i.test(text))return {alias:"free-structured",reason:"structured-output"};
  if(text.length>=60000)return {alias:"free-long-context",reason:"large-input"};
  if(/\b(select|join|group by|schema|database|clickhouse|mysql|postgresql|query)\b/i.test(text))return {alias:"free-sql",reason:"sql-indicator"};
  if(/```|stack trace|traceback|exception|debug|function|class|implementation|typescript|javascript|python|rust|golang/i.test(text))return {alias:"free-code",reason:"code-indicator"};
  if(/step[- ]by[- ]step|multi[- ]step|reason|analy[sz]e|trade-?off|prove|derive|plan|strategy|root cause/i.test(text))return {alias:"free-reasoning",reason:"reasoning-indicator"};
  if(compact.length>0&&compact.length<=240&&(body.messages?.length||0)<=3)return {alias:"free-fast",reason:"short-request"};
  return {alias:"free-general",reason:"uncertain-fallback"};
}
