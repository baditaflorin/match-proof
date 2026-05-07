# 0012 - Metrics and Observability

## Status

Accepted

## Context

Privacy-respecting matching should avoid tracking by default.

## Decision

Do not include analytics in v1. Show only local status indicators:

- current app version
- latest GitHub commit fetched from the public GitHub API
- local storage status
- peer connection status

## Consequences

- There are no user metrics, events, or beacons.
- Project popularity is visible only through GitHub stars.

## Alternatives Considered

- Plausible analytics: reasonable, but rejected for v1 to keep the privacy story sharper.
