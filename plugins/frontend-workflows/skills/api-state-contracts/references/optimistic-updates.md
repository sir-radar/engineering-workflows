# Optimistic mutation contract

Use optimistic UI only when the action is reversible, the expected result is sufficiently predictable, and temporary divergence will not create harmful user decisions.

1. Capture the exact previous cache and UI state.
2. Cancel or isolate conflicting refetches.
3. Apply a uniquely identifiable optimistic record or patch.
4. Prevent unintended duplicate submission while preserving deliberate repeated actions.
5. On success, reconcile with authoritative server data rather than assuming the optimistic shape is final.
6. On failure or abort, restore the previous state and announce the failure without losing user input.
7. On conflict, expose the authoritative state and a product-approved recovery path.

Test success, failure rollback, out-of-order mutations, duplicate attempts, navigation during mutation, and a refetch arriving between optimistic apply and resolution.
