import test from 'node:test';
import assert from 'node:assert/strict';
import {ApiNexProvider,apiNexPricing,hasExplicitApiNexFreeEvidence} from '../../packages/providers/src/apinex.mjs';

const provider=new ApiNexProvider();

test('APINex admits only explicitly marked models with zero input and output prices',async()=>{
  assert.equal(await provider.verifyFree({id:'fixture:free',pricing:{input:0,output:0}}),true);
  assert.equal(await provider.verifyFree({id:'fixture-free',pricing:{prompt:'0',completion:'0'}}),true);
  assert.equal(await provider.verifyFree({id:'fixture',is_free:true,pricing:{input_usd_per_1m:0,output_usd_per_1m:0}}),true);
  assert.equal(await provider.verifyFree({id:'fixture',pricing:{input:0,output:0}}),false);
  assert.equal(await provider.verifyFree({id:'fixture:free',pricing:{input:0,output:0.07}}),false);
  assert.equal(await provider.verifyFree({id:'fixture:free'}),false);
});

test('APINex pricing and free evidence remain fail-closed for unknown catalog shapes',()=>{
  assert.deepEqual(apiNexPricing({pricing:{input_per_million:'0',output_per_million:'0'}}),{input:'0',output:'0'});
  assert.deepEqual(apiNexPricing({pricing:{unknown:0}}),{input:undefined,output:undefined});
  assert.equal(hasExplicitApiNexFreeEvidence({id:'not-freeish'}),false);
  assert.equal(hasExplicitApiNexFreeEvidence({id:'model',tier:'free'}),true);
});

test('APINex freeEvidence extracts allowFree models and verifyFree admits them',async()=>{
  const mockCatalog=[
    {id:'free/deepseek-v4.1-flash',provider:'Free',allowFree:true},
    {id:'free/glm-5.3-flash',provider:'Free',allowFree:true},
    {id:'free/claude-opus-4.6',provider:'Free',allowFree:false},
    {id:'paid-model',provider:'Anthropic',allowFree:false}
  ];
  const custom=new ApiNexProvider({
    fetchImpl:async()=>new Response(JSON.stringify(mockCatalog),{status:200})
  });
  const evidence=await custom.freeEvidence();
  assert.equal(evidence.has('free/deepseek-v4.1-flash'),true);
  assert.equal(evidence.has('free/glm-5.3-flash'),true);
  assert.equal(evidence.has('free/claude-opus-4.6'),false);
  assert.equal(evidence.has('paid-model'),false);

  assert.equal(await custom.verifyFree({id:'free/deepseek-v4.1-flash'},evidence),true);
  assert.equal(await custom.verifyFree({id:'free/claude-opus-4.6'},evidence),false);
});
