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

function actorFromComment(comment, index) {
  const actor = comment?.author?.login ?? comment?.user?.login ?? comment?.author?.id ?? comment?.user?.id;
  if (actor == null) throw new Error(`Comment at index ${index} has no actor identity.`);
  return String(actor);
}

function idFromComment(comment, index) {
  const id = comment?.id ?? index;
  if (!['string', 'number', 'bigint'].includes(typeof id)) {
    throw new Error(`Comment at index ${index} has an invalid record ID.`);
  }
  return String(id);
}

function recordFromComment(comment, index) {
  const marker = markerFromComment(comment, index);
  if (!marker) return null;
  return {
    action: marker[1],
    session: marker[2],
    actor: actorFromComment(comment, index),
    timestamp: timestampFromComment(comment, index),
    id: idFromComment(comment, index),
  };
}

function compareIds(left, right) {
  if (/^\d+$/.test(left) && /^\d+$/.test(right)) {
    const numericOrder = BigInt(left) - BigInt(right);
    if (numericOrder < 0n) return -1;
    if (numericOrder > 0n) return 1;
    return 0;
  }
  return left.localeCompare(right);
}

function compareRecords(left, right) {
  return left.timestamp - right.timestamp || compareIds(left.id, right.id);
}

function recordsFromComments(comments) {
  const records = [];
  const recordIds = new Set();
  comments.forEach((comment, index) => {
    const record = recordFromComment(comment, index);
    if (!record) return;
    if (recordIds.has(record.id)) throw new Error(`Duplicate comment record ID: ${record.id}`);
    recordIds.add(record.id);
    records.push(record);
  });
  return records.sort(compareRecords);
}

function claimSummary(session, value) {
  return {
    session,
    actor: value.actor,
    claimedAt: new Date(value.claimedAt).toISOString(),
    recordId: value.recordId,
  };
}

function stateFromRecords(records) {
  const state = new Map();
  const invalidRecords = [];
  const terminalResolutions = [];

  for (const record of records) {
    const previous = state.get(record.session);
    if (terminalResolutions.length > 0 && record.action !== 'release') {
      invalidRecords.push({ ...record, reason: 'resolution-already-terminal' });
      continue;
    }
    if (record.action === 'claim') {
      if (previous?.active || previous?.terminal) {
        invalidRecords.push({ ...record, reason: 'duplicate-or-terminal-session' });
      } else {
        state.set(record.session, {
          active: true,
          terminal: false,
          actor: record.actor,
          claimedAt: record.timestamp,
          recordId: record.id,
        });
      }
      continue;
    }

    if (!previous?.active) {
      invalidRecords.push({ ...record, reason: 'no-active-session-claim' });
      continue;
    }
    if (previous.actor !== record.actor) {
      invalidRecords.push({ ...record, reason: 'actor-mismatch' });
      continue;
    }

    if (record.action === 'resolved') {
      const winner = activeClaimsFromState(state)[0];
      if (winner?.session !== record.session) {
        invalidRecords.push({ ...record, reason: 'session-did-not-own-winning-claim' });
        continue;
      }
      const terminal = { ...claimSummary(record.session, previous), resolvedRecordId: record.id };
      terminalResolutions.push(terminal);
      state.set(record.session, { ...previous, active: false, terminal: true });
      continue;
    }

    state.set(record.session, { ...previous, active: false });
  }
  return { state, invalidRecords, terminalResolutions };
}

function activeClaimsFromState(state) {
  return [...state.entries()]
    .filter(([, value]) => value.active)
    .map(([session, value]) => claimSummary(session, value))
    .sort((left, right) => Date.parse(left.claimedAt) - Date.parse(right.claimedAt) || compareIds(left.recordId, right.recordId));
}

export function arbitrateClaims(comments, callerSession) {
  if (!Array.isArray(comments)) throw new Error('Comments input must be a JSON array.');
  const { state, invalidRecords, terminalResolutions } = stateFromRecords(recordsFromComments(comments));
  const activeClaims = activeClaimsFromState(state);
  const terminalResolution = terminalResolutions[0] ?? null;
  const winner = terminalResolution ? null : activeClaims[0] ?? null;
  return {
    winner,
    activeClaims,
    terminalResolution,
    invalidRecords,
    callerOwnsClaim: callerSession ? !terminalResolution && invalidRecords.length === 0 && winner?.session === callerSession : null,
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
