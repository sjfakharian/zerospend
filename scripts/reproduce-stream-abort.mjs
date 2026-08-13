import assert from 'node:assert/strict';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import {mkdtemp,mkdir,writeFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';

const listen=server=>new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const close=server=>new Promise(resolve=>server.close(resolve));
const availablePort=async()=>{const server=http.createServer();await listen(server);const port=server.address().port;await close(server);return port};
const upstream=http.createServer(async(req,res)=>{for await(const chunk of req)void chunk;res.writeHead(200,{'content-type':'text/event-stream'});res.flushHeaders();res.write('data: {"choices":[{"delta":{"content":"synthetic"}}]}\n\n');setTimeout(()=>res.socket.destroy(Error('synthetic upstream abort')),150)});
await listen(upstream);
const home=await mkdtemp(path.join(os.tmpdir(),'zerospend-stream-repro-')),aliases=Object.fromEntries(['code','sql','reasoning','general','tools','fast','long-context','structured'].map(name=>[`free-${name}`,['fixture/free']]));
for(const dir of ['config','secrets','data','state'])await mkdir(path.join(home,dir),{recursive:true});
await writeFile(path.join(home,'secrets','local.token'),'synthetic-local-token');
await writeFile(path.join(home,'config','routing.json'),JSON.stringify({zero_cost_policy:'strict',host:'127.0.0.1',aliases}));
await writeFile(path.join(home,'state','verified-routes.json'),JSON.stringify({routes:{'fixture/free':{route:'fixture/free',model_id:'fixture/free',provider:'fixture',backend:'direct',base_url:`http://127.0.0.1:${upstream.address().port}`,zero_cost:true,available:true,production_eligible:true}}}));
const port=await availablePort(),router=spawn(process.execPath,['packages/router/src/server.mjs'],{env:{...process.env,ZEROSPEND_HOME:home,ZEROSPEND_ROUTER_PORT:String(port)},stdio:['ignore','ignore','pipe']});let stderr='';router.stderr.on('data',chunk=>stderr+=chunk);
try{for(let i=0;i<80;i++){if(router.exitCode!==null)throw Error(stderr||`router exited ${router.exitCode}`);try{if((await fetch(`http://127.0.0.1:${port}/health`)).ok)break}catch{}await new Promise(resolve=>setTimeout(resolve,50))}const result=await new Promise((resolve,reject)=>{const request=http.request({host:'127.0.0.1',port,path:'/v1/chat/completions',method:'POST',headers:{authorization:'Bearer synthetic-local-token','content-type':'application/json'}},response=>{let body='';response.on('data',chunk=>body+=chunk);response.on('aborted',()=>resolve({status:response.statusCode,body}));response.on('end',()=>resolve({status:response.statusCode,body}));response.on('error',()=>resolve({status:response.statusCode,body}))});request.on('error',reject);request.end(JSON.stringify({messages:[{role:'user',content:'synthetic fixture'}],stream:true}))});assert.equal(result.status,200);assert.match(result.body,/synthetic/);await new Promise(resolve=>setTimeout(resolve,100));assert.equal(router.exitCode,null,stderr);assert.equal((await fetch(`http://127.0.0.1:${port}/health`)).status,200);console.log('stream_abort_reproduction=PASS router_survived=true health=200')}finally{if(router.exitCode===null)router.kill();await close(upstream)}
