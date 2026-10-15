import test, { describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { home, paths } from '../../packages/shared/src/paths.mjs';

describe('paths.mjs', () => {
  const originalEnv = process.env.ZEROSPEND_HOME;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.ZEROSPEND_HOME;
    } else {
      process.env.ZEROSPEND_HOME = originalEnv;
    }
  });

  test('home() defaults to ~/.zerospend when ZEROSPEND_HOME is not set', () => {
    delete process.env.ZEROSPEND_HOME;
    const expected = path.resolve(os.homedir(), '.zerospend');
    assert.equal(home(), expected);
  });

  test('home() respects ZEROSPEND_HOME with absolute path', () => {
    const customPath = '/custom/absolute/path';
    process.env.ZEROSPEND_HOME = customPath;
    const expected = path.resolve(customPath);
    assert.equal(home(), expected);
  });

  test('home() resolves ~ prefix in ZEROSPEND_HOME', () => {
    const customPath = '~/custom/path';
    process.env.ZEROSPEND_HOME = customPath;
    const expected = path.resolve(os.homedir(), 'custom/path');
    assert.equal(home(), expected);
  });

  test('paths() returns correctly constructed path object', () => {
    delete process.env.ZEROSPEND_HOME;
    const baseHome = path.resolve(os.homedir(), '.zerospend');
    const p = paths();

    assert.equal(p.home, baseHome);
    assert.equal(p.config, path.join(baseHome, 'config'));
    assert.equal(p.secrets, path.join(baseHome, 'secrets'));
    assert.equal(p.data, path.join(baseHome, 'data'));
    assert.equal(p.logs, path.join(baseHome, 'logs'));
    assert.equal(p.state, path.join(baseHome, 'state'));
    assert.equal(p.backups, path.join(baseHome, 'backups'));
    assert.equal(p.runtime, path.join(baseHome, 'runtime'));
  });
});
