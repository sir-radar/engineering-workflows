# Codex Engineering Workflows

A local Codex plugin and reusable project policy for large-effort decision mapping, evidence-driven frontend implementation, accessibility, visual regression, performance, API states, design-system governance, adversarial review, and token-efficient communication.

Caveman loads implicitly for every task, defaults to its `full` compression level, preserves technical accuracy, and yields to explicit style, clarity, safety, and required progress instructions.

The managed policy also requires the complete Fallow static flow—dead code, duplication, and health—before every code-bearing commit.

Every new repository-mutating task must also begin on a dedicated task branch. Existing branches continue only for direct follow-ups in the same task; read-only work does not create a branch.

## Included skills

- `$caveman` — automatic concise communication with selectable intensity.
- `$wayfinder` — explicit-only mapping of uncertain multi-session efforts into decision tickets.
- `$figma-ui-implementation` — one-shot Figma or screenshot-plus-layer-CSS implementation.
- `$frontend-accessibility-audit` — WCAG 2.2 AA audit and remediation verification.
- `$visual-regression` — deterministic screenshots and reference comparison.
- `$frontend-performance-budget` — measured performance and explicit budgets.
- `$design-system-governance` — reuse, extension, token, variant, and API decisions.
- `$api-state-contracts` — backend contracts, fixtures, states, races, and rollback.
- `$frontend-pr-review` — read-only findings-first frontend review.

Wayfinder is intentionally manual-only. Invoke `$wayfinder` to chart a foggy effort or continue an existing map. It defaults to a concurrency-safe local Markdown tracker unless project policy or the user explicitly selects GitHub Issues; GitHub mutations are previewed before authorization. The self-contained adaptation preserves the pinned MIT provenance of [Matt Pocock's Wayfinder](https://github.com/mattpocock/skills/tree/main/skills/engineering/wayfinder).

## Validate locally

The toolkit has no package dependencies. Fallow is an external commit-time prerequisite for code changes; install the `fallow` CLI and the Codex `$fallow` skill in any environment that will create code commits.

```bash
node --test
node scripts/validate-toolkit.mjs
```

Before every commit containing code or code-affecting configuration, stage the coherent change and run the complete flow from that project root:

```bash
FALLOW_AGENT_SOURCE=codex fallow --format json --quiet --explain 2>/dev/null || true
```

Review the combined JSON envelope and block the commit for an unavailable/runtime-failing analyzer or an unresolved error-severity finding caused by the change. Documentation-only and policy-only commits are exempt. Rerun after any relevant edit; never use automatic fixes, suppressions, or `--no-verify` merely to pass.

## Task branches

Before the first edit for a new task, inspect the repository state and branch from the correct integration base. Follow the repository convention or use `ft/<short-kebab-case-task>` when none exists. Do not commit task work directly to the default branch without an explicit user exception, and do not carry unrelated dirty work across branches.

The official Codex skill and plugin validators are also run before release.

## Install the local plugin

From the repository root:

```bash
codex plugin marketplace add "$(pwd)"
codex plugin add engineering-workflows@engineering-workflows
```

Start a new Codex task after installation so the nine skills and Caveman's implicit activation are discovered.

## Sync policy into a project

Check whether a project has the current managed policy:

```bash
node scripts/sync-policy.mjs --target /absolute/path/to/project --check
```

Create or update only the managed policy block:

```bash
node scripts/sync-policy.mjs --target /absolute/path/to/project --apply
```

The synchronizer preserves all project-owned instructions outside the `engineering-workflows` markers. It migrates one valid legacy `frontend-workflows` block in place, and rejects filesystem roots, the home directory, missing paths, glob syntax, the toolkit itself, and malformed, mixed, or duplicate markers.

## Update a local installation

After changing and validating the plugin, use Codex's plugin cachebuster helper, then reinstall from the configured local marketplace:

```bash
python3 ~/.codex/skills/.system/plugin-creator/scripts/update_plugin_cachebuster.py plugins/engineering-workflows
codex plugin add engineering-workflows@engineering-workflows
```

Open a new Codex task after reinstalling. When this repository gains a remote, pull and validate changes before reinstalling or syncing policy.

## Repository boundaries

This repository intentionally contains no application code, MCP server, plugin hook, package dependency, generated report, or project-specific asset. Fallow remains an explicit external development prerequisite rather than a bundled runtime dependency.
