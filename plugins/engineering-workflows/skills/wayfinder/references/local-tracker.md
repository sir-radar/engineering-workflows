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

<constraints, decision owner, methods, execution override if any>

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

1. Re-verify the lock, ticket state, and blockers.
2. Append `## Answer` to the ticket and change only its own `Status:` to `resolved`.
3. Create the decision event with exclusive semantics.
4. Rename the lock directory to `claims/<ticket-number>.resolved-<UTC>-<session>/`.
5. Re-read the ticket, event, and frontier.

The decision event is canonical if the process stops between ticket resolution and lock archival. Repair missing archival as bookkeeping; never resolve another ticket in the same task.
