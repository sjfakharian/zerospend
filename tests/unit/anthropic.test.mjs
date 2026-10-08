import test from 'node:test';
import assert from 'node:assert/strict';
import {anthropicToOpenAIPayload,openAIToAnthropicResponse,formatAnthropicEvent} from '../../packages/router/src/anthropic.mjs';

test('converts simple anthropic messages payload to openai format', ()=>{
  const anthropicBody = {
    model: 'smart-free',
    system: 'You are an AI assistant.',
    messages: [
      { role: 'user', content: 'What is 2+2?' }
    ],
    max_tokens: 100,
    temperature: 0.5,
    stream: true
  };
  const openAi = anthropicToOpenAIPayload(anthropicBody);
  assert.equal(openAi.model, 'smart-free');
  assert.equal(openAi.stream, true);
  assert.equal(openAi.messages.length, 2);
  assert.deepEqual(openAi.messages[0], { role: 'system', content: 'You are an AI assistant.' });
  assert.deepEqual(openAi.messages[1], { role: 'user', content: 'What is 2+2?' });
});

test('converts content block arrays correctly', ()=>{
  const anthropicBody = {
    system: [{ type: 'text', text: 'System prompt' }],
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Hello' },
          { type: 'text', text: 'World' }
        ]
      }
    ]
  };
  const openAi = anthropicToOpenAIPayload(anthropicBody);
  assert.equal(openAi.messages[0].content, 'System prompt');
  assert.equal(openAi.messages[1].content, 'Hello\nWorld');
});

test('converts openai response to anthropic response', ()=>{
  const openAiRes = {
    choices: [{ message: { content: '4' }, finish_reason: 'stop' }],
    usage: { prompt_tokens: 15, completion_tokens: 2 }
  };
  const anthropic = openAIToAnthropicResponse(openAiRes, 'provider/model', '1234');
  assert.equal(anthropic.type, 'message');
  assert.equal(anthropic.role, 'assistant');
  assert.equal(anthropic.content[0].text, '4');
  assert.equal(anthropic.stop_reason, 'end_turn');
  assert.equal(anthropic.usage.input_tokens, 15);
  assert.equal(anthropic.usage.output_tokens, 2);
});

test('formats anthropic SSE events', ()=>{
  const sse = formatAnthropicEvent('content_block_delta', { type: 'content_block_delta', delta: { text: 'hi' } });
  assert.ok(sse.startsWith('event: content_block_delta\ndata: {'));
  assert.ok(sse.endsWith('\n\n'));
});

test('supports claude model names and retains them in response', ()=>{
  const anthropicBody = {
    model: 'claude-3-5-sonnet',
    messages: [{ role: 'user', content: 'Hello' }]
  };
  const openAi = anthropicToOpenAIPayload(anthropicBody);
  assert.equal(openAi.model, 'claude-3-5-sonnet');

  const openAiRes = {
    choices: [{ message: { content: 'Hi there!' }, finish_reason: 'stop' }],
    usage: { prompt_tokens: 10, completion_tokens: 3 }
  };
  const anthropicRes = openAIToAnthropicResponse(openAiRes, 'claude-3-5-sonnet', 'test-uuid');
  assert.equal(anthropicRes.model, 'claude-3-5-sonnet');
  assert.equal(anthropicRes.content[0].text, 'Hi there!');
});
