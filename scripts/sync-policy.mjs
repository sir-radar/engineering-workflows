#!/usr/bin/env node

import { constants } from 'node:fs';
import { access, chmod, readFile, realpath, rename, stat, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, parse, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const START_PATTERN = /<!-- engineering-workflows:start version=[^\s>]+ -->/g;
export const END_MARKER = '<!-- engineering-workflows:end -->';
export const LEGACY_START_PATTERN = /<!-- frontend-workflows:start version=[^\s>]+ -->/g;
export const LEGACY_END_MARKER = '<!-- frontend-workflows:end -->';

function matches(content, pattern) {
  return [...content.matchAll(new RegExp(pattern.source, pattern.flags))];
}

function markerLocations(content) {
  const families = [
    { name: 'current', starts: matches(content, START_PATTERN), ends: [...content.matchAll(/<!-- engineering-workflows:end -->/g)] },
    { name: 'legacy', starts: matches(content, LEGACY_START_PATTERN), ends: [...content.matchAll(/<!-- frontend-workflows:end -->/g)] },
  ];
  return {
    starts: families.flatMap((family) => family.starts.map((match) => ({ family: family.name, match }))),
    ends: families.flatMap((family) => family.ends.map((match) => ({ family: family.name, match }))),
  };
}

function singleManagedBlock(content, errorPrefix) {
  const { starts, ends } = markerLocations(content);
  if (starts.length !== 1 || ends.length !== 1) {
    throw new Error(`${errorPrefix}; found ${starts.length} starts and ${ends.length} ends.`);
  }
  if (starts[0].family !== ends[0].family || starts[0].match.index >= ends[0].match.index) {
    throw new Error('Managed policy markers are mismatched or out of order.');
  }
  return { start: starts[0].match.index, end: ends[0].match.index + ends[0].match[0].length };
}

export function extractManagedBlock(content) {
  const { start, end } = singleManagedBlock(content, 'Expected exactly one managed block');
  return content.slice(start, end);
}

export function synchronizeContent(current, managedBlock) {
  const { starts, ends } = markerLocations(current);
  if (starts.length === 0 && ends.length === 0) {
    return current.trimEnd() ? `${current.trimEnd()}\n\n${managedBlock}\n` : `${managedBlock}\n`;
  }
  const block = singleManagedBlock(current, 'Malformed managed policy markers');
  return `${current.slice(0, block.start)}${managedBlock}${current.slice(block.end)}`;
}

export async function validateTarget(targetArgument, toolkitRoot) {
  if (!targetArgument) throw new Error('--target <project-directory> is required.');
  if (/[*?\[\]{}]/.test(targetArgument)) throw new Error('Target must not contain glob syntax.');
  const target = await realpath(resolve(targetArgument)).catch(() => null);
  if (!target) throw new Error('Target directory does not exist.');
  const root = parse(target).root;
  if (target === root) throw new Error('Refusing to target a filesystem root.');
  if (target === await realpath(homedir())) throw new Error('Refusing to target the home directory.');
  if (target === await realpath(toolkitRoot)) throw new Error('Refusing to sync the toolkit into itself.');
  if (!(await stat(target)).isDirectory()) throw new Error('Target must be a directory.');
  return target;
}

export async function applyPolicy({ target, managedBlock, mode }) {
  const path = join(target, 'AGENTS.md');
  const exists = await access(path, constants.F_OK).then(() => true, () => false);
  const current = exists ? await readFile(path, 'utf8') : '';
  const expected = synchronizeContent(current, managedBlock);
  const changed = current !== expected;

  if (mode === 'check') return { changed, path };
  if (!changed) return { changed: false, path };

  const temporary = `${path}.engineering-workflows.tmp`;
  await writeFile(temporary, expected, { encoding: 'utf8', flag: 'wx' });
  if (exists) {
    const beforeRename = await readFile(path, 'utf8');
    if (beforeRename !== current) {
      throw new Error('AGENTS.md changed during synchronization; temporary file was left for inspection.');
    }
    await chmod(temporary, (await stat(path)).mode);
  }
  await rename(temporary, path);
  return { changed: true, path };
}

function parseCli(argv) {
  let target;
  let mode;
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--target') {
      target = argv[index + 1];
      index += 1;
    } else if (value === '--check' || value === '--apply') {
      if (mode) throw new Error('Choose exactly one of --check or --apply.');
      mode = value.slice(2);
    } else {
      throw new Error(`Unknown argument: ${value}`);
    }
  }
  if (!mode) throw new Error('Choose exactly one of --check or --apply.');
  return { target, mode };
}

export async function main(argv = process.argv.slice(2)) {
  const scriptPath = fileURLToPath(import.meta.url);
  const toolkitRoot = dirname(dirname(scriptPath));
  const { target: targetArgument, mode } = parseCli(argv);
  const target = await validateTarget(targetArgument, toolkitRoot);
  const source = await readFile(join(toolkitRoot, 'AGENTS.md'), 'utf8');
  const managedBlock = extractManagedBlock(source);
  const result = await applyPolicy({ target, managedBlock, mode });
  process.stdout.write(`${result.changed ? 'drift' : 'current'} ${result.path}\n`);
  if (mode === 'check' && result.changed) process.exitCode = 1;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
  });
}
