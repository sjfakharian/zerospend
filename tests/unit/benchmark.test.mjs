import test from 'node:test';import assert from 'node:assert/strict';import {score,shouldPromote} from '../../packages/benchmark/src/index.mjs';
test('scores deterministic metrics',()=>assert(score({correctness:1,instruction:1,reliability:1,latency:1,tools:1},'code')>90));
test('anti-churn threshold',()=>{assert.equal(shouldPromote({score:80,reliability:.99},{score:85},7),false);assert.equal(shouldPromote({score:80,reliability:.99},{score:88},7),true)});
