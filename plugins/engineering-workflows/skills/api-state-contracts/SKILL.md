---
name: api-state-contracts
description: Turn backend OpenAPI, GraphQL, shared types, and runtime behavior into validated frontend contracts, deterministic fixtures, complete UI states, cancellation and stale-response tests, optimistic rollback, and contract-drift gates. Use when implementing or reviewing data-backed UI, API integrations, loading or error resilience, request races, malformed data handling, offline behavior, or mutation workflows.
---

# API State Contracts

Treat every endpoint or operation as an independent resource whose contract includes transport, payload validity, timing, concurrency, and visible UI behavior.

## Workflow

1. Identify canonical backend evidence with [contract-inspection.md](references/contract-inspection.md). Inspect implementation and runtime behavior, not prose alone.
2. Define transport types separately from normalized domain types. Validate untrusted data at the frontend boundary when the backend contract can drift or cross a trust boundary.
3. Build `assets/api-state-matrix.md` with [state-matrix.md](references/state-matrix.md). Mark every state implemented, not applicable with evidence, or blocked.
4. Create deterministic fixtures and interceptors with [fixtures-and-drift.md](references/fixtures-and-drift.md). Adapt `assets/msw-handlers.ts` or `assets/playwright-network.ts` to the repository's existing tools.
5. Implement independent query state, local retry, cancellation, and last-choice-wins behavior using [request-concurrency.md](references/request-concurrency.md).
6. For mutations, read [optimistic-updates.md](references/optimistic-updates.md) and prove rollback, duplicate-submit prevention, and server reconciliation.
7. Test success, empty, partial, malformed, slow, offline, network failure, relevant HTTP failures, retry, cancellation, and stale responses. Verify visible behavior and retained data.
8. Add a contract-drift gate tied to the canonical schema, generated types, or fixture validation.
9. Produce `assets/api-contract-report.md` with evidence, state coverage, requests, validation, tests, and drift policy.

## Boundary rules

- Never cast an unknown payload into the desired type without validation or authoritative generated guarantees.
- Normalize once at the transport boundary. Do not scatter timestamp, number, enum, or null handling through components.
- Do not fabricate market, account, or business values to make missing payload fields render.
- Preserve usable data when an independent resource fails. Scope errors and retries to their owner.
- Key caches by every input affecting the result. Ignore or cancel obsolete responses so the last user choice wins.
- Render explicit missing values instead of `NaN`, `undefined`, invalid dates, or misleading zeroes.

## Completion gate

The implementation is incomplete while a real backend outcome has no intentional UI treatment or deterministic test. Record unknown contract behavior as a blocker rather than inventing it.
