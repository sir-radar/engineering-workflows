import assert from 'node:assert/strict';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const skills = join(root, 'plugins', 'frontend-workflows', 'skills');

function run(script, args) {
  return spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
}

test('screenshot names are deterministic and reject invalid viewports', () => {
  const script = join(skills, 'visual-regression', 'scripts', 'screenshot-name.mjs');
  const valid = run(script, [
    '--surface', 'Token Details',
    '--state', 'Loading',
    '--viewport', '1440x900',
    '--theme', 'Light',
    '--browser', 'Chromium',
  ]);
  assert.equal(valid.status, 0, valid.stderr);
  assert.equal(valid.stdout, 'token-details--loading--1440x900--light--chromium.png\n');

  const invalid = run(script, [
    '--surface', 'x', '--state', 'y', '--viewport', 'wide', '--theme', 'light', '--browser', 'chromium',
  ]);
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /WIDTHxHEIGHT/);
});

test('bundle measurement enforces absolute and baseline budgets', async (context) => {
  const directory = await testDirectory('bundle-budget-');
  context.after(() => rm(directory, { recursive: true, force: true }));
  const assets = join(directory, 'assets');
  await mkdir(assets);
  await writeFile(join(assets, 'app.js'), "export const message = 'bundle fixture';\n");

  const passBudget = join(directory, 'pass.json');
  const failBudget = join(directory, 'fail.json');
  const baseline = join(directory, 'baseline.json');
  await writeFile(passBudget, JSON.stringify({
    javascriptTotalKib: 10,
    javascriptFileKib: 10,
    cssTotalKib: 10,
    fontTotalKib: 10,
    imageTotalKib: 10,
    maxRegressionPercent: 5,
    maxRegressionKib: 10,
  }));
  await writeFile(failBudget, JSON.stringify({
    javascriptTotalKib: 0,
    javascriptFileKib: 0,
    cssTotalKib: 10,
    fontTotalKib: 10,
    imageTotalKib: 10,
    maxRegressionPercent: 0,
    maxRegressionKib: 0,
  }));
  await writeFile(baseline, JSON.stringify({ metrics: {
    javascriptTotalKib: 0,
    javascriptFileKib: 0,
    cssTotalKib: 0,
    fontTotalKib: 0,
    imageTotalKib: 0,
  } }));

  const script = join(skills, 'frontend-performance-budget', 'scripts', 'measure-bundles.mjs');
  const passing = run(script, ['--root', assets, '--budget', passBudget]);
  assert.equal(passing.status, 0, passing.stderr);
  assert.equal(JSON.parse(passing.stdout).failures.length, 0);

  const absoluteFailure = run(script, ['--root', assets, '--budget', failBudget]);
  assert.equal(absoluteFailure.status, 1);
  assert.match(JSON.parse(absoluteFailure.stdout).failures.join('\n'), /exceeds 0 KiB/);

  const regressionFailure = run(script, ['--root', assets, '--budget', failBudget, '--baseline', baseline]);
  assert.equal(regressionFailure.status, 1);
  assert.match(JSON.parse(regressionFailure.stdout).failures.join('\n'), /regression allowance/);
});

test('SVG tools preserve definitions, prefix IDs, detect duplicates, and reject unsafe input', async (context) => {
  const directory = await testDirectory('svg-tools-');
  context.after(() => rm(directory, { recursive: true, force: true }));
  const safe = join(directory, 'icon.svg');
  const copy = join(directory, 'icon-copy.svg');
  const unsafe = join(directory, 'unsafe.svg');
  const source = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="paint0"><stop stop-color="#fff" /></linearGradient><clipPath id="clip0"><circle cx="12" cy="12" r="10" /></clipPath></defs>
  <path d="M2 2h20v20H2z" fill="url(#paint0)" clip-path="url(#clip0)" />
</svg>\n`;
  await writeFile(safe, source);
  await writeFile(copy, source);
  await writeFile(unsafe, '<svg viewBox="0 0 10 10"><script>x()</script><path id="same"/><path id="same" href="https://example.com/x"/></svg>\n');

  const toolRoot = join(skills, 'figma-ui-implementation', 'scripts');
  const validate = join(toolRoot, 'validate-svg.mjs');
  const inventory = join(toolRoot, 'inventory-assets.mjs');
  const convert = join(toolRoot, 'convert-svg-component.mjs');

  assert.equal(run(validate, [safe]).status, 0);
  const unsafeResult = run(validate, [unsafe]);
  assert.equal(unsafeResult.status, 1);
  assert.match(unsafeResult.stdout, /Unsafe <script>/);
  assert.match(unsafeResult.stdout, /Duplicate id/);
  assert.match(unsafeResult.stdout, /External reference/);

  const inventoryResult = run(inventory, ['--root', directory, '--format', 'json']);
  assert.equal(inventoryResult.status, 0, inventoryResult.stderr);
  const inventoryJson = JSON.parse(inventoryResult.stdout);
  assert.deepEqual(inventoryJson.duplicates, [['icon-copy.svg', 'icon.svg']]);

  const reactOutput = join(directory, 'Icon.tsx');
  const vueOutput = join(directory, 'Icon.vue');
  assert.equal(run(convert, ['--input', safe, '--output', reactOutput, '--framework', 'react', '--component', 'Icon']).status, 0);
  assert.equal(run(convert, ['--input', safe, '--output', vueOutput, '--framework', 'vue', '--component', 'Icon']).status, 0);
  const react = await readFile(reactOutput, 'utf8');
  const vue = await readFile(vueOutput, 'utf8');
  assert.match(react, /useId/);
  assert.match(react, /url\(#\$\{resolvedId\}-paint0\)/);
  assert.match(react, /clipPath/);
  assert.match(vue, /useId/);
  assert.match(vue, /url\(#\$\{resolvedId\}-paint0\)/);

  assert.equal(run(convert, ['--input', safe, '--output', reactOutput, '--framework', 'react', '--component', 'Icon']).status, 1);
  assert.equal(run(convert, ['--input', unsafe, '--output', join(directory, 'Unsafe.tsx'), '--framework', 'react', '--component', 'Unsafe']).status, 1);
});

async function testDirectory(prefix) {
  const base = join(tmpdir(), prefix);
  for (let index = 0; index < 1000; index += 1) {
    const candidate = resolve(`${base}${process.pid}-${index}`);
    try {
      await mkdir(candidate);
      return candidate;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }
  throw new Error(`Could not allocate test directory for ${prefix}`);
}
