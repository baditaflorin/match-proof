# 0001 - Deployment Mode

## Status

Accepted

## Context

Match Proof needs peer-to-peer proof-of-attribute matching for conference settings. The core privacy requirement is that no central service receives user profiles, credentials, interests, or matching transcripts.

## Decision

Use Mode A: Pure GitHub Pages.

The app is a static Vite build served from `main /docs` at:

https://baditaflorin.github.io/match-proof/

All runtime work happens in the browser:

- profile storage in IndexedDB
- proof and Bloom-filter work in a Web Worker
- WebRTC data channels for peer exchange
- local-only inference for match summaries

## Consequences

- No runtime backend, server database, Docker image, nginx, or server-side metrics are part of v1.
- No frontend secrets exist.
- WebRTC signaling is manual copy/paste or QR-friendly exchange because GitHub Pages cannot run a signaling server.
- Production credential trust is out of scope; v1 includes a demo BBS proof flow and a clear trust boundary.

## Alternatives Considered

- Mode B: Rejected because there is no public static dataset to prebuild.
- Mode C: Rejected because a runtime API would create the central surface the project is trying to avoid.
