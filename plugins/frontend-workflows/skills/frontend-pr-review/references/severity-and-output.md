# Review severity and output

| Level | Meaning |
| --- | --- |
| P0 Critical | Merge would create severe security, data-loss, transaction, or broad availability harm with no safe workaround |
| P1 High | Core behavior is incorrect, inaccessible, insecure, stale, or materially incomplete; merge must be blocked |
| P2 Medium | Real defect in a limited path or meaningful maintainability/regression risk with a practical workaround |
| P3 Low | Small but actionable correctness or maintainability issue; omit style preference and speculative cleanup |

A finding must be introduced or exposed by the reviewed change, actionable in the current scope, and supported by a concrete failing scenario. Keep line ranges tight and title the consequence, not the code smell.

Output order:

1. Findings ordered P0 to P3.
2. Questions only when an unresolved fact changes the verdict.
3. Compact verification and residual-risk summary.
4. Verdict.

If no findings exist, write `No actionable findings.` and report only meaningful unverified areas.
