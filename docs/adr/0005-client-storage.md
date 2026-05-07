# 0005 - Client-Side Storage Strategy

## Status

Accepted

## Context

Profiles should survive page reloads while staying on-device.

## Decision

Use IndexedDB through the `idb` library. Keep only user-entered profile attributes, local preferences, and demo issuer material generated in-browser.

## Consequences

- No account or cross-device sync exists in v1.
- Users can clear local data from the app.
- Storage failures surface as UI errors rather than silent loss.

## Alternatives Considered

- `localStorage`: rejected because profiles are structured and can grow.
- OPFS: unnecessary for v1 profile sizes.
