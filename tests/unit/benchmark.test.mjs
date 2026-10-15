import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {score,shouldPromote,getGlobalBenchmark,syncGlobalBenchmarks} from '../../packages/benchmark/src/index.mjs';

test('scores deterministic metrics',()=>assert(score({correctness:1,instruction:1,reliability:1,latency:1,tools:1},'code')>90));
test('anti-churn threshold',()=>{assert.equal(shouldPromote({score:80,reliability:.99},{score:85},7),false);assert.equal(shouldPromote({score:80,reliability:.99},{score:88},7),true)});

test('retrieves global benchmark metadata with fuzzy match',()=>{
  const r1 = getGlobalBenchmark('deepseek/deepseek-r1');
  assert(r1.arena_elo >= 1350);
  assert.equal(r1.tier, 'Reasoning Champion');
  const nemotron = getGlobalBenchmark('nvidia/nemotron-3-super-120b');
  assert(nemotron.intelligence_index >= 85);
});

test('scores with global intelligence weight',()=>{
  const sWithout = score({correctness:1,instruction:1,reliability:1,latency:1,tools:1},'code');
  const r1Meta = getGlobalBenchmark('deepseek-r1');
  const sWith = score({correctness:1,instruction:1,reliability:1,latency:1,tools:1,global:r1Meta},'code');
  assert(sWith > 90);
  assert(sWithout > 90);
});

test('syncGlobalBenchmarks writes state file with fallback',async()=>{
  const h = await mkdtemp(path.join(os.tmpdir(),'zs-global-bench-'));
  const p = {state: path.join(h,'state')};
  await mkdir(p.state, {recursive:true});
  const res = await syncGlobalBenchmarks({paths:p});
  assert(res.catalog_count >= 10);
  assert(res.sources.includes('LMSYS Chatbot Arena'));
});
