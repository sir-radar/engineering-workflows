# Contract inspection

Use evidence in this order unless repository policy defines a stricter source:

1. Backend implementation, validation, database mapping, and tests.
2. Versioned OpenAPI or GraphQL schema and generated client types.
3. Shared transport types actually used by both sides.
4. Captured local runtime responses and failure behavior.
5. Prose examples.

For each operation record:

- method or GraphQL operation, URL, variables, headers, authentication, and cancellation support;
- success and error status codes or GraphQL error shapes;
- payload schema, nullable and optional fields, enums, numeric encodings, timestamps, pagination, and ordering;
- empty semantics: no content, empty collection, null, unknown identifier, or filtered result;
- partial-data behavior, latency controls, rate limits, retries, and idempotency;
- shared identifiers and cache keys;
- contract owner and drift mechanism.

For GraphQL, model data and errors together; a response may contain both. For OpenAPI, inspect referenced schemas and runtime validation rather than only operation summaries.
