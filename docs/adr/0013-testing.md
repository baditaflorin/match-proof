# 0013 - Testing Strategy

## Status

Accepted

## Context

The app needs fast local validation without GitHub Actions.

## Decision

Use:

- Vitest for unit tests
- Playwright for one browser smoke path
- `scripts/smoke.sh` to build, serve `docs/`, and run Playwright
- local git hooks for pre-commit and pre-push checks

## Consequences

- `make test` and `make smoke` are the core validation commands.
- No CI files are added.

## Alternatives Considered

- GitHub Actions: rejected by the bootstrap constraints.
