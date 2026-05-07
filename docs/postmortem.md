# Postmortem

## What Was Built

Match Proof v0.1.0 is a Mode A GitHub Pages app at:

https://baditaflorin.github.io/match-proof/

It includes:

- local profile editing and IndexedDB persistence
- session-specific Bloom filter set intersection
- BBS selective disclosure proof packets generated and verified in a Web Worker
- a prototype ZK constraint envelope that clearly marks the v1 SNARK boundary
- WebRTC manual offer/answer data-channel exchange
- local-only match insight summaries
- GitHub and PayPal links in the app header
- visible app version and latest public GitHub commit
- PWA manifest and service worker
- ADRs, privacy docs, deploy docs, hooks, unit tests, and Playwright smoke test

## Was Mode A Correct?

Yes. In hindsight, Mode A was the right choice. The v1 product does not need accounts, a server database, backend secrets, or centralized signaling. Manual WebRTC signaling is less polished than hosted signaling, but it preserves the core privacy posture and keeps the live public surface static.

## What Worked

- GitHub Pages was enabled from the first commit.
- The built app stayed under the initial JavaScript budget before lazy worker proof work.
- The local demo exercises the proof path end to end in Chromium.
- Public GitHub metadata is enough to show the current commit without embedding secrets.

## What Did Not Work

- GitHub Pages cannot set custom COOP/COEP headers, so v1 avoids proof systems that require those headers.
- A full zk-SNARK circuit with proving keys would be too large and too much ceremony for the first static release.
- WebRTC without a signaling server requires copy/paste or QR-style exchange.

## Surprises

- The maintained `@digitalbazaar/bbs-signatures` package was cleaner for audit posture than the WASM BBS package initially considered.
- Vite's `emptyOutDir: false` is necessary because documentation and Pages output share `docs/`, but it required a custom generated-asset clean step.

## Accepted Tech Debt

- The ZK layer is a typed prototype constraint envelope, not a production Groth16/Plonk proof.
- Credential issuer trust is demo-only; real issuers, revocation, and trust registries are future work.
- WebRTC signaling is manual; a future optional static-friendly relay or QR-first UX would improve ergonomics.

## Next Improvements

1. Add real issuer import for BBS credentials and revocation metadata.
2. Replace the prototype ZK envelope with a small audited circuit once proving assets can stay lazy and cacheable.
3. Add QR scanning for offer/answer exchange on mobile.

## Time Spent vs Estimate

Estimated: 4 to 6 hours for a static prototype with tests and docs.

Actual: roughly 3 hours in this build session, with most time spent on proof integration, smoke testing, and Pages-safe build output.
