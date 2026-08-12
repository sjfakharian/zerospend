import {readFile} from 'node:fs/promises';import path from 'node:path';import {paths} from '../../shared/src/paths.mjs';
export async function loadConfig(){const p=path.join(paths().config,'routing.json');return JSON.parse(await readFile(p,'utf8'))}
export function defaults(){return {schema_version:1,zero_cost_policy:'strict',uncertain_fallback:'free-general',host:'127.0.0.1',port:20129,console_port:20131,aliases:{'free-code':[],'free-sql':[],'free-reasoning':[],'free-general':[],'free-tools':[],'free-fast':[],'free-long-context':[],'free-structured':[]}}}
