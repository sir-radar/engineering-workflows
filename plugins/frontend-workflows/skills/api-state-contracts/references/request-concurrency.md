# Requests, cancellation, and stale responses

- Include every request-defining input in the query or cache key.
- Pass `AbortSignal` through the transport when supported. Treat abort as superseded work, not a user-facing failure.
- When cancellation cannot stop the underlying request, compare a request generation or key before committing its result.
- Preserve previous valid data during a background refetch when the product contract permits it; expose a local refresh indicator.
- Deduplicate identical in-flight requests when the query layer supports it.
- Bound automatic retries and exclude non-transient failures. Avoid retry storms across independent resources.
- Clear timers, subscriptions, observers, and stream readers on unmount or key change.

Test last-choice-wins deterministically: delay request A, issue request B, resolve B, then resolve A. The UI and accessible status must still represent B. Repeat for navigation and token or filter changes.
