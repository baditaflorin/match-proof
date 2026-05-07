# 0011 - Logging Strategy

## Status

Accepted

## Context

Mode A has no server-side logs.

## Decision

Use minimal browser console logging in development only. Production errors are surfaced through the UI error toast and component state.

## Consequences

- No PII or profile attributes are logged intentionally.
- Debugging production issues relies on user-provided reports and reproducible local state.

## Alternatives Considered

- Remote client logging: rejected to preserve the privacy posture.
