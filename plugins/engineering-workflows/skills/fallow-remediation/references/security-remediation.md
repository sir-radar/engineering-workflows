# Security remediation

Treat `fallow security` output as candidate evidence, not a verified vulnerability and not an automatic patch specification. Trace attacker-controlled input to the reported sink, identify sanitizers and trust boundaries, reproduce the unsafe path when practical, and examine unresolved edges before deciding.

## Required scan

Run security separately because the bare combined Fallow command does not include it:

```bash
git diff --cached --unified=0 | FALLOW_AGENT_SOURCE=codex fallow security --diff-file - --format json --quiet 2>/dev/null || true
```

Require a valid security envelope. Record categories run, files analyzed, findings, `unresolved_edge_files`, `unresolved_callee_sites`, confidence limits, and any category excluded by configuration or unsupported by the installed version.

Ordinary security categories run through `fallow security`. The `hardcoded-secret` and `secret-to-network` categories require explicit inclusion in supported Fallow configuration. Check whether the repository enables them. Before editing categories, run `fallow schema` and read its current `security_categories` list. An `include` list is a whitelist: when none exists, enumerate every schema-admitted ordinary category plus the two include-required categories so enabling secret detection does not disable other coverage. When an include list already exists, preserve its entries and add the two names; preserve every exclusion and unrelated setting. Edit repository-owned configuration only when authorized, and never overwrite or create it merely to pass this gate. If either category is not enabled, record the coverage gap and use repository secret scanning where available.

## Candidate disposition

For each staged candidate:

1. Identify the exact source, transformations, sanitizer or validator, sink, runtime reachability, authorization boundary, and affected user or data class.
2. Mark it verified, false positive with evidence, or unresolved. “Probably safe” is unresolved.
3. Fix verified findings in task-owned code, add a focused regression test, and rerun the relevant security and behavior checks.
4. Keep the candidate blocking when safe remediation needs product behavior, schema, infrastructure, credential, or third-party changes outside current authority.
5. Use a narrow suppression only for a proven false positive when repository policy authorizes it. Record why the reported flow is impossible or safely neutralized; never suppress an unresolved candidate.

## Remediation patterns

Choose the narrowest fix that removes the unsafe data flow while preserving intended behavior:

| Concern | Preferred remediation | Required verification |
| --- | --- | --- |
| DOM or HTML injection | Render text, use framework escaping, or apply an established context-aware sanitizer at the boundary | Malicious markup remains inert; intended formatting and accessibility remain intact |
| URL, redirect, or navigation injection | Parse with the platform URL API and enforce explicit scheme, host, and destination allowlists | Encoded, mixed-case, protocol-relative, and malformed bypasses fail closed |
| Command or process injection | Use argument-vector APIs without a shell and allowlist command choices and argument shapes | Metacharacter payloads remain data; permitted command behavior still works |
| Path traversal | Resolve against an approved root, reject absolute and escaping paths, and account for symlinks where relevant | Encoded traversal, separators, and alternate path forms cannot escape the root |
| SQL or query injection | Use parameterized queries or typed query builders; allowlist identifiers that cannot be parameters | Payloads cannot alter query structure; authorization and result behavior remain intact |
| Prototype pollution or unsafe object merge | Accept explicit keys, reject dangerous property names, and use safe object construction | `__proto__`, `constructor`, and nested variants cannot mutate prototypes |
| Dynamic code execution | Replace `eval`, generated functions, or dynamic module selection with explicit mappings or parsers | Untrusted strings never become executable code |
| Insecure randomness | Use the platform cryptographic RNG for tokens, secrets, nonces, and security decisions | Output length, encoding, collision expectations, and consuming contracts remain valid |
| Weak or misused cryptography | Use repository-approved modern primitives and libraries with correct modes, nonces, and key handling | Compatibility, stored-data migration, and known failure cases are tested |
| Hardcoded secret | Remove the value from code and history exposure, load it through the approved secret mechanism, and scope access | Secret scanning passes; startup failure is explicit when configuration is absent |
| Secret sent to network | Remove the flow, constrain destination and payload, and enforce server-side trust boundaries | Network inspection proves the secret is absent from URLs, logs, analytics, and unapproved requests |

## Credential response

Deleting a hardcoded credential does not invalidate a leaked value. Report the exact credential class and exposure evidence without repeating the secret. Rotation, revocation, audit-log review, or history rewriting may require user approval or external authority; keep that follow-up explicit and blocking when the credential remains usable.

## Security completion threshold

The staged security gate passes only when every candidate is fixed and retested or disproven with concrete evidence, relevant blind spots are resolved or shown not to intersect the staged flow, and the final scan covers the final staged diff. A zero-finding envelope with unresolved staged edges is not automatically clean.
