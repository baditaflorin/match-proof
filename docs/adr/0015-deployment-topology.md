# 0015 - Deployment Topology

## Status

Accepted

## Context

Mode C topology is not needed.

## Decision

Deploy only static files through GitHub Pages:

https://baditaflorin.github.io/match-proof/

There is no `deploy/` directory, Docker Compose stack, nginx config, Prometheus, or server runbook.

## Consequences

- Operational rollback is a git revert and push.
- No server backup plan is needed because v1 has no server-side state.

## Alternatives Considered

- Docker backend with signaling: rejected by ADR 0001.
