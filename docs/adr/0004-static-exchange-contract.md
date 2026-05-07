# 0004 - Static Exchange Contract

## Status

Accepted

## Context

Mode A has no server API. Peers still need a stable data contract for local exchange.

## Decision

Use versioned JSON envelopes over WebRTC:

- `hello`: session id, profile label, Bloom filter parameters, filter bits, nonce, protocol version
- `proof-request`: requested session digests that passed the local Bloom filter
- `proof-response`: BBS selective disclosure proof packets and constraint proof envelopes
- `match-summary`: optional local-only summary metadata

Protocol version: `match-proof.exchange.v1`.

## Consequences

- Breaking protocol changes require a version bump.
- No raw profile attributes are sent in `hello`.
- BBS proof packets are generated only for candidate matches requested by the peer.

## Alternatives Considered

- REST/OpenAPI contract: rejected because there is no runtime API.
- Static JSON dataset: rejected because user profiles are private and local.
