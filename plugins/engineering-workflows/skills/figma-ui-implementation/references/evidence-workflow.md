# Evidence workflow

## Source precedence

Use repository policy when it defines a stricter order. Otherwise resolve conflicts through:

1. Current explicit user requirements and corrections.
2. Exact target Figma nodes, properties, variables, constraints, and prototype behavior.
3. Supplied reference images at their identified viewport and state.
4. Supplied Figma layer CSS.
5. Exported authoritative assets and fonts.
6. Backend/runtime contracts and required product behavior.
7. Existing repository components, tokens, architecture, and conventions.
8. Official framework documentation for implementation mechanics.

Never average conflicting values. Determine whether the conflict is a state, variant, breakpoint, mode, or stale artifact.

## Ambiguity

- **Blocking:** changes behavior, content, asset identity, data contract, semantics, or material layout. Ask before implementing that portion.
- **Verifiable:** resolve through Figma, files, code, runtime, tests, or official docs.
- **Incidental:** internal implementation with no observable effect. Follow the narrowest repository convention.

## Acceptance traceability

Map each acceptance item to evidence, implementation owner, state coverage, test, viewport, and final result. An evidence manifest is a working artifact; commit it only when repository policy requests durable design documentation.
