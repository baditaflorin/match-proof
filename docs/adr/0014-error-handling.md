# 0014 - Error Handling Conventions

## Status

Accepted

## Context

The app handles local storage, crypto worker, WebRTC, QR/copy exchange, and public metadata fetches.

## Decision

Use typed result objects at protocol boundaries and throw only for unexpected programming failures. UI actions catch errors and show a concise toast with a recoverable next action.

## Consequences

- Invalid peer envelopes do not crash the app.
- Storage and WebRTC failures remain visible to users.
- Tests cover malformed Bloom/proof inputs.

## Alternatives Considered

- Silent fallbacks: rejected because privacy and crypto UX need clear state.
