import test from 'node:test';import assert from 'node:assert/strict';import {isVerifiedFree,validateConfig,capacityHealth,orderRoutes} from '../../packages/router/src/policy.mjs';
const inv={routes:{'p/free':{zero_cost:true,available:true},'p/unknown':{available:true},'p/paid':{zero_cost:false,available:true}}};
test('unknown cost is rejected',()=>assert.equal(isVerifiedFree('p/unknown',inv),false));
test('paid route is rejected',()=>assert.throws(()=>validateConfig({zero_cost_policy:'strict',aliases:{'free-general':['p/paid']}},inv)));
test('valid config passes',()=>assert.equal(validateConfig({zero_cost_policy:'strict',aliases:{'free-general':['p/free']}},inv),true));
test('empty alias is valid but capacity is degraded',()=>{const config={zero_cost_policy:'strict',aliases:{'free-code':[],'free-sql':['p/free']}};assert.equal(validateConfig(config,inv),true);assert.deepEqual(capacityHealth(config,inv),{status:'degraded',strict_free:true,paid_routes:0,unverified_routes:0,empty_aliases:['free-code']})});
test('alias value must remain an array',()=>assert.throws(()=>validateConfig({zero_cost_policy:'strict',aliases:{'free-code':null}},inv),/invalid alias/));
test('orders for reliability',()=>assert.deepEqual(orderRoutes(['a','b'],{a:{success_rate:.7},b:{success_rate:.99}}),['b','a']));
