import test from 'node:test';import assert from 'node:assert/strict';import {score,shouldPromote} from '../../packages/benchmark/src/index.mjs';
test('score metrics', async (t) => {
  await t.test('calculates max score for regular category', () => {
    assert.equal(score({ correctness: 1, instruction: 1, reliability: 1, latency: 1, tools: 1 }, 'code'), 100);
  });
  await t.test('calculates partial score correctly', () => {
    assert.equal(score({ correctness: 0, instruction: 1, reliability: 0.5, latency: 1, tools: 0 }, 'general'), 35);
  });
  await t.test('adjusts weights for tools category', () => {
    assert.equal(score({ correctness: 1, instruction: 1, reliability: 1, latency: 1, tools: 1 }, 'tools'), 100);
    assert.equal(score({ correctness: 0, instruction: 1, reliability: 1, latency: 1, tools: 1 }, 'tools'), 90);
    assert.equal(score({ correctness: 1, instruction: 1, reliability: 1, latency: 1, tools: 0 }, 'tools'), 55);
  });
  await t.test('handles missing or empty fields', () => {
    assert.equal(score({}, 'code'), 0);
    assert.equal(score({ correctness: 1 }, 'code'), 45);
  });
  await t.test('handles invalid or castable types safely', () => {
    assert.equal(score({ correctness: "1", instruction: "invalid", reliability: undefined, latency: null, tools: true }, 'code'), 55);
  });
});

test('anti-churn threshold',()=>{assert.equal(shouldPromote({score:80,reliability:.99},{score:85},7),false);assert.equal(shouldPromote({score:80,reliability:.99},{score:88},7),true)});
