#!/usr/bin/env node

import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const pluginRoot = join(root, 'plugins', 'engineering-workflows');
const skillsRoot = join(pluginRoot, 'skills');
const expectedSkills = [
  'api-state-contracts',
  'caveman',
  'design-system-governance',
  'fallow-remediation',
  'figma-ui-implementation',
  'frontend-accessibility-audit',
  'frontend-performance-budget',
  'frontend-pr-review',
  'visual-regression',
  'wayfinder',
];
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function filesBelow(directory) {
  const output = [];
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) output.push(...(await filesBelow(path)));
    if (entry.isFile()) output.push(path);
  }
  return output;
}

function frontmatter(content, path) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    failures.push(`${path}: missing frontmatter`);
    return {};
  }
  const result = {};
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':');
    if (separator === -1) {
      failures.push(`${path}: invalid frontmatter line ${line}`);
      continue;
    }
    result[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  return result;
}

async function validateMarkdownLinks(path, content) {
  for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1];
    if (/^(?:https?:|#)/.test(target)) continue;
    const withoutAnchor = target.split('#')[0];
    const candidate = resolve(dirname(path), withoutAnchor);
    const exists = await stat(candidate).then(() => true, () => false);
    check(exists, `${relative(root, path)}: missing link target ${target}`);
  }
}

const plugin = JSON.parse(await readFile(join(pluginRoot, '.codex-plugin', 'plugin.json'), 'utf8'));
check(plugin.name === 'engineering-workflows', 'plugin name must be engineering-workflows');
check(/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(plugin.version), 'plugin version must be semver');
const pluginBaseVersion = plugin.version.split('+')[0];
check(plugin.skills === './skills/', 'plugin skills path must be ./skills/');
check(!('apps' in plugin) && !('mcpServers' in plugin) && !('hooks' in plugin), 'plugin must not declare apps, MCP servers, or hooks');
check(Array.isArray(plugin.interface?.defaultPrompt) && plugin.interface.defaultPrompt.length <= 3, 'plugin must provide at most three default prompts');

const marketplace = JSON.parse(await readFile(join(root, '.agents', 'plugins', 'marketplace.json'), 'utf8'));
check(marketplace.name === 'engineering-workflows', 'marketplace name mismatch');
const entry = marketplace.plugins?.find((candidate) => candidate.name === plugin.name);
check(entry?.source?.path === './plugins/engineering-workflows', 'marketplace source path mismatch');
check(entry?.policy?.installation === 'AVAILABLE', 'marketplace installation policy mismatch');
check(entry?.policy?.authentication === 'ON_INSTALL', 'marketplace authentication policy mismatch');
check(entry?.category === 'Developer Tools', 'marketplace category mismatch');

