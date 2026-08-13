import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import {mkdtemp,mkdir,writeFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {DatabaseSync} from 'node:sqlite';

const listen=server=>new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const close=server=>new Promise(resolve=>server.close(resolve));
const freePort=async()=>{const server=http.createServer();await listen(server);const port=server.address().port;await close(server);return port};
const waitForHealth=async(port,child)=>{for(let i=0;i<80;i++){if(child.exitCode!==null)throw Error(`process exited ${child.exitCode}`);try{const response=await fetch(`http://127.0.0.1:${port}/health`);if(response.ok)return}catch{}await new Promise(resolve=>setTimeout(resolve,50))}throw Error('health timeout')};
const stop=child=>{if(child.exitCode===null)child.kill()};

test('exhausted verified-free capacity is recorded and included in Console metrics',async()=>{
  let firstAttempts=0,secondAttempts=0;
  const first=http.createServer(async(req,res)=>{for await(const chunk of req)void chunk;firstAttempts++;if(firstAttempts===1)return res.end(JSON.stringify({choices:[{message:{content:'synthetic success'}}],usage:{prompt_tokens:2,completion_tokens:1,total_tokens:3}}));res.writeHead(429,{'retry-after':'1'});res.end(JSON.stringify({error:{type:'synthetic_rate_limit'}}))});
  const second=http.createServer(async(req,res)=>{for await(const chunk of req)void chunk;secondAttempts++;if(secondAttempts===1)return res.end(JSON.stringify({choices:[{message:{content:'synthetic fallback'}}],usage:{prompt_tokens:2,completion_tokens:1,total_tokens:3}}));res.writeHead(429,{'retry-after':'1'});res.end(JSON.stringify({error:{type:'synthetic_rate_limit'}}))});
  await Promise.all([listen(first),listen(second)]);
  const home=await mkdtemp(path.join(os.tmpdir(),'zs-exhausted-observability-'));
  for(const dir of ['config','secrets','data','state'])await mkdir(path.join(home,dir),{recursive:true});
  await writeFile(path.join(home,'secrets','local.token'),'synthetic-local-token');
  const routes=['fixture/first-free','fixture/second-free'],aliases=Object.fromEntries(['code','sql','reasoning','general','tools','fast','long-context','structured'].map(name=>[`free-${name}`,routes]));
  await writeFile(path.join(home,'config','routing.json'),JSON.stringify({zero_cost_policy:'strict',host:'127.0.0.1',aliases}));
  await writeFile(path.join(home,'state','verified-routes.json'),JSON.stringify({routes:{[routes[0]]:{route:routes[0],model_id:routes[0],provider:'fixture-first',backend:'direct',base_url:`http://127.0.0.1:${first.address().port}`,zero_cost:true,available:true,production_eligible:true},[routes[1]]:{route:routes[1],model_id:routes[1],provider:'fixture-second',backend:'direct',base_url:`http://127.0.0.1:${second.address().port}`,zero_cost:true,available:true,production_eligible:true}}}));
  const routerPort=await freePort(),consolePort=await freePort(),env={...process.env,ZEROSPEND_HOME:home},router=spawn(process.execPath,['packages/router/src/server.mjs'],{env:{...env,ZEROSPEND_ROUTER_PORT:String(routerPort)},stdio:'ignore'});let consoleProcess;
  try{
    await waitForHealth(routerPort,router);
    consoleProcess=spawn(process.execPath,['apps/console/server.mjs'],{env:{...env,ZEROSPEND_CONSOLE_PORT:String(consolePort)},stdio:'ignore'});
    await waitForHealth(consolePort,consoleProcess);
    const headers={authorization:'Bearer synthetic-local-token','content-type':'application/json','x-zerospend-client':'synthetic-observability'};
    const send=()=>fetch(`http://127.0.0.1:${routerPort}/v1/chat/completions`,{method:'POST',headers,body:JSON.stringify({messages:[{role:'user',content:'synthetic fixture'}],stream:false})});
    assert.equal((await send()).status,200);
    assert.equal((await send()).status,200);
    const exhausted=await send();
    assert.equal(exhausted.status,503);
    assert.equal((await exhausted.json()).error.type,'FREE_CAPACITY_UNAVAILABLE');
    await new Promise(resolve=>setTimeout(resolve,50));
    const database=new DatabaseSync(path.join(home,'data','observability.db'),{readOnly:true});
    try{
      const events=database.prepare('SELECT * FROM events ORDER BY id').all();
      assert.equal(events.length,3,'the exhausted request must be observable');
      const failed=events.at(-1);
      assert.equal(failed.status,503);
      assert.equal(failed.success,0);
      assert.equal(failed.error_class,'temporary_free_capacity_unavailable');
      assert.equal(failed.rate_limited,1);
      assert.equal(failed.fallback_depth,2);
      assert.equal(failed.attempts,2);
      assert.equal(failed.zero_cost_verified,1);
      assert.equal(failed.backend,null);
      assert.equal(failed.provider,null);
      assert.equal(failed.model,null);
    }finally{database.close()}
    const overview=await fetch(`http://127.0.0.1:${consolePort}/api/overview`).then(response=>response.json());
    assert.equal(overview.summary.requests,3);
    assert.equal(overview.summary.success_rate,2/3);
    assert.equal(overview.summary.fallback_rate,2/3);
    assert.equal(overview.summary.rate_limit_rate,1/3);
    assert.equal((await fetch(`http://127.0.0.1:${routerPort}/health`)).status,200);
  }finally{
    stop(router);if(consoleProcess)stop(consoleProcess);
    await Promise.all([close(first),close(second)]);
  }
});
