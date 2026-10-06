import test, { describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { home, paths } from '../../packages/shared/src/paths.mjs';

describe('paths resolution', () => {
  let originalZerospendHome;

  beforeEach(() => {
    // Store original and clear ZEROSPEND_HOME before each test to ensure clean state
    originalZerospendHome = process.env.ZEROSPEND_HOME;
    delete process.env.ZEROSPEND_HOME;
  });

  afterEach(() => {
    // Restore only ZEROSPEND_HOME to avoid breaking the process.env proxy
    if (originalZerospendHome !== undefined) {
      process.env.ZEROSPEND_HOME = originalZerospendHome;
    } else {
      delete process.env.ZEROSPEND_HOME;
    }
  });

  describe('home()', () => {
    test('defaults to ~/.zerospend when ZEROSPEND_HOME is not set', () => {
      const expected = path.resolve(path.join(os.homedir(), '.zerospend'));
      assert.equal(home(), expected);
    });

    test('respects ZEROSPEND_HOME environment variable when set to a custom path starting with ~', () => {
      process.env.ZEROSPEND_HOME = '~/custom_home';
      const expected = path.resolve(path.join(os.homedir(), 'custom_home'));
      assert.equal(home(), expected);
    });

    test('respects ZEROSPEND_HOME environment variable when set to an absolute path', () => {
      const absolutePath = process.platform === 'win32' ? 'C:\\custom\\absolute\\path' : '/custom/absolute/path';
      process.env.ZEROSPEND_HOME = absolutePath;
      assert.equal(home(), path.resolve(absolutePath));
    });
  });

  describe('paths()', () => {
    test('returns an object with all expected path properties', () => {
      const result = paths();
      const h = home();

      assert.deepEqual(result, {
        home: h,
        config: path.join(h, 'config'),
        secrets: path.join(h, 'secrets'),
        data: path.join(h, 'data'),
        logs: path.join(h, 'logs'),
        state: path.join(h, 'state'),
        backups: path.join(h, 'backups'),
        runtime: path.join(h, 'runtime')
      });
    });
  });
});
