---
name: wayfinder
description: Plan efforts too large and uncertain for one agent task as a shared map of decision tickets, then resolve one decision at a time until implementation can be specified safely. Use only when the user explicitly invokes $wayfinder or /wayfinder for a foggy multi-session effort or supplies an existing Wayfinder map. Do not invoke automatically for a clear request, an implementation plan, or ordinary task tracking.
---

# Wayfinder

Turn uncertainty into decisions. Never implement the destination in a Wayfinder task. Prior user authorization may be recorded for the later execution handoff, but it does not collapse charting, ticket-resolution, or execution boundaries.

## Load the operating references

1. Read [decision-methods.md](references/decision-methods.md) before charting or resolving a ticket. It replaces upstream dependencies on separate grilling, domain-modeling, research, and prototype skills.
2. Select exactly one tracker adapter:
   - Read [github-tracker.md](references/github-tracker.md) only when repository policy or the user explicitly selects GitHub Issues.
   - Otherwise read [local-tracker.md](references/local-tracker.md) and use the repository-local Markdown fallback.
3. Treat the selected adapter's claim and event-ledger rules as mandatory. Do not improvise tracker mutations.

## Preserve the authority boundary

- Remain explicit-only. Never activate this skill merely because work is large.
- Treat GitHub issue creation, assignment, comments, labels, closure, and dependency changes as external writes. If the user's invocation did not explicitly request those writes, preview the proposed map and request approval before the first mutation.
- Default to the local tracker when no tracker is configured. Do not infer GitHub selection from a remote alone.
- Never delete, rewrite, or close unrelated tracker artifacts.
- Refer to maps and tickets by linked title in user-facing text, not a bare number.

## Use the Wayfinder model

- **Destination:** the observable point at which the effort is clear enough to hand off. State it in one or two sentences.
- **Map:** the canonical low-resolution index for one destination.
- **Decision ticket:** one precise question sized for one agent task. It resolves a decision, not a build slice.
- **Fog:** in-scope uncertainty that cannot yet be phrased as a precise ticket.
- **Frontier:** open, unblocked, unclaimed tickets.
- **Event ledger:** append-only claim, decision, fog, scope, and destination records. Dynamic map state lives here so concurrent tasks never rewrite each other's decisions.

Every ticket has one type:

- `research` — AFK evidence needed for a decision;
- `prototype` — HITL disposable artifact needed for informed reaction;
- `grilling` — HITL conversation needed to settle a choice;
- `task` — manual prerequisite that reveals facts needed for a later decision.

HITL means the human must provide their side. Never simulate their answer.

## Chart a map

1. **Name the destination.** Use the interview and domain-modeling methods. Establish scope, decision owner, constraints, success evidence, and explicit non-goals before creating tickets.
2. **Probe breadth-first.** Surface decisions across the whole effort before going deep. Separate precise questions from fog and out-of-scope work.
3. **Stop when a map is unnecessary.** If the path is already clear and fits one agent task, explain that Wayfinder adds no value and ask whether to hand off directly.
4. **Preview mutations.** Show the proposed map title, destination, initial ticket titles/types, dependencies, fog, tracker, and any external side effects.
5. **Create the map.** Record Destination, Notes, Initial fog, Out of scope, and the append-only event-ledger convention.
6. **Create every currently precise ticket.** Create tickets first, then add parent and blocking relationships in a second pass. Never encode a build checklist as decision tickets.
7. **Start authorized research only.** When subagents are available and repository/user instructions allow delegation, claim independent `research` tickets and dispatch one research agent per ticket. Otherwise leave them visible on the frontier. Do not dispatch HITL tickets.
8. **Stop.** Charting creates the map; it does not hand-resolve a ticket in the same task.

Do not treat “plan and then build,” execution authorization, or a Notes field as permission to bypass this stop. Finish the map, report its frontier, and require a fresh task to resolve a ticket.

## Work one ticket

1. Load the map body plus its event ledger. Do not preload every ticket.
2. Use the named ticket, or select the first frontier ticket in map order.
3. Create a stable session identifier and claim the ticket using the selected adapter. The claim must be the task's first tracker write.
4. Re-fetch all claim records and apply deterministic arbitration. If another active claim wins, release this claim and stop without working the ticket.
5. Treat an existing terminal resolution record as closed-for-claiming even when tracker closure or event bookkeeping is incomplete. Repair only that resolution's missing bookkeeping; never open a new claim.
6. Resolve the ticket with its matching method. Fetch related ticket detail only when needed.
7. Immediately before resolving, re-fetch the ticket, blockers, state, and claim records. Stop and reconcile if it is closed, terminally resolved, newly blocked, or owned by another session.
8. Record the full answer on the ticket, close it, and append one idempotent decision event to the map. Never rewrite a shared Decisions-so-far list.
9. Append events for newly visible fog, graduated fog, scope changes, or destination redraws. Create newly precise tickets in a create-then-wire pass.
10. Verify the written ticket, closure, decision event, and frontier. Report links and the next frontier without claiming it.
11. **End the task.** After resolving one non-research ticket, this task is spent. Bookkeeping for that resolution is allowed; claiming another ticket requires a fresh invocation.

## Handle concurrency

- Represent a claim with a unique session marker in addition to any tracker assignee.
- Let the earliest active claim win; break equal timestamps by the tracker record ID. Use `scripts/wayfinder-ledger.mjs` for GitHub comment arbitration.
- Re-verify ownership after claiming and immediately before resolution.
- Bind release and resolution records to the actor that created the winning claim. Ignore or reconcile terminal markers from a different actor.
- Never steal or delete an abandoned, malformed, or ownerless claim. Preserve it and require explicit reconciliation.
- Store map evolution as append-only, uniquely identified events. Duplicate event identifiers are invalid; repeated processing must be idempotent.
- Never update a map from a stale snapshot. The initial map body is immutable while tickets are active; append an event instead.
- If records conflict, preserve both, stop mutation, and report the reconciliation needed.

## Hand off a cleared map

Declare the route clear only when no frontier, blocked ticket, or in-scope fog remains. Produce:

- destination and scope boundary;
- linked decision index reconstructed from the event ledger;
- resolved risks and remaining assumptions;
- recommended execution entry point.

For frontend destinations, route execution in a fresh task to the narrowest applicable toolkit skill: `$figma-ui-implementation`, `$design-system-governance`, `$api-state-contracts`, `$frontend-accessibility-audit`, `$visual-regression`, or `$frontend-performance-budget`. Route final change review to `$frontend-pr-review`. Wayfinder does not approve or implement its own destination.

## Attribution

This workflow adapts Matt Pocock's Wayfinder at the pinned revision recorded in [LICENSE](LICENSE). Preserve that file when copying or redistributing this skill.
