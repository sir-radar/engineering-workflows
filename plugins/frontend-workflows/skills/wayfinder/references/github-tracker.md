# GitHub tracker adapter

Use this adapter only when GitHub Issues is explicitly configured. Use `gh` from the target repository and pass `--repo OWNER/REPO` when repository inference could be ambiguous.

Authoritative mechanics: [GitHub CLI issue creation](https://cli.github.com/manual/gh_issue_create) and [GitHub issue-dependency API](https://docs.github.com/en/rest/issues/issue-dependencies).

## Preflight and authority

1. Run `gh auth status` and `gh repo view --json nameWithOwner,url` read-only.
2. Confirm issue-write permission before promising mutation.
3. Preview every issue title/type, parent relation, dependency, label, assignment, and closure.
4. If the user did not explicitly authorize GitHub writes, request approval once for the previewed batch.
5. Create missing `wayfinder:map` and `wayfinder:<type>` labels only within that approved batch.

Use temporary body files for multiline content; do not interpolate untrusted text into shell commands.

## Map and ticket shape

Create one map issue labelled `wayfinder:map`. Keep its body immutable while tickets are active:

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

Dynamic decisions, fog changes, and scope changes are append-only marker comments on this issue.
```

Create each ticket with label `wayfinder:<type>` and body:

```markdown
## Question

<one precise decision or investigation>
```

Prefer `gh issue create --parent <map> --blocked-by <numbers>` when the installed CLI supports those flags. Otherwise create all issues first, add sub-issue relationships through the GitHub API, and add dependencies with:

```text
POST repos/OWNER/REPO/issues/CHILD/dependencies/blocked_by
{"issue_id": BLOCKER_DATABASE_ID}
```

Use the blocker's numeric database `id`, not its issue number or GraphQL `node_id`. Fall back to a `Blocked by: #N` body line only when native dependencies are unavailable.

## Claims

Create one stable session ID for the task. Prefer a host task/thread ID; otherwise generate a random 12-hex suffix and prefix it with the UTC timestamp.

1. Re-fetch issue state, blockers, assignees, and all comments.
2. If no active claim exists, assign `@me` when supported and post exactly one marker comment:

   ```markdown
   <!-- wayfinder:claim session=SESSION_ID -->
   Claimed by this Wayfinder task at ISO_8601_UTC.
   ```

3. Fetch comments with creation timestamps and IDs into JSON.
4. Run `node scripts/wayfinder-ledger.mjs --input COMMENTS_JSON --session SESSION_ID` from the Wayfinder skill directory.
5. Continue only when `callerOwnsClaim` is `true`. The earliest active claim wins; comment ID breaks an equal timestamp.
6. To abandon a claim, append `<!-- wayfinder:release session=SESSION_ID -->`. Do not unassign a shared human identity when another session may own the issue.
7. Before resolution, repeat steps 1, 3, and 4 and verify the issue is open and unblocked.

## Resolution and map events

Post the complete ticket answer with one terminal claim marker, then close the ticket:

```markdown
<!-- wayfinder:resolved session=SESSION_ID -->
## Answer

<decision, evidence, rejected alternatives, uncertainty, and consequence>
```

Append one decision event to the map:

```markdown
<!-- wayfinder:event id=EVENT_ID kind=decision ticket=ISSUE_NUMBER -->
<linked ticket title> — one-line decision gist.
```

Use a stable event ID derived from the resolved ticket, such as `decision-<repo>-<issue-number>`. Search existing map comments for that ID before appending. If it already exists with identical content, treat the operation as complete; if content differs, stop for reconciliation.

Represent other changes as unique append-only events with `kind=fog-add`, `fog-graduate`, `scope-out`, or `destination-redraw`. Reconstruct the map from its initial body plus ordered event comments. Never rewrite a shared Decisions-so-far section.

After writing, re-fetch the ticket and map comments. Verify the answer, closure, unique decision event, and resulting frontier before reporting success.
