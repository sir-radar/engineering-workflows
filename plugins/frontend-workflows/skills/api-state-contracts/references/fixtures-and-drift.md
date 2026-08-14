# Deterministic fixtures and contract drift

Prefer the repository's existing interception layer. Use MSW for reusable unit/component integration fixtures and Playwright routing for browser-level transport behavior when already present.

Fixtures must be named by contract state and contain only intentional fields. Cover realistic short, long, missing, boundary, invalid, and large values. Freeze time and generated identifiers. Do not call external services from deterministic tests.

Keep these layers distinct:

- valid transport fixtures that conform to the backend schema;
- deliberately malformed fixtures used to test boundary rejection;
- normalized domain fixtures used below the transport adapter.

Contract-drift options, strongest applicable first:

1. Generate client types from versioned OpenAPI or GraphQL schema and fail CI on an uncommitted diff.
2. Validate checked-in fixtures against the canonical schema.
3. Run consumer contract tests against the backend in CI.
4. Compare shared type or schema package versions and fail incompatible changes.

Do not regenerate and commit contract changes automatically without review. A changed schema must update normalization, fixtures, state decisions, and tests together.
