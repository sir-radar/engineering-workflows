# Frontend state completeness

Evaluate these states independently for every resource and mutation:

| Category | States |
| --- | --- |
| Initial | idle when meaningful, initial loading, success |
| Refresh | background loading with retained data, refresh success, refresh failure |
| Content | empty, partial, missing optional values, single item, large result |
| Invalid | malformed envelope, unusable item, invalid number/date/enum, schema mismatch |
| Transport | offline, network failure, timeout, aborted request, relevant HTTP status |
| Identity | unknown identifier, forbidden resource, stale/deleted resource |
| Concurrency | rapid input changes, out-of-order responses, deduplication, unmount/navigation |
| Recovery | local retry, retry failure, eventual success, cache revisit |
| Mutation | pristine, editing, invalid, submitting, success, failure, rollback, server conflict |

For each state record fixture, expected retained data, visible message or fallback, control availability, accessibility announcement, retry behavior, and test level.

Do not collapse semantically different states merely because they share visual styling. Do not invent new messages when product copy is governed by design or requirements.
