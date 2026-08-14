# Accessibility defect severity

Rate impact first, then reach, frequency, workaround, and confidence.

| Level | Definition | Examples |
| --- | --- | --- |
| P0 Critical | Prevents access to a core task for an affected user group with no practical workaround or creates immediate serious harm | Keyboard trap in a required flow; destructive action without an accessible name or confirmation |
| P1 High | Fails an applicable A/AA criterion on a core or repeated journey and materially blocks or misleads users | Modal focus escapes; form errors are not programmatically associated; core control is pointer-only |
| P2 Medium | Applicable failure on a limited path or with a usable but burdensome workaround | Incorrect heading hierarchy; isolated non-text contrast failure; status update not announced |
| P3 Low | Best-practice or minor usability issue with limited impact; do not label a normative failure low solely because automation missed it | Redundant description; suboptimal but understandable announcement |

Every finding must include criterion, affected users, reproduction, evidence, file or component, remediation contract, and retest status. Do not lower severity because a fix is difficult.
