import test from 'node:test';
import assert from 'node:assert/strict';
import {TokenHarborProvider,tokenHarborPricing} from '../../packages/providers/src/tokenharbor.mjs';

const provider=new TokenHarborProvider();

test('TokenHarbor admits only explicit free IDs with zero catalog pricing',async()=>{
  assert.equal(await provider.verifyFree({id:'fixture:free',pricing:{input:0,output:0}}),true);
  assert.equal(await provider.verifyFree({id:'fixture:free',pricing:{prompt:'0',completion:'0'}}),true);
  assert.equal(await provider.verifyFree({id:'fixture',pricing:{input:0,output:0}}),false);
  assert.equal(await provider.verifyFree({id:'fixture:free',pricing:{input:0,output:0.1}}),false);
  assert.equal(await provider.verifyFree({id:'fixture:free'}),false);
});

test('TokenHarbor pricing normalization remains fail-closed for unknown schemas',()=>{
  assert.deepEqual(tokenHarborPricing({pricing:{input_per_million:'0',output_per_million:'0'}}),{input:'0',output:'0'});
  assert.deepEqual(tokenHarborPricing({pricing:{unknown:0}}),{input:undefined,output:undefined});
});
