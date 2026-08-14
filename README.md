# Codex Frontend Workflows

A local Codex plugin and reusable project policy for evidence-driven frontend implementation, accessibility, visual regression, performance, API states, design-system governance, and adversarial review.

## Included skills

- `$figma-ui-implementation` — one-shot Figma or reference-image implementation.
- `$frontend-accessibility-audit` — WCAG 2.2 AA audit and remediation verification.
- `$visual-regression` — deterministic screenshots and reference comparison.
- `$frontend-performance-budget` — measured performance and explicit budgets.
- `$design-system-governance` — reuse, extension, token, variant, and API decisions.
- `$api-state-contracts` — backend contracts, fixtures, states, races, and rollback.
- `$frontend-pr-review` — read-only findings-first frontend review.

## Validate locally

The toolkit has no package dependencies.

```bash
node --test
node scripts/validate-toolkit.mjs
```

The official Codex skill and plugin validators are also run before release.

## Install the local plugin

From the repository root:

```bash
codex plugin marketplace add "$(pwd)"
codex plugin add frontend-workflows@frontend-workflow-toolkit
```

Start a new Codex task after installation so the seven skills are discovered.

## Sync policy into a project

Check whether a project has the current managed policy:

```bash
node scripts/sync-policy.mjs --target /absolute/path/to/project --check
```

Create or update only the managed policy block:

```bash
node scripts/sync-policy.mjs --target /absolute/path/to/project --apply
```

The synchronizer preserves all project-owned instructions outside the `frontend-workflows` markers. It rejects filesystem roots, the home directory, missing paths, glob syntax, the toolkit itself, and malformed or duplicate markers.

## Update a local installation

After changing and validating the plugin, use Codex's plugin cachebuster helper, then reinstall from the configured local marketplace:

```bash
python3 ~/.codex/skills/.system/plugin-creator/scripts/update_plugin_cachebuster.py plugins/frontend-workflows
codex plugin add frontend-workflows@frontend-workflow-toolkit
```

Open a new Codex task after reinstalling. When this repository gains a remote, pull and validate changes before reinstalling or syncing policy.

## Repository boundaries

This repository intentionally contains no application code, MCP server, hook, external runtime dependency, generated report, or project-specific asset. Publishing a remote repository is a separate explicit action.
