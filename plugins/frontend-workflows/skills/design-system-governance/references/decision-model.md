# Reuse, extend, or create

Score evidence, not preference.

## Reuse

Choose reuse when the component has the same semantic responsibility, interaction model, accessible role, state machine, content model, and design geometry. Configuration must use existing public concepts rather than CSS overrides or consumer-specific branching.

## Extend

Choose extension when the new variant is a coherent member of the existing concept and can preserve existing defaults. Prefer explicit discriminated variants or slots over interacting boolean props. Verify every consumer and document the new supported contract.

## Create locally

Choose a local component when the design represents a different semantic concept, the shared API would gain one-off props, the required behavior conflicts with existing consumers, or only one ownership context exists.

## Create shared

Create a new shared component only when ownership, consumers, API, tokens, variants, examples, and accessibility behavior are stable enough to support independent use. A second concrete consumer is strong promotion evidence.

Reject wrapper components that merely rename another API without hiding meaningful complexity.
