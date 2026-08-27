import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('release version metadata stays synchronized',async()=>{
  const version=(await readFile('VERSION','utf8')).trim();
  const packageJson=JSON.parse(await readFile('package.json','utf8'));
  const packageLock=JSON.parse(await readFile('package-lock.json','utf8'));
  const project=await readFile('PROJECT.yaml','utf8');
  assert.equal(packageJson.version,version);
  assert.equal(packageLock.version,version);
  assert.equal(packageLock.packages[''].version,version);
  assert.match(project,new RegExp(`^version: ${version.replaceAll('.','\\.')}\\s*$`,'m'));
});
