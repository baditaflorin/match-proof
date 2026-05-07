# 0017 - Dependency Policy

## Status

Accepted

## Context

The project handles privacy-sensitive local matching, so dependencies should be boring and maintained.

## Decision

Use production-ready libraries for framework, storage, proof primitives, QR encoding, and tests. Avoid unmaintained packages and run `npm audit --audit-level=high` before releases.

## Consequences

- The app uses `@digitalbazaar/bbs-signatures` instead of hand-rolled BBS logic.
- The Bloom filter is local typed-array code because the algorithm is small, testable, and avoids shipping a large set library.
- Any high or critical audit finding blocks release unless documented with an accepted mitigation.

## Alternatives Considered

- Custom crypto: rejected.
- Larger ZK and LLM runtimes in the initial bundle: rejected for the asset budget.
