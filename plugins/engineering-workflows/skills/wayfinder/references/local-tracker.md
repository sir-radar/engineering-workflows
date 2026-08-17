# Local Markdown tracker adapter

Use this dependency-free fallback when no external issue tracker is explicitly configured. Store artifacts under `.scratch/wayfinder/<effort-slug>/` unless repository policy names another scratch location.

## Layout

```text
.scratch/wayfinder/<effort>/
├── map.md
├── tickets/
│   └── 01-ticket-title.md
├── claims/
│   └── 01.lock/
│       └── owner.md
└── events/
    └── 20260814T120000Z-session-decision-01.md
```

Keep `map.md` immutable while tickets are active. Put decisions, fog changes, scope changes, and destination redraws in uniquely named event files so concurrent tasks never rewrite a shared index.

## Map and ticket shape

Create `map.md` with:

```markdown
## Destination

<observable end state>

## Notes

<constraints, decision owner, methods, and prior execution authorization for later handoff if any>

## Initial fog

<uncertainty not yet precise enough for tickets>

## Out of scope

<explicit boundaries>

## Event ledger

Dynamic decisions, fog changes, and scope changes are append-only files under events/.
```

Create each ticket with these fields and heading:

```markdown
Type: research | prototype | grilling | task
Status: open | resolved
Blocked by: 01, 02

## Question

<one precise decision or investigation>
```

An empty `Blocked by:` value means unblocked. The frontier is every `Status: open` ticket whose blockers are resolved and whose numbered lock directory does not exist, sorted by ticket number.

## Atomic claims

1. Re-read the ticket and blockers.
2. Atomically create `claims/<ticket-number>.lock/` with `mkdir`. A successful creation owns the claim; an existing directory loses the claim.
3. Add `owner.md` inside the new directory with the session ID, UTC timestamp, ticket path, and task/thread identifier when available.
4. Re-read `owner.md` and the ticket immediately before resolution. Continue only when both still match this session and blockers remain resolved.
5. To release without resolving, rename the lock directory to `claims/<ticket-number>.released-<UTC>-<session>/`. Do not delete claim history.

Never create the lock with a read-then-write sequence; the directory creation itself is the arbitration primitive.

If a process stops after `mkdir` but before writing a valid `owner.md`, treat the ownerless or malformed lock as a blocking claim. Never delete, replace, age out, or steal it automatically. Rename it to a released record only after explicit reconciliation establishes that no claimant can still be running.

## Append-only events

Use a filename containing UTC time, session ID, kind, and ticket number. Create with exclusive semantics and never overwrite:

```markdown
Event: decision | fog-add | fog-graduate | scope-out | destination-redraw
Event ID: decision-<effort>-<ticket-number>
Ticket: tickets/01-ticket-title.md
Recorded at: <ISO 8601 UTC>

## Summary

<one-line gist>

## Detail

<answer link, newly visible fog, or scope change>
```

Before appending, search all event files for the Event ID. Identical content is idempotent success; different content is a conflict and must stop for reconciliation.

## Resolution

1. Re-verify the lock owner, ticket state, blockers, and absence of an existing decision event.
2. Append the complete `## Answer` and change only the ticket's own `Status:` to `resolved`.
3. Create the decision event with exclusive semantics.
4. Rename the lock directory to `claims/<ticket-number>.resolved-<UTC>-<session>/`.
5. Re-read the ticket, event, archived lock, and frontier.

The resolved ticket and complete answer are canonical. If the process stops after that write, repair a missing decision event and lock archival idempotently from the ticket answer. If the ticket is still open or its answer is incomplete, preserve all records and stop for reconciliation. Never resolve another ticket while repairing bookkeeping.
