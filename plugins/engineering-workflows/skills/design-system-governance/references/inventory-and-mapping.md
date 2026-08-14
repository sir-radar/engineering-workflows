# Component inventory and Figma mapping

## Repository inventory

Search before opening individual files:

- component and primitive directories;
- exported symbols and barrel files;
- token, theme, variable, utility, and style files;
- stories, examples, visual baselines, unit tests, and browser tests;
- package boundaries and public entrypoints;
- imports and runtime consumers of likely matches;
- duplicate filenames, role structures, variant names, and repeated style clusters.

For each candidate record semantics, owner, package, API, variants, states, tokens, tests, examples, consumers, and known constraints. Render or inspect it in the target context; a matching name is not matching behavior.

## Figma mapping

Map exact file and node IDs to:

- component set and variant/property values;
- nested instances and swap properties;
- variables, modes, styles, and responsive constraints;
- interactive states and prototype behavior;
- content slots and long/missing content behavior;
- assets and export settings;
- matching code component, variant, token, and evidence quality.

Classify each mapping as exact, adaptable, missing, or conflicting. Never infer token equivalence from visually similar hex values when named variables exist.
