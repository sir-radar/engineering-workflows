import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  applyPolicy,
  END_MARKER,
  extractManagedBlock,
  synchronizeContent,
  validateTarget,
} from '../scripts/sync-policy.mjs';

const block = `<!-- frontend-workflows:start version=0.2.0 -->\n# Shared policy\n${END_MARKER}`;

test('extracts exactly one managed block', () => {
  assert.equal(extractManagedBlock(`# Local\n\n${block}\n`), block);
  assert.throws(() => extractManagedBlock('no markers'), /exactly one/);
});

test('creates content when AGENTS.md is absent', () => {
  assert.equal(synchronizeContent('', block), `${block}\n`);
});

test('appends without changing local instructions', () => {
  assert.equal(synchronizeContent('# Local\nKeep this.\n', block), `# Local\nKeep this.\n\n${block}\n`);
});

test('replaces only a stale managed block and is idempotent', () => {
  const stale = '<!-- frontend-workflows:start version=0.0.1 -->\nold\n<!-- frontend-workflows:end -->';
  const current = `before\n${stale}\nafter\n`;
  const updated = synchronizeContent(current, block);
  assert.equal(updated, `before\n${block}\nafter\n`);
  assert.equal(synchronizeContent(updated, block), updated);
});

test('refuses malformed or duplicate markers', () => {
  assert.throws(() => synchronizeContent(`x\n${END_MARKER}`, block), /Malformed/);
  assert.throws(() => synchronizeContent(`${block}\n${block}`, block), /Malformed/);
});

test('apply and check preserve unmanaged instructions', async () => {
  const target = await mkdtemp(join(tmpdir(), 'frontend-policy-test-'));
  const path = join(target, 'AGENTS.md');
  await writeFile(path, '# Project-specific\n\nKeep me.\n');
  assert.deepEqual(await applyPolicy({ target, managedBlock: block, mode: 'check' }), { changed: true, path });
  assert.deepEqual(await applyPolicy({ target, managedBlock: block, mode: 'apply' }), { changed: true, path });
  const result = await readFile(path, 'utf8');
  assert.match(result, /^# Project-specific\n\nKeep me\./);
  assert.match(result, /# Shared policy/);
  assert.deepEqual(await applyPolicy({ target, managedBlock: block, mode: 'check' }), { changed: false, path });
});

test('rejects unsafe target scopes', async () => {
  const toolkit = await mkdtemp(join(tmpdir(), 'frontend-toolkit-test-'));
  await assert.rejects(() => validateTarget('/', toolkit), /filesystem root/);
  await assert.rejects(() => validateTarget(toolkit, toolkit), /itself/);
  await assert.rejects(() => validateTarget('/definitely/missing/frontend-workflows', toolkit), /does not exist/);
  await assert.rejects(() => validateTarget('*', toolkit), /glob syntax/);
});

test('distributes the current Fallow commit gate intact', async () => {
  const source = await readFile(new URL('../AGENTS.md', import.meta.url), 'utf8');
  const managed = extractManagedBlock(source);
  const synchronized = synchronizeContent('# Project policy\n', managed);

  assert.match(managed, /## Fallow commit gate/);
  assert.match(managed, /\$fallow/);
  assert.match(managed, /fallow --format json --quiet --explain 2>\/dev\/null \|\| true/);
  assert.match(synchronized, /^# Project policy/);
  assert.equal(extractManagedBlock(synchronized), managed);
});
