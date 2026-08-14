# Decision methods

Use the method matching the ticket type. Every answer must state the decision or fact, evidence, constraints, rejected alternatives, uncertainty, and downstream consequence.

## Grilling

Use for a choice only the human can make.

1. State the decision and why later work depends on it.
2. Ask one to three high-leverage questions at a time. Prefer concrete alternatives and consequences over broad prompts.
3. Challenge conflicting constraints and undefined terms.
4. Summarize the proposed decision, assumptions, and rejected alternatives.
5. Ask the human to confirm or correct the summary. Do not resolve before confirmation.

Never answer the human's side yourself or turn implementation preferences into facts.

## Domain modeling

Use whenever vocabulary or boundaries influence the decision.

1. List domain terms and flag synonyms, overloaded words, and unnamed concepts.
2. Define each relevant term in observable language.
3. Record invariants, ownership, lifecycle, identity, and boundary crossings.
4. Test the model against one normal example and one edge case.
5. Put terminology decisions in the ticket answer; do not create a separate glossary unless the destination needs one.

## Research

Use for evidence that can be gathered without human judgment.

1. Define the exact question and the decision it blocks.
2. Prefer repository evidence and authoritative primary sources. Record versions and retrieval dates for unstable facts.
3. Separate observed facts, source-supported inference, and open uncertainty.
4. Compare viable alternatives against the map's constraints.
5. Resolve with a concise recommendation and direct source links.

When delegation is authorized, give a research agent only the ticket, map destination/Notes, repository path, and output contract. Do not leak a preferred answer. The parent session owns claim verification and tracker writes.

## Prototype

Use when reaction to a concrete artifact will resolve the question.

1. Name the hypothesis and the smallest artifact that can test it.
2. Set a time/effort ceiling and label the artifact disposable.
3. Avoid production integrations, migrations, polish, or irreversible data changes.
4. Show the artifact to the human and capture their reaction verbatim enough to support the decision.
5. Resolve with what the prototype demonstrated and what it did not prove.

Prototype code is not implementation. Do not merge or ship it without a separate execution task and normal quality gates.

## Task

Use only for a prerequisite action that exposes facts needed by another decision.

1. Explain why no decision can proceed without the action.
2. Prefer a reversible, least-privilege operation.
3. Request authority for external or consequential changes.
4. Record what changed, where, and the facts revealed.

Do not use task tickets as a disguised implementation backlog.
