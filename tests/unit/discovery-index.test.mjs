import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeRoute } from '../../packages/discovery/src/index.mjs';

test('normalizeRoute - happy path with all properties', () => {
  const input = {
    provider: 'test-provider',
    backend: 'test-backend',
    model: {
      id: 'test-model-id',
      name: 'Test Model Name',
      context_length: 8192,
      capabilities: {
        tools: true
      }
    },
    baseUrl: 'https://api.test-provider.com/v1',
    secretFile: 'test-secret.json',
    evidence: 'test evidence',
    available: {
      available: true,
      status: 200,
      latency_ms: 45
    }
  };

  const result = normalizeRoute(input);

  assert.equal(result.route, 'test-provider/test-model-id');
  assert.equal(result.model_id, 'test-model-id');
  assert.equal(result.display_name, 'Test Model Name');
  assert.equal(result.provider, 'test-provider');
  assert.equal(result.backend, 'test-backend');
  assert.equal(result.zero_cost, true);
  assert.equal(result.evidence, 'test evidence');
  assert.equal(result.available, true);
  assert.equal(result.availability_status, 200);
  assert.equal(result.latest_latency_ms, 45);
  assert.equal(result.production_eligible, true);
  assert.equal(result.base_url, 'https://api.test-provider.com/v1');
  assert.equal(result.secret_file, 'test-secret.json');
  assert.equal(result.context_window, 8192);
  assert.deepEqual(result.capabilities, { tools: true });

  // Verify timestamp exists and is ISO format
  assert.ok(result.evidence_at);
  assert.match(result.evidence_at, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
});

test('normalizeRoute - fallback behaviors', () => {
  const input = {
    provider: 'test-provider',
    backend: 'test-backend',
    model: {
      id: 'test-model-id'
      // missing name, context_length, capabilities
    },
    baseUrl: 'https://api.test-provider.com/v1',
    secretFile: 'test-secret.json',
    evidence: 'test evidence',
    available: {
      available: false,
      status: 500,
      latency_ms: 1500
    }
  };

  const result = normalizeRoute(input);

  assert.equal(result.display_name, 'test-model-id', 'Should fallback to model.id if name is missing');
  assert.equal(result.context_window, null, 'Should fallback to null if context_length is missing');
  assert.deepEqual(result.capabilities, {}, 'Should fallback to empty object if capabilities is missing');
  assert.equal(result.production_eligible, false);
});
