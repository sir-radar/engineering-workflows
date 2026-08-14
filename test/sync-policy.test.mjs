import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  applyPolicy,
  END_MARKER,
  extractManagedBlock,
  LEGACY_END_MARKER,
  synchronizeContent,
  validateTarget,
} from '../scripts/sync-policy.mjs';

const block = `<!-- engineering-workflows:start version=0.7.0 -->\n# Shared policy\n${END_MARKER}`;

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
  const stale = '<!-- engineering-workflows:start version=0.0.1 -->\nold\n<!-- engineering-workflows:end -->';
  const current = `before\n${stale}\nafter\n`;
  const updated = synchronizeContent(current, block);
  assert.equal(updated, `before\n${block}\nafter\n`);
  assert.equal(synchronizeContent(updated, block), updated);
});

test('migrates one legacy frontend-workflows block in place', () => {
  const legacy = `<!-- frontend-workflows:start version=0.5.0 -->\nold\n${LEGACY_END_MARKER}`;
  const current = `before\n${legacy}\nafter\n`;
  const updated = synchronizeContent(current, block);
  assert.equal(updated, `before\n${block}\nafter\n`);
  assert.doesNotMatch(updated, /frontend-workflows/);
});

test('refuses malformed or duplicate markers', () => {
  assert.throws(() => synchronizeContent(`x\n${END_MARKER}`, block), /Malformed/);
  assert.throws(() => synchronizeContent(`${block}\n${block}`, block), /Malformed/);
  assert.throws(() => synchronizeContent(`<!-- frontend-workflows:start version=0.5.0 -->\nx\n${END_MARKER}`, block), /mismatched/);
});

test('apply and check preserve unmanaged instructions', async () => {
  const target = await mkdtemp(join(tmpdir(), 'engineering-policy-test-'));
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
  const toolkit = await mkdtemp(join(tmpdir(), 'engineering-toolkit-test-'));
  await assert.rejects(() => validateTarget('/', toolkit), /filesystem root/);
  await assert.rejects(() => validateTarget(toolkit, toolkit), /itself/);
  await assert.rejects(() => validateTarget('/definitely/missing/engineering-workflows', toolkit), /does not exist/);
  await assert.rejects(() => validateTarget('*', toolkit), /glob syntax/);
});

test('distributes communication, Wayfinder, task-branch, and Fallow remediation gates intact', async () => {
  const source = await readFile(new URL('../AGENTS.md', import.meta.url), 'utf8');
  const managed = extractManagedBlock(source);
  const synchronized = synchronizeContent('# Project policy\n', managed);

  assert.match(managed, /## Communication mode/);
  assert.match(managed, /Load `\$caveman` automatically at the start of every task/);
  assert.match(managed, /Honor `stop caveman`/);
  assert.match(managed, /## Wayfinder planning mode/);
  assert.match(managed, /Use `\$wayfinder` only when the user explicitly invokes it/);
  assert.match(managed, /append-only map events/);
  assert.match(managed, /## Task branch gate/);
  assert.match(managed, /ft\/<short-kebab-case-task>/);
  assert.match(managed, /Do not commit task work directly to `main`/);
  assert.match(managed, /## Fallow remediation gate/);
  assert.match(managed, /\$fallow/);
  assert.match(managed, /\$fallow-remediation/);
  assert.match(managed, /fallow --format json --quiet --explain 2>\/dev\/null \|\| true/);
  assert.match(managed, /fallow security --diff-file - --format json --quiet/);
  assert.match(managed, /fallow fix --dry-run --no-create-config/);
  assert.match(managed, /fallow fix --yes --no-create-config/);
  assert.ok(managed.indexOf('fallow fix --dry-run') < managed.indexOf('fallow fix --yes'));
  assert.match(managed, /global preview includes an unrelated or unsafe edit/);
  assert.match(managed, /staged security candidate is verified or unresolved/);
  assert.match(synchronized, /^# Project policy/);
  assert.equal(extractManagedBlock(synchronized), managed);
});
