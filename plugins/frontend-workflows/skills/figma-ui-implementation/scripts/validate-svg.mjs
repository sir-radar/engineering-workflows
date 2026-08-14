#!/usr/bin/env node

import { resolve } from 'node:path';
import { inspectSvg, svgFiles } from './svg-utils.mjs';

const argumentsList = process.argv.slice(2);
const strictIndex = argumentsList.indexOf('--strict');
const strict = strictIndex !== -1;
if (strict) argumentsList.splice(strictIndex, 1);
if (argumentsList.length !== 1) {
  throw new Error('Use validate-svg.mjs <svg-file-or-directory> [--strict].');
}

const target = resolve(argumentsList[0]);
const files = await svgFiles(target);
if (files.length === 0) throw new Error('No SVG files found.');

const results = await Promise.all(files.map(inspectSvg));
const report = results.map(({ source: _source, ...result }) => result);
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

if (report.some((result) => result.errors.length > 0 || (strict && result.warnings.length > 0))) {
  process.exitCode = 1;
}
