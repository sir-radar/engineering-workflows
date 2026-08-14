import { readFile, readdir } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

export function parseSvg(source) {
  const match = source.match(/^[\s\S]*?<svg\b([^>]*)>([\s\S]*?)<\/svg>\s*$/i);
  if (!match) throw new Error('Expected one complete <svg> root element.');
  return { attributes: match[1].trim(), body: match[2].trim() };
}

export function analyzeSvg(source) {
  const errors = [];
  const warnings = [];
  let root;
  try {
    root = parseSvg(source);
  } catch (error) {
    return { errors: [error.message], warnings, ids: [], references: [], viewBox: null };
  }

  const viewBox = root.attributes.match(/\bviewBox\s*=\s*["']([^"']+)["']/i)?.[1] ?? null;
  if (!viewBox) errors.push('Missing viewBox on the root SVG.');
  if (/<\s*script\b/i.test(source)) errors.push('Unsafe <script> element.');
  if (/<\s*foreignObject\b/i.test(source)) errors.push('Unsafe <foreignObject> element.');
  if (/\son[a-z]+\s*=/i.test(source)) errors.push('Inline event-handler attribute.');

  const ids = [...source.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  for (const id of duplicates) errors.push(`Duplicate id: ${id}`);

  const localReferences = [
    ...source.matchAll(/\b(?:href|xlink:href)\s*=\s*["']#([^"']+)["']/gi),
    ...source.matchAll(/url\(\s*["']?#([^)'"\s]+)["']?\s*\)/gi),
  ].map((match) => match[1]);
  for (const reference of new Set(localReferences)) {
    if (!ids.includes(reference)) errors.push(`Unresolved local reference: ${reference}`);
  }

  const externalReferences = [
    ...source.matchAll(/\b(?:href|xlink:href)\s*=\s*["'](?!#)([^"']+)["']/gi),
    ...source.matchAll(/url\(\s*["']?(?!#)([^)'"\s]+)["']?\s*\)/gi),
  ].map((match) => match[1]);
  for (const reference of new Set(externalReferences)) {
    errors.push(`External reference: ${reference}`);
  }

  if (ids.length > 0) warnings.push('Reusable components must prefix internal IDs per instance.');
  if (/<\s*style\b/i.test(source) || /\bstyle\s*=/i.test(source)) {
    warnings.push('Inline SVG styles require framework-specific review during conversion.');
  }

  return {
    errors,
    warnings,
    ids: [...new Set(ids)],
    references: [...new Set(localReferences)],
    viewBox,
  };
}

export async function svgFiles(target) {
  const entries = await readdir(target, { withFileTypes: true }).catch(() => null);
  if (!entries) return extname(target).toLowerCase() === '.svg' ? [target] : [];
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const path = resolve(target, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) files.push(...(await svgFiles(path)));
    if (entry.isFile() && extname(entry.name).toLowerCase() === '.svg') files.push(path);
  }
  return files;
}

export async function inspectSvg(path) {
  const source = await readFile(path, 'utf8');
  return { path, source, ...analyzeSvg(source) };
}
