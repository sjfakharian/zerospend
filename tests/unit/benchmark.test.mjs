import test from 'node:test';
import assert from 'node:assert/strict';
import {score, shouldPromote} from '../../packages/benchmark/src/index.mjs';

test('scores deterministic metrics', () => {
  assert(score({correctness: 1, instruction: 1, reliability: 1, latency: 1, tools: 1}, 'code') > 90);
});

test('score: perfect metrics equal 100 for standard category', () => {
  assert.equal(score({correctness: 1, instruction: 1, reliability: 1, latency: 1, tools: 1}, 'code'), 100);
});

test('score: perfect metrics equal 100 for tools category (different weights)', () => {
  assert.equal(score({correctness: 1, instruction: 1, reliability: 1, latency: 1, tools: 1}, 'tools'), 100);
});

test('score: correctly applies tools category specific weights', () => {
  // tools category: correctness=10, instruction=15, reliability=20, latency=10, tools=45
  assert.equal(score({correctness: 1}, 'tools'), 10);
  assert.equal(score({tools: 1}, 'tools'), 45);
  assert.equal(score({correctness: 1, tools: 1}, 'tools'), 55);
});

test('score: correctly applies standard category weights', () => {
  // standard category: correctness=45, instruction=15, reliability=20, latency=10, tools=10
  assert.equal(score({correctness: 1}, 'code'), 45);
  assert.equal(score({tools: 1}, 'code'), 10);
});

test('score: handles missing keys falling back to 0 safely', () => {
  assert.equal(score({}, 'code'), 0);
  assert.equal(score({correctness: 0.5}, 'code'), 22.5); // 45 * 0.5 = 22.5
});

test('score: handles stringified numbers falling back to 0 if invalid safely', () => {
  assert.equal(score({correctness: '1', instruction: '0.5'}, 'code'), 52.5); // 45*1 + 15*0.5
  assert.equal(score({correctness: 'invalid'}, 'code'), 0);
});

test('anti-churn threshold', () => {
  assert.equal(shouldPromote({score: 80, reliability: 0.99}, {score: 85}, 7), false);
  assert.equal(shouldPromote({score: 80, reliability: 0.99}, {score: 88}, 7), true);
});
