#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { analyzeSvg, parseSvg } from './svg-utils.mjs';

function parseArgs(argv) {
  const options = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === '--force') {
      options.set('force', true);
      continue;
    }
    const value = argv[index + 1];
    if (!key?.startsWith('--') || value === undefined) {
      throw new Error('Use --input, --output, --framework react|vue, --component Name [--force].');
    }
    options.set(key.slice(2), value);
    index += 1;
  }
  return options;
}

const attributeNames = new Map([
  ['class', 'className'], ['for', 'htmlFor'], ['tabindex', 'tabIndex'],
  ['xlink:href', 'xlinkHref'], ['xmlns:xlink', 'xmlnsXlink'],
]);

function jsxName(name) {
  if (name.startsWith('aria-') || name.startsWith('data-')) return name;
  if (attributeNames.has(name)) return attributeNames.get(name);
  return name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function stripOwnedAccessibility(attributes) {
  return attributes.replace(/\s+(?:role|aria-label|aria-hidden)\s*=\s*["'][^"']*["']/gi, '');
}

function dynamicValue(value, ids, variable) {
  let result = value;
  const placeholder = `\${${variable}}`;
  for (const id of ids) {
    result = result
      .replaceAll(`url(#${id})`, `url(#${placeholder}-${id})`)
      .replaceAll(`#${id}`, `#${placeholder}-${id}`);
  }
  return result;
}

function transformReact(markup, ids) {
  return markup.replace(/([:\w-]+)\s*=\s*"([^"]*)"/g, (_match, rawName, value) => {
    const name = jsxName(rawName);
    if (name === 'style') {
      const entries = value.split(';').filter(Boolean).map((declaration) => {
        const split = declaration.indexOf(':');
        if (split === -1) throw new Error(`Invalid inline style declaration: ${declaration}`);
        const property = jsxName(declaration.slice(0, split).trim());
        return `${property}: ${JSON.stringify(declaration.slice(split + 1).trim())}`;
      });
      return `style={{ ${entries.join(', ')} }}`;
    }
    if (name === 'id' && ids.includes(value)) return `id={\`\${resolvedId}-${value}\`}`;
    const converted = dynamicValue(value, ids, 'resolvedId');
    if (converted !== value) return `${name}={\`${converted}\`}`;
    return `${name}=${JSON.stringify(value)}`;
  });
}

function transformVue(markup, ids) {
  return markup.replace(/([:\w-]+)\s*=\s*"([^"]*)"/g, (_match, name, value) => {
    if (name === 'id' && ids.includes(value)) return `:id="\`\${resolvedId}-${value}\`"`;
    const converted = dynamicValue(value, ids, 'resolvedId');
    if (converted !== value) return `:${name}="\`${converted}\`"`;
    return `${name}=${JSON.stringify(value)}`;
  });
}

function reactComponent(component, attributes, body, ids) {
  const root = transformReact(stripOwnedAccessibility(attributes), ids);
  const inner = transformReact(body.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, ''), ids);
  return `import { useId, type SVGProps } from 'react';

export type ${component}Props = Omit<SVGProps<SVGSVGElement>, 'title'> & {
  title?: string;
  idPrefix?: string;
};

export function ${component}({ title, idPrefix, ...svgProps }: ${component}Props) {
  const generatedId = useId().replace(/:/g, '');
  const resolvedId = idPrefix ?? generatedId;
  return (
    <svg ${root} {...svgProps} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      {title ? <title>{title}</title> : null}
      ${inner}
    </svg>
  );
}
`;
}

function vueComponent(attributes, body, ids) {
  const root = transformVue(stripOwnedAccessibility(attributes), ids);
  const inner = transformVue(body.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, ''), ids);
  return `<script setup lang="ts">
import { computed, useId } from 'vue';

defineOptions({ inheritAttrs: false });
const props = defineProps<{ title?: string; idPrefix?: string }>();
const generatedId = useId().replace(/:/g, '');
const resolvedId = computed(() => props.idPrefix ?? generatedId);
</script>

<template>
  <svg ${root} v-bind="$attrs" :role="props.title ? 'img' : undefined" :aria-hidden="props.title ? undefined : 'true'" :aria-label="props.title">
    <title v-if="props.title">{{ props.title }}</title>
    ${inner}
  </svg>
</template>
`;
}

const options = parseArgs(process.argv.slice(2));
for (const key of ['input', 'output', 'framework', 'component']) {
  if (!options.get(key)) throw new Error(`Missing --${key}.`);
}
if (!['react', 'vue'].includes(options.get('framework'))) throw new Error('--framework must be react or vue.');
if (!/^[A-Z][A-Za-z0-9]*$/.test(options.get('component'))) {
  throw new Error('--component must be a PascalCase identifier.');
}

const input = resolve(options.get('input'));
const output = resolve(options.get('output'));
const source = await readFile(input, 'utf8');
const analysis = analyzeSvg(source);
if (analysis.errors.length) throw new Error(`SVG validation failed: ${analysis.errors.join('; ')}`);
const { attributes, body } = parseSvg(source);
const generated = options.get('framework') === 'react'
  ? reactComponent(options.get('component'), attributes, body, analysis.ids)
  : vueComponent(attributes, body, analysis.ids);

await writeFile(output, generated, { encoding: 'utf8', flag: options.get('force') ? 'w' : 'wx' });
process.stdout.write(`${output}\n`);
