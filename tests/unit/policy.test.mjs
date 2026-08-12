import test from 'node:test';import assert from 'node:assert/strict';import {isVerifiedFree,validateConfig,orderRoutes} from '../../packages/router/src/policy.mjs';
const inv={routes:{'p/free':{zero_cost:true,available:true},'p/unknown':{available:true},'p/paid':{zero_cost:false,available:true}}};
test('unknown cost is rejected',()=>assert.equal(isVerifiedFree('p/unknown',inv),false));
test('paid route is rejected',()=>assert.throws(()=>validateConfig({zero_cost_policy:'strict',aliases:{'free-general':['p/paid']}},inv)));
test('valid config passes',()=>assert.equal(validateConfig({zero_cost_policy:'strict',aliases:{'free-general':['p/free']}},inv),true));
test('orders for reliability',()=>assert.deepEqual(orderRoutes(['a','b'],{a:{success_rate:.7},b:{success_rate:.99}}),['b','a']));
