# 0008 - Go Backend Layout

## Status

Accepted

## Context

The bootstrap requires Go layout only for Mode B or Mode C.

## Decision

Do not create a Go backend in v1.

## Consequences

- No `cmd/`, `internal/`, `pkg/`, `api/`, `configs/`, or Go tooling exists.
- Backend-specific hooks and Docker targets are omitted.

## Alternatives Considered

- Add a no-op Go backend: rejected because it would be misleading and violate the GitHub Pages-first goal.
