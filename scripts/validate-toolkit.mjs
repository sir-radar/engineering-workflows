#!/usr/bin/env node

import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const pluginRoot = join(root, 'plugins', 'frontend-workflows');
const skillsRoot = join(pluginRoot, 'skills');
const expectedSkills = [
  'api-state-contracts',
  'design-system-governance',
  'figma-ui-implementation',
  'frontend-accessibility-audit',
  'frontend-performance-budget',
  'frontend-pr-review',
  'visual-regression',
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
check(plugin.name === 'frontend-workflows', 'plugin name must be frontend-workflows');
check(/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(plugin.version), 'plugin version must be semver');
const pluginBaseVersion = plugin.version.split('+')[0];
check(plugin.skills === './skills/', 'plugin skills path must be ./skills/');
check(!('apps' in plugin) && !('mcpServers' in plugin) && !('hooks' in plugin), 'plugin must not declare apps, MCP servers, or hooks');
check(Array.isArray(plugin.interface?.defaultPrompt) && plugin.interface.defaultPrompt.length <= 3, 'plugin must provide at most three default prompts');

const marketplace = JSON.parse(await readFile(join(root, '.agents', 'plugins', 'marketplace.json'), 'utf8'));
check(marketplace.name === 'frontend-workflow-toolkit', 'marketplace name mismatch');
const entry = marketplace.plugins?.find((candidate) => candidate.name === plugin.name);
check(entry?.source?.path === './plugins/frontend-workflows', 'marketplace source path mismatch');
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
  '$frontend-pr-review',
]) {
  check(orchestrator.includes(routedSkill), `figma-ui-implementation must route to ${routedSkill}`);
}
check(orchestrator.includes('figma-design-to-code'), 'figma-ui-implementation must require the Figma design-to-code prerequisite');
check(orchestrator.includes('[react.md](references/react.md)'), 'figma-ui-implementation must route React work');
check(orchestrator.includes('[vue.md](references/vue.md)'), 'figma-ui-implementation must route Vue work');
check(orchestrator.includes('for every data-backed surface'), 'API-state routing must remain conditional on data-backed UI');
check(orchestrator.includes('$fallow'), 'figma-ui-implementation must route code-bearing commits through $fallow');
check(orchestrator.includes('dead-code, duplication, and health'), 'figma-ui-implementation must require the complete Fallow flow');
check(orchestrator.indexOf('Before every code-bearing commit') < orchestrator.indexOf('Load `$frontend-pr-review`'), 'Fallow must run before final PR review');

const prReview = await readFile(join(skillsRoot, 'frontend-pr-review', 'SKILL.md'), 'utf8');
check(prReview.includes('$fallow'), 'frontend-pr-review must inspect $fallow evidence');
check(prReview.includes('complete root analysis'), 'frontend-pr-review must require complete Fallow analysis');

const agents = await readFile(join(root, 'AGENTS.md'), 'utf8');
const startMarkers = [...agents.matchAll(/<!-- frontend-workflows:start version=([^\s>]+) -->/g)];
const endMarkers = [...agents.matchAll(/<!-- frontend-workflows:end -->/g)];
check(startMarkers.length === 1 && endMarkers.length === 1, 'AGENTS.md must contain exactly one managed policy block');
check(startMarkers[0]?.[1] === pluginBaseVersion, 'managed policy version must match plugin base version');
check(agents.includes('## Fallow commit gate'), 'managed policy must define the Fallow commit gate');
check(agents.includes('| `$fallow` |'), 'managed policy must route complete analysis through $fallow');
check(agents.includes('FALLOW_AGENT_SOURCE=codex fallow --format json --quiet --explain 2>/dev/null || true'), 'managed policy must include the complete Fallow command');
check(agents.includes('every code-bearing commit'), 'managed policy must make the Fallow gate mandatory for code commits');

const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
check(!packageJson.dependencies && !packageJson.devDependencies, 'toolkit must not declare runtime or development dependencies');
check(packageJson.version === pluginBaseVersion, 'package version must match plugin base version');

if (failures.length) {
  process.stderr.write(`${failures.map((failure) => `- ${failure}`).join('\n')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Validated frontend-workflows plugin, ${actualSkills.length} skills, policy markers, links, metadata, JSON, and scripts.\n`);
}