const actualSkills = (await readdir(skillsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
check(JSON.stringify(actualSkills) === JSON.stringify(expectedSkills), `skill set mismatch: ${actualSkills.join(', ')}`);

for (const name of actualSkills) {
  const directory = join(skillsRoot, name);
  const skillPath = join(directory, 'SKILL.md');
  const skill = await readFile(skillPath, 'utf8');
  const metadata = frontmatter(skill, relative(root, skillPath));
  check(JSON.stringify(Object.keys(metadata).sort()) === JSON.stringify(['description', 'name']), `${name}: frontmatter must contain only name and description`);
  check(metadata.name === name, `${name}: frontmatter name mismatch`);
  check(Boolean(metadata.description) && !/TODO|placeholder/i.test(metadata.description), `${name}: invalid description`);
  check(skill.split('\n').length <= 500, `${name}: SKILL.md exceeds 500 lines`);

  const interfacePath = join(directory, 'agents', 'openai.yaml');
  const interfaceYaml = await readFile(interfacePath, 'utf8');
  const short = interfaceYaml.match(/short_description: "([^"]+)"/)?.[1] ?? '';
  const prompt = interfaceYaml.match(/default_prompt: "([^"]+)"/)?.[1] ?? '';
  check(short.length >= 25 && short.length <= 64, `${name}: short_description must be 25–64 characters`);
  check(prompt.includes(`$${name}`), `${name}: default_prompt must mention $${name}`);
  if (name === 'caveman') {
    check(metadata.description.includes('Use automatically for every task'), 'caveman: description must trigger automatically for every task');
    check(interfaceYaml.includes('allow_implicit_invocation: true'), 'caveman: implicit invocation must remain enabled');
    check(skill.includes('## Instruction precedence'), 'caveman: platform instruction precedence must remain explicit');
    check(skill.includes('## Auto-clarity'), 'caveman: auto-clarity safeguards must remain explicit');
    const license = await readFile(join(directory, 'LICENSE'), 'utf8');
    check(license.includes('c72984e4392c7a154e55c11dbf445f01ce5c35d4'), 'caveman: upstream revision must remain pinned');
    check(license.includes('Copyright (c) 2026 Julius Brussee'), 'caveman: upstream copyright notice is missing');
  }
  if (name === 'wayfinder') {
    check(metadata.description.includes('Use only when the user explicitly invokes'), 'wayfinder: description must require explicit invocation');
    check(interfaceYaml.includes('allow_implicit_invocation: false'), 'wayfinder: implicit invocation must remain disabled');
    check(skill.includes('[decision-methods.md](references/decision-methods.md)'), 'wayfinder: decision methods must be self-contained');
    check(skill.includes('[github-tracker.md](references/github-tracker.md)'), 'wayfinder: GitHub tracker adapter is missing');
    check(skill.includes('[local-tracker.md](references/local-tracker.md)'), 'wayfinder: local tracker fallback is missing');
    check(skill.includes('scripts/wayfinder-ledger.mjs'), 'wayfinder: deterministic claim arbitration is missing');
    check(skill.includes('append-only'), 'wayfinder: concurrency-safe append-only events are missing');
    check(!skill.includes('/grilling') && !skill.includes('/domain-modeling') && !skill.includes('/research') && !skill.includes('/prototype'), 'wayfinder: unresolved upstream skill dependency remains');
    const license = await readFile(join(directory, 'LICENSE'), 'utf8');
    check(license.includes('38d62e71ed01fc05d5ae63b0807172e9546049d5'), 'wayfinder: upstream revision must remain pinned');
    check(license.includes('Copyright (c) 2026 Matt Pocock'), 'wayfinder: upstream copyright notice is missing');
  }
  if (name === 'fallow-remediation') {
    check(skill.includes('installed `$fallow` skill'), 'fallow-remediation: must defer analyzer semantics to $fallow');
    check(skill.includes('[action-policy.md](references/action-policy.md)'), 'fallow-remediation: action policy is missing');
    check(skill.includes('[security-remediation.md](references/security-remediation.md)'), 'fallow-remediation: security policy is missing');
    check(skill.includes('assets/fallow-remediation-record.md'), 'fallow-remediation: evidence record is missing');
    check(skill.includes('auto_fixable'), 'fallow-remediation: per-action auto-fixability is missing');
    check(skill.includes('fallow fix --dry-run --no-create-config'), 'fallow-remediation: guarded dry-run is missing');
    check(skill.includes('fallow fix --yes --no-create-config'), 'fallow-remediation: guarded apply is missing');
    check(skill.indexOf('fallow fix --dry-run') < skill.indexOf('fallow fix --yes'), 'fallow-remediation: fix preview must precede apply');
    check(skill.includes('fallow security --diff-file -'), 'fallow-remediation: staged-diff security scan is missing');
    check(skill.includes('unrelated or unsafe edit'), 'fallow-remediation: unrelated global fixes must be rejected');
    check(skill.includes('staged security candidate is verified, uninvestigated'), 'fallow-remediation: unresolved security findings must block');
    const securityPolicy = await readFile(join(directory, 'references', 'security-remediation.md'), 'utf8');
    check(securityPolicy.includes('run `fallow schema`'), 'fallow-remediation: security category configuration must use the installed schema');
    check(securityPolicy.includes('An `include` list is a whitelist'), 'fallow-remediation: secret-category opt-in must preserve ordinary coverage');
    check(securityPolicy.includes('hardcoded-secret') && securityPolicy.includes('secret-to-network'), 'fallow-remediation: include-required secret categories are missing');
  }

  const files = await filesBelow(directory);
  check(!files.some((path) => /\/(?:README|CHANGELOG|INSTALLATION_GUIDE|QUICK_REFERENCE)\.md$/i.test(path)), `${name}: contains auxiliary documentation`);
  for (const path of files) {
    const content = await readFile(path, 'utf8');
    check(!/\[TODO|TODO:|PLACEHOLDER/i.test(content), `${relative(root, path)}: contains a placeholder`);
    if (extname(path) === '.md') await validateMarkdownLinks(path, content);
    if (['.mjs', '.js', '.cjs'].includes(extname(path))) {
      const result = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
      check(result.status === 0, `${relative(root, path)}: JavaScript syntax check failed\n${result.stderr}`);
    }
    if (extname(path) === '.json') {
      try {
        JSON.parse(content);
      } catch (error) {
        failures.push(`${relative(root, path)}: invalid JSON: ${error.message}`);
      }
    }
  }
}

const orchestrator = await readFile(join(skillsRoot, 'figma-ui-implementation', 'SKILL.md'), 'utf8');
for (const routedSkill of [
  '$design-system-governance',
  '$api-state-contracts',
  '$visual-regression',
  '$frontend-accessibility-audit',
  '$frontend-performance-budget',
  '$fallow-remediation',
  '$frontend-pr-review',
]) {
  check(orchestrator.includes(routedSkill), `figma-ui-implementation must route to ${routedSkill}`);
}
check(orchestrator.includes('figma-design-to-code'), 'figma-ui-implementation must require the Figma design-to-code prerequisite for live Figma calls');
check(orchestrator.includes('[screenshot-and-layer-css.md](references/screenshot-and-layer-css.md)'), 'figma-ui-implementation must route screenshot-plus-layer-CSS work');
check(orchestrator.includes('do not require live Figma access'), 'figma-ui-implementation must support screenshot-plus-layer-CSS work without Figma access');
check(orchestrator.includes('ask the user for the icon file'), 'figma-ui-implementation must request missing dedicated icons');
check(orchestrator.includes('[react.md](references/react.md)'), 'figma-ui-implementation must route React work');
check(orchestrator.includes('[vue.md](references/vue.md)'), 'figma-ui-implementation must route Vue work');
check(orchestrator.includes('for every data-backed surface'), 'API-state routing must remain conditional on data-backed UI');
check(orchestrator.includes('$fallow'), 'figma-ui-implementation must route code-bearing commits through $fallow');
check(orchestrator.includes('complete root analysis and staged-diff security scan'), 'figma-ui-implementation must require full Fallow and security analysis');
check(orchestrator.includes('guarded automatic fixes'), 'figma-ui-implementation must prefer guarded Fallow fixes');
check(orchestrator.indexOf('Before every code-bearing commit') < orchestrator.indexOf('Load `$frontend-pr-review`'), 'Fallow must run before final PR review');

const prReview = await readFile(join(skillsRoot, 'frontend-pr-review', 'SKILL.md'), 'utf8');
check(prReview.includes('$fallow'), 'frontend-pr-review must inspect $fallow evidence');
check(prReview.includes('$fallow-remediation'), 'frontend-pr-review must inspect $fallow-remediation evidence');
check(prReview.includes('complete root analysis plus staged-diff security scan'), 'frontend-pr-review must require complete Fallow and security analysis');
check(prReview.includes('Keep this review pass read-only'), 'frontend-pr-review must remain independent and read-only');

const agents = await readFile(join(root, 'AGENTS.md'), 'utf8');
const startMarkers = [...agents.matchAll(/<!-- engineering-workflows:start version=([^\s>]+) -->/g)];
const endMarkers = [...agents.matchAll(/<!-- engineering-workflows:end -->/g)];
check(startMarkers.length === 1 && endMarkers.length === 1, 'AGENTS.md must contain exactly one managed policy block');
check(startMarkers[0]?.[1] === pluginBaseVersion, 'managed policy version must match plugin base version');
check(agents.includes('| `$caveman` |'), 'managed policy must route communication through $caveman');
check(agents.includes('| `$wayfinder` |'), 'managed policy must route explicit planning through $wayfinder');
check(agents.includes('## Communication mode'), 'managed policy must define automatic communication mode');
check(agents.includes('Load `$caveman` automatically at the start of every task'), 'managed policy must auto-activate $caveman');
check(agents.includes('Honor `stop caveman`, `normal mode`, `/caveman off`'), 'managed policy must preserve the Caveman opt-out');
check(agents.includes('## Wayfinder planning mode'), 'managed policy must define explicit Wayfinder planning mode');
check(agents.includes('Use `$wayfinder` only when the user explicitly invokes it'), 'managed policy must prevent implicit Wayfinder activation');
check(agents.includes('append-only map events'), 'managed policy must preserve Wayfinder concurrency safety');
check(agents.includes('## Task branch gate'), 'managed policy must define the task branch gate');
check(agents.includes('before the first repository edit for every new task'), 'managed policy must require branches before new task edits');
check(agents.includes('ft/<short-kebab-case-task>'), 'managed policy must define the fallback task branch convention');
check(agents.includes('Do not commit task work directly to `main`, `master`, or another default/integration branch'), 'managed policy must protect default branches');
check(agents.includes('## Fallow remediation gate'), 'managed policy must define the Fallow remediation gate');
check(agents.includes('| `$fallow` |'), 'managed policy must route complete analysis through $fallow');
check(agents.includes('| `$fallow-remediation` |'), 'managed policy must route guarded fixes through $fallow-remediation');
check(agents.includes('FALLOW_AGENT_SOURCE=codex fallow --format json --quiet --explain 2>/dev/null || true'), 'managed policy must include the complete Fallow command');
check(agents.includes('fallow security --diff-file - --format json --quiet'), 'managed policy must include staged-diff security analysis');
check(agents.includes('fallow fix --dry-run --no-create-config'), 'managed policy must require a guarded fix preview');
check(agents.includes('fallow fix --yes --no-create-config'), 'managed policy must define guarded automatic application');
check(agents.indexOf('fallow fix --dry-run') < agents.indexOf('fallow fix --yes'), 'managed policy must preview before applying Fallow fixes');
check(agents.includes('If the global preview includes an unrelated or unsafe edit'), 'managed policy must reject unsafe repository-wide application');
check(agents.includes('staged security candidate is verified or unresolved'), 'managed policy must block unresolved staged security candidates');
check(agents.includes('every code-bearing commit'), 'managed policy must make the Fallow gate mandatory for code commits');

const synchronizer = await readFile(join(root, 'scripts', 'sync-policy.mjs'), 'utf8');
check(synchronizer.includes('LEGACY_START_PATTERN'), 'policy synchronizer must migrate legacy frontend-workflows markers');
check(synchronizer.includes('LEGACY_END_MARKER'), 'policy synchronizer must preserve the legacy end-marker migration path');

const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
check(!packageJson.dependencies && !packageJson.devDependencies, 'toolkit must not declare runtime or development dependencies');
check(packageJson.version === pluginBaseVersion, 'package version must match plugin base version');

if (failures.length) {
  process.stderr.write(`${failures.map((failure) => `- ${failure}`).join('\n')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Validated engineering-workflows plugin, ${actualSkills.length} skills, policy markers, links, metadata, JSON, and scripts.\n`);
}
