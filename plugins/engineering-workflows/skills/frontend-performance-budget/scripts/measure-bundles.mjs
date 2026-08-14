#!/usr/bin/env node

import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

function parseArgs(argv) {
  const result = new Map();
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith('--') || value === undefined) {
      throw new Error('Use --root <dir> --budget <json> [--baseline <json>].');
    }
    result.set(key.slice(2), value);
  }
  return result;
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const path = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) files.push(...(await collectFiles(path)));
    if (entry.isFile()) files.push(path);
  }
  return files;
}

const categories = {
  javascript: new Set(['.js', '.mjs', '.cjs']),
  css: new Set(['.css']),
  font: new Set(['.woff', '.woff2', '.ttf', '.otf']),
  image: new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg']),
};

function categoryFor(path) {
  const extension = extname(path).toLowerCase();
  return Object.entries(categories).find(([, extensions]) => extensions.has(extension))?.[0];
}

function bytesToKib(bytes) {
  return Math.round((bytes / 1024) * 100) / 100;
}

function roundKib(value) {
  return Math.round(value * 100) / 100;
}

const args = parseArgs(process.argv.slice(2));
const root = resolve(args.get('root') ?? '');
const budgetPath = resolve(args.get('budget') ?? '');
if (!args.get('root') || !args.get('budget')) throw new Error('--root and --budget are required.');
if (!(await stat(root)).isDirectory()) throw new Error('--root must be a directory.');

const budget = JSON.parse(await readFile(budgetPath, 'utf8'));
const report = {
  metrics: { javascriptTotalKib: 0, javascriptFileKib: 0, cssTotalKib: 0, fontTotalKib: 0, imageTotalKib: 0 },
  files: [],
  failures: [],
};

for (const path of await collectFiles(root)) {
  const category = categoryFor(path);
  if (!category) continue;
  const bytes = gzipSync(await readFile(path), { level: 9 }).byteLength;
  const compressedKib = bytesToKib(bytes);
  report.files.push({ path: path.slice(root.length + 1), category, compressedKib });
  const totalKey = `${category}TotalKib`;
  report.metrics[totalKey] = roundKib(report.metrics[totalKey] + compressedKib);
  if (category === 'javascript') {
    report.metrics.javascriptFileKib = Math.max(report.metrics.javascriptFileKib, compressedKib);
  }
}

for (const [metric, limit] of Object.entries(budget)) {
  if (!(metric in report.metrics)) continue;
  if (report.metrics[metric] > limit) {
    report.failures.push(`${metric}: ${report.metrics[metric]} KiB exceeds ${limit} KiB`);
  }
}

if (args.get('baseline')) {
  const baseline = JSON.parse(await readFile(resolve(args.get('baseline')), 'utf8'));
  for (const [metric, current] of Object.entries(report.metrics)) {
    const previous = baseline.metrics?.[metric];
    if (typeof previous !== 'number' || current <= previous) continue;
    const allowed = Math.max(
      (previous * budget.maxRegressionPercent) / 100,
      budget.maxRegressionKib,
    );
    if (current - previous > allowed) {
      report.failures.push(
        `${metric}: +${roundKib(current - previous)} KiB exceeds regression allowance ${roundKib(allowed)} KiB`,
      );
    }
  }
}

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (report.failures.length > 0) process.exitCode = 1;
