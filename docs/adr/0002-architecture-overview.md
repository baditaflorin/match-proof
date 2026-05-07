# 0002 - Architecture Overview and Module Boundaries

## Status

Accepted

## Context

The app needs local profiles, private matching logic, peer transport, and UI states without a backend.

## Decision

Use the following frontend modules:

- `features/profile`: local profile schema, fixtures, IndexedDB persistence
- `features/matching`: normalization, Bloom filters, proof envelope protocol, worker client
- `features/webrtc`: manual offer/answer WebRTC data channel
- `features/insights`: local-only match summary adapter
- `components`: reusable UI pieces

The UI coordinates these modules but does not own protocol logic.

## Consequences

- Protocol functions can be unit-tested without rendering React.
- WebRTC remains replaceable if a future offline signaling method is added.
- Crypto/proof work can stay lazy-loaded behind user action.

## Alternatives Considered

- A single-page monolith: rejected because protocol and storage testing would be brittle.
- A backend service boundary: rejected by ADR 0001.
