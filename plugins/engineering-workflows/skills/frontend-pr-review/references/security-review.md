# Frontend security review

Inspect changed trust boundaries using applicable OWASP guidance and repository policy.

- Trace untrusted HTML, URLs, CSS, SVG, Markdown, JSON, query parameters, storage, messages, and API data to their sinks.
- Reject unsafe `innerHTML`, HTML insertion, dynamic script execution, string-built event handlers, and unvalidated URL schemes.
- Check reverse tabnabbing, opener access, iframe sandboxing, cross-origin messaging origin and source validation, and sensitive referrer leakage.
- Verify authentication and authorization are enforced by the backend; hidden or disabled UI is not access control.
- Check CSRF protections for cookie-authenticated mutations, credential modes, and state-changing GET requests.
- Avoid secrets, access tokens, personal data, internal payloads, and stack traces in client bundles, logs, analytics, errors, or URLs.
- Validate upload type and size on the server; treat client validation as usability only.
- Inspect dependency additions and lockfile changes for unexpected packages, install scripts, or duplicate vulnerable versions.
- Ensure static visual trading, payment, wallet, or destructive controls have no hidden side effects when scope says nonfunctional.

Do not report generic security advice without a changed code path and plausible impact.
