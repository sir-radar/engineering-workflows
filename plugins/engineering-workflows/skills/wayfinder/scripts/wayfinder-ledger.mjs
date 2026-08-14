#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const MARKER = /<!--\s*wayfinder:(claim|release|resolved)\s+session=([A-Za-z0-9._-]{6,128})\s*-->/g;
const OPTIONS = new Set(['--input', '--session']);

function usage() {
  return 'Usage: node wayfinder-ledger.mjs --input <comments.json> [--session <session-id>]\n';
}

function optionMap(argv) {
  if (argv.length % 2 !== 0) throw new Error(`Missing value for ${argv.at(-1)}.`);
  const options = new Map();
  for (let index = 0; index < argv.length; index += 2) {
    const name = argv[index];
    if (!OPTIONS.has(name)) throw new Error(`Unknown argument: ${name}`);
    if (options.has(name)) throw new Error(`Duplicate argument: ${name}`);
    options.set(name, argv[index + 1]);
  }
  return options;
}

function parseArguments(argv) {
  const options = optionMap(argv);
  const input = options.get('--input');
  const session = options.get('--session');
  if (!input) throw new Error('--input is required.');
  if (session && !/^[A-Za-z0-9._-]{6,128}$/.test(session)) throw new Error('Invalid session ID.');
  return { input, session };
}

function markerFromComment(comment, index) {
  const body = typeof comment?.body === 'string' ? comment.body : '';
  const markers = [...body.matchAll(MARKER)];
  if (markers.length > 1) throw new Error(`Comment at index ${index} contains multiple Wayfinder claim markers.`);
  return markers[0] ?? null;
}

function timestampFromComment(comment, index) {
  const timestamp = Date.parse(comment.createdAt ?? comment.created_at);
  if (!Number.isFinite(timestamp)) throw new Error(`Comment at index ${index} has an invalid creation timestamp.`);
  return timestamp;
}

function recordFromComment(comment, index) {
  const marker = markerFromComment(comment, index);
  if (!marker) return null;
  return {
    action: marker[1],
    session: marker[2],
    timestamp: timestampFromComment(comment, index),
    id: String(comment.id ?? index),
  };
}

function compareRecords(left, right) {
  return left.timestamp - right.timestamp || left.id.localeCompare(right.id);
}

function recordsFromComments(comments) {
  const records = [];
  comments.forEach((comment, index) => {
    const record = recordFromComment(comment, index);
    if (record) records.push(record);
  });
  return records.sort(compareRecords);
}

function updatedClaimState(previous, record) {
  if (record.action !== 'claim') return { active: false, claimedAt: null, recordId: record.id };
  if (previous?.active) return previous;
  return { active: true, claimedAt: record.timestamp, recordId: record.id };
}

function stateFromRecords(records) {
  const state = new Map();
  for (const record of records) state.set(record.session, updatedClaimState(state.get(record.session), record));
  return state;
}

function activeClaim([session, value]) {
  return { session, claimedAt: new Date(value.claimedAt).toISOString(), recordId: value.recordId };
}

function activeClaimsFromState(state) {
  return [...state.entries()]
    .filter(([, value]) => value.active)
    .map(activeClaim)
    .sort((left, right) => Date.parse(left.claimedAt) - Date.parse(right.claimedAt) || left.recordId.localeCompare(right.recordId));
}

export function arbitrateClaims(comments, callerSession) {
  if (!Array.isArray(comments)) throw new Error('Comments input must be a JSON array.');
  const activeClaims = activeClaimsFromState(stateFromRecords(recordsFromComments(comments)));
  const winner = activeClaims[0] ?? null;
  return {
    winner,
    activeClaims,
    callerOwnsClaim: callerSession ? winner?.session === callerSession : null,
  };
}

async function main(argv = process.argv.slice(2)) {
  const { input, session } = parseArguments(argv);
  const comments = JSON.parse(await readFile(input, 'utf8'));
  process.stdout.write(`${JSON.stringify(arbitrateClaims(comments, session), null, 2)}\n`);
}

if (process.argv[1]?.endsWith('wayfinder-ledger.mjs')) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n${usage()}`);
    process.exitCode = 1;
  });
}
