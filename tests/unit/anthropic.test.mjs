import test from 'node:test';
import assert from 'node:assert/strict';
import {anthropicToOpenAIPayload,openAIToAnthropicResponse,formatAnthropicEvent,extractTextToolCalls} from '../../packages/router/src/anthropic.mjs';

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

test('converts tools and multi-turn tool history correctly', ()=>{
  const anthropicBody = {
    model: 'smart-claude-free',
    tools: [
      {
        name: 'Bash',
        description: 'Run bash command',
        input_schema: {
          type: 'object',
          properties: { command: { type: 'string' } },
          required: ['command']
        }
      }
    ],
    tool_choice: { type: 'auto' },
    messages: [
      { role: 'user', content: 'List files in directory' },
      {
        role: 'assistant',
        content: [
          { type: 'text', text: 'Let me run ls.' },
          { type: 'tool_use', id: 'call_123', name: 'Bash', input: { command: 'ls -la' } }
        ]
      },
      {
        role: 'user',
        content: [
          { type: 'tool_result', tool_use_id: 'call_123', content: 'total 0\n-rw-r--r-- file.txt' }
        ]
      }
    ]
  };

  const openAi = anthropicToOpenAIPayload(anthropicBody);
  assert.equal(openAi.tools.length, 1);
  assert.equal(openAi.tools[0].type, 'function');
  assert.equal(openAi.tools[0].function.name, 'Bash');
  assert.deepEqual(openAi.tools[0].function.parameters, anthropicBody.tools[0].input_schema);
  assert.equal(openAi.tool_choice, 'auto');

  assert.equal(openAi.messages.length, 3);
  assert.equal(openAi.messages[0].role, 'user');
  assert.equal(openAi.messages[1].role, 'assistant');
  assert.equal(openAi.messages[1].tool_calls.length, 1);
  assert.equal(openAi.messages[1].tool_calls[0].id, 'call_123');
  assert.equal(openAi.messages[1].tool_calls[0].function.name, 'Bash');
  assert.equal(openAi.messages[2].role, 'tool');
  assert.equal(openAi.messages[2].tool_call_id, 'call_123');
  assert.equal(openAi.messages[2].content, 'total 0\n-rw-r--r-- file.txt');
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

test('converts openai response with tool_calls to anthropic response', ()=>{
  const openAiRes = {
    choices: [{
      message: {
        content: 'Running the command',
        tool_calls: [{
          id: 'call_999',
          type: 'function',
          function: { name: 'Bash', arguments: '{"command":"ls -la"}' }
        }]
      },
      finish_reason: 'tool_calls'
    }],
    usage: { prompt_tokens: 50, completion_tokens: 20 }
  };
  const anthropic = openAIToAnthropicResponse(openAiRes, 'provider/model', '1234');
  assert.equal(anthropic.stop_reason, 'tool_use');
  assert.equal(anthropic.content.length, 2);
  assert.equal(anthropic.content[0].type, 'text');
  assert.equal(anthropic.content[0].text, 'Running the command');
  assert.equal(anthropic.content[1].type, 'tool_use');
  assert.equal(anthropic.content[1].id, 'call_999');
  assert.equal(anthropic.content[1].name, 'Bash');
  assert.deepEqual(anthropic.content[1].input, { command: 'ls -la' });
});

test('extracts DSML and raw tool calls if model outputs text fallback', ()=>{
  const dsmlText = '<|DSML|> invoke:Bash\n{"command":"pwd"}\n<|call end|>';
  const parsed = extractTextToolCalls(dsmlText);
  assert.equal(parsed.toolCalls.length, 1);
  assert.equal(parsed.toolCalls[0].function.name, 'Bash');
  assert.deepEqual(JSON.parse(parsed.toolCalls[0].function.arguments), { command: 'pwd' });
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
