# 0006 - WASM and Proof Modules

## Status

Accepted

## Context

The original concept mentions BBS+ signatures, zk-SNARKs, Bloom filters, WebRTC, and a local LLM. GitHub Pages cannot set arbitrary COOP/COEP headers and the first-load bundle must remain small.

## Decision

Use JavaScript/WASM-friendly browser modules lazily:

- BBS signatures: `@digitalbazaar/bbs-signatures`
- Hashing and Bloom filters: browser `crypto.subtle` plus local typed-array logic
- Worker bridge: Comlink
- ZK constraints: v1 implements a typed proof envelope and verifier adapter for constraint transcripts, with the ADR and UI marking it as a prototype SNARK boundary, not an audited Groth16/Plonk circuit
- Local LLM: browser-local insight adapter, using available browser AI APIs when present and a deterministic offline fallback otherwise

## Consequences

- No COOP/COEP dependency is required for v1.
- Heavy proof code is lazy-loaded behind matching actions.
- The app does not overclaim audited zk-SNARK security.

## Alternatives Considered

- Bundle `snarkjs` and circuit artifacts: rejected for v1 because proving keys would dominate the asset budget and require a trusted setup workflow.
- Runtime backend proving service: rejected by ADR 0001.
