import { mkdir, open, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function readJson(file, fallback = null) {
  try { return JSON.parse(await readFile(file, 'utf8')); } catch { return fallback; }
}
export async function atomicJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  await rename(temporary, file);
}
const validPid = value => Number.isSafeInteger(value) && value > 0;
const processAlive = pid => { try { process.kill(pid, 0); return true; } catch (error) { return error.code === 'EPERM'; } };
async function staleLock(file, { isAlive = processAlive, maxAgeMs = 24 * 60 * 60 * 1000, now = Date.now } = {}) {
  let raw, metadata, info;
  try { raw = await readFile(file, 'utf8'); info = await stat(file); metadata = JSON.parse(raw); } catch { try { info ||= await stat(file); } catch { return null; } }
  const age = Math.max(0, now() - info.mtimeMs);
  if (validPid(metadata?.pid)) return isAlive(metadata.pid) ? null : { pid: metadata.pid, reason: 'dead PID' };
  return age > maxAgeMs ? { pid: null, reason: 'malformed expired lock' } : null;
}
export async function withLock(file, operation, options = {}) {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  let handle;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try { handle = await open(file, 'wx', 0o600); break; }
    catch (error) {
      if (error.code !== 'EEXIST') throw error;
      if (attempt > 0) throw Error(`job already running: ${path.basename(file)}`);
      const stale = await staleLock(file, options);
      if (!stale) throw Error(`job already running: ${path.basename(file)}`);
      const quarantine = `${file}.stale.${process.pid}.${Date.now()}`;
      try { await rename(file, quarantine); } catch (renameError) {
        if (renameError.code === 'ENOENT') continue;
        throw Error(`job already running: ${path.basename(file)}`);
      }
      await unlink(quarantine).catch(() => undefined);
      options.onRecovered?.({ lock: path.basename(file), ...stale });
    }
  }
  if (!handle) throw Error(`job already running: ${path.basename(file)}`);
  try { await handle.writeFile(`${JSON.stringify({ pid: process.pid, started_at: new Date().toISOString() })}\n`); return await operation(); }
  finally {
    await handle.close();
    const owned = await readJson(file);
    if (owned?.pid === process.pid) await unlink(file).catch(() => undefined);
  }
}
