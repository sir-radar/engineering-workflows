#!/usr/bin/env node

import { constants } from 'node:fs';
import { access, chmod, readFile, realpath, rename, stat, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, parse, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const START_PATTERN = /<!-- frontend-workflows:start version=[^\s>]+ -->/g;
export const END_MARKER = '<!-- frontend-workflows:end -->';

function matches(content, pattern) {
  return [...content.matchAll(new RegExp(pattern.source, pattern.flags))];
}

export function extractManagedBlock(content) {
  const starts = matches(content, START_PATTERN);
  const ends = [...content.matchAll(/<!-- frontend-workflows:end -->/g)];
  if (starts.length !== 1 || ends.length !== 1) {
    throw new Error(`Expected exactly one managed block; found ${starts.length} starts and ${ends.length} ends.`);
  }
  const start = starts[0].index;
  const end = ends[0].index + END_MARKER.length;
  if (start >= ends[0].index) throw new Error('Managed policy markers are out of order.');
  return content.slice(start, end);
}

export function synchronizeContent(current, managedBlock) {
  const starts = matches(current, START_PATTERN);
  const ends = [...current.matchAll(/<!-- frontend-workflows:end -->/g)];
  if (starts.length === 0 && ends.length === 0) {
    return current.trimEnd() ? `${current.trimEnd()}\n\n${managedBlock}\n` : `${managedBlock}\n`;
  }
  if (starts.length !== 1 || ends.length !== 1 || starts[0].index >= ends[0].index) {
    throw new Error(`Malformed managed policy markers; found ${starts.length} starts and ${ends.length} ends.`);
  }
  const end = ends[0].index + END_MARKER.length;
  return `${current.slice(0, starts[0].index)}${managedBlock}${current.slice(end)}`;
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

  const temporary = `${path}.frontend-workflows.tmp`;
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
