import test from 'node:test';import assert from 'node:assert/strict';import {score,shouldPromote} from '../../packages/benchmark/src/index.mjs';
test('scores deterministic metrics',()=>assert(score({correctness:1,instruction:1,reliability:1,latency:1,tools:1},'code')>90));
test('shouldPromote comprehensive rules', () => {
  // Default threshold (7)
  assert.equal(shouldPromote({score: 80, reliability: 0.99}, {score: 85}), false);
  assert.equal(shouldPromote({score: 80, reliability: 0.99}, {score: 87}), true);

  // Custom threshold
  assert.equal(shouldPromote({score: 80, reliability: 0.99}, {score: 85}, 10), false);
  assert.equal(shouldPromote({score: 80, reliability: 0.99}, {score: 90}, 10), true);
  assert.equal(shouldPromote({score: 80, reliability: 0.99}, {score: 82}, 3), false);
  assert.equal(shouldPromote({score: 80, reliability: 0.99}, {score: 83}, 3), true);

  // Reliability override (< 0.7 promotes automatically)
  assert.equal(shouldPromote({score: 80, reliability: 0.69}, {score: 70}), true);
  assert.equal(shouldPromote({score: 80, reliability: 0.5}, {score: 10}), true);

  // Missing object handling
  assert.equal(shouldPromote(null, {score: 10}), true);
  assert.equal(shouldPromote({score: 80, reliability: 0.99}, null), false);
  assert.equal(shouldPromote(undefined, undefined), true);
});
