#!/usr/bin/env node

const fields = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  const key = process.argv[index];
  const value = process.argv[index + 1];
  if (!key?.startsWith('--') || value === undefined) {
    throw new Error('Use --surface, --state, --viewport, --theme, and --browser.');
  }
  fields.set(key.slice(2), value);
}

const required = ['surface', 'state', 'viewport', 'theme', 'browser'];
for (const key of required) {
  if (!fields.get(key)) throw new Error(`Missing --${key}.`);
}

function slug(value) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  if (!normalized) throw new Error(`Invalid screenshot field: ${value}`);
  return normalized;
}

const viewport = fields.get('viewport');
if (!/^\d+x\d+$/.test(viewport)) {
  throw new Error('--viewport must use WIDTHxHEIGHT, for example 1440x900.');
}

process.stdout.write(
  `${required.map((key) => slug(fields.get(key))).join('--')}.png\n`,
);
