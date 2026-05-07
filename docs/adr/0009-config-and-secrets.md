# 0009 - Configuration and Secrets Management

## Status

Accepted

## Context

Mode A should not require runtime secrets.

## Decision

Use public Vite build-time variables only. Commit `.env.example` with non-secret placeholders. Reject any design that places API keys, private issuer keys, or service credentials in the frontend.

## Consequences

- The app can be forked and deployed without secret setup.
- Git hooks include gitleaks when available.
- Credential issuer keys in v1 are demo-only and generated locally in-browser.

## Alternatives Considered

- Encrypted secrets in the frontend: rejected because obfuscation does not make a browser secret.
