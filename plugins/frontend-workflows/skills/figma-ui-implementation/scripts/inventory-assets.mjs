#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';
import { analyzeSvg } from './svg-utils.mjs';

const assetExtensions = new Set([
  '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif',
  '.woff', '.woff2', '.ttf', '.otf',
]);

function parseArgs(argv) {
  const options = new Map([['format', 'markdown']]);
  for (let index = 0; index < argv.length; index += 2) {
    if (!argv[index]?.startsWith('--') || argv[index + 1] === undefined) {
      throw new Error('Use --root <directory> [--format markdown|json].');
    }
    options.set(argv[index].slice(2), argv[index + 1]);
  }
  return options;
}

async function collect(directory) {
  const files = [];
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) files.push(...(await collect(path)));
    if (entry.isFile() && assetExtensions.has(extname(entry.name).toLowerCase())) files.push(path);
  }
  return files;
}

function pngDimensions(buffer) {
  const signature = '89504e470d0a1a0a';
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== signature) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

const options = parseArgs(process.argv.slice(2));
const root = resolve(options.get('root') ?? '');
if (!options.get('root') || !(await stat(root)).isDirectory()) {
  throw new Error('--root must be an existing directory.');
}
if (!['markdown', 'json'].includes(options.get('format'))) {
  throw new Error('--format must be markdown or json.');
}

const assets = [];
for (const path of await collect(root)) {
  const buffer = await readFile(path);
  const extension = extname(path).toLowerCase();
  const asset = {
    path: relative(root, path),
    extension,
    bytes: buffer.byteLength,
    sha256: createHash('sha256').update(buffer).digest('hex'),
    dimensions: extension === '.png' ? pngDimensions(buffer) : null,
  };
  if (extension === '.svg') {
    const analysis = analyzeSvg(buffer.toString('utf8'));
    asset.viewBox = analysis.viewBox;
    asset.ids = analysis.ids;
    asset.errors = analysis.errors;
    asset.warnings = analysis.warnings;
  }
  assets.push(asset);
}

const byHash = new Map();
for (const asset of assets) {
  const group = byHash.get(asset.sha256) ?? [];
  group.push(asset);
  byHash.set(asset.sha256, group);
}
const duplicates = [...byHash.values()]
  .filter((group) => group.length > 1)
  .map((group) => group.map((asset) => asset.path));
const report = { root, assets, duplicates };

if (options.get('format') === 'json') {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  const lines = [
    '# Asset inventory',
    '',
    '| Path | Type | Bytes | Dimensions/viewBox | SHA-256 | Validation |',
    '| --- | --- | ---: | --- | --- | --- |',
    ...assets.map((asset) => {
      const geometry = asset.dimensions
        ? `${asset.dimensions.width}x${asset.dimensions.height}`
        : asset.viewBox ?? '—';
      const validation = asset.errors?.length ? asset.errors.join('; ') : 'ok';
      return `| ${asset.path} | ${asset.extension} | ${asset.bytes} | ${geometry} | ${asset.sha256} | ${validation} |`;
    }),
    '',
    '## Duplicate byte groups',
    '',
    ...(duplicates.length ? duplicates.map((group) => `- ${group.join(', ')}`) : ['- None']),
  ];
  process.stdout.write(`${lines.join('\n')}\n`);
}
