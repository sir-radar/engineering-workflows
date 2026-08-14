# WCAG 2.2 A and AA applicability

Normative source: [WCAG 2.2](https://www.w3.org/TR/WCAG22/). Use the latest published Recommendation and linked Understanding documents. Do not test obsolete 4.1.1 Parsing as a WCAG 2.2 success criterion.

Assess the full A/AA set. Prioritize these frontend-sensitive groups without treating this list as exhaustive:

| Area | Criteria commonly applicable to frontend changes |
| --- | --- |
| Text and media | 1.1.1; 1.2.x when media exists; 1.4.5 |
| Structure | 1.3.1–1.3.5; 2.4.1–2.4.7; 2.4.11; 2.4.2 page title |
| Color and layout | 1.4.1; 1.4.3; 1.4.10–1.4.13; 1.4.11 non-text contrast; 1.4.12 text spacing |
| Keyboard and focus | 2.1.1–2.1.2; 2.1.4; 2.4.3; 2.4.7; 2.4.11 |
| Timing and motion | 2.2.1–2.2.2; 2.3.1; 2.3.3; 2.5.4 |
| Pointer and targets | 2.5.1–2.5.3; 2.5.7 dragging; 2.5.8 target size |
| Predictability | 3.2.1–3.2.6 |
| Forms and authentication | 3.3.1–3.3.8 as the workflow requires |
| Name, role, value | 4.1.2; 4.1.3 status messages |

For each applicable criterion record:

- interface scope and state;
- test method;
- browser, viewport, and assistive technology when relevant;
- observed evidence;
- pass, fail, or blocked result;
- defect ID and retest result.

Automated coverage cannot prove keyboard operation, meaningful reading order, good names, focus management, reflow usability, error recovery, or announcements.
