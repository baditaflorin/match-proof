# Match Proof

Live GitHub Pages site:

https://baditaflorin.github.io/match-proof/

Repository:

https://github.com/baditaflorin/match-proof

Support:

https://www.paypal.com/paypalme/florinbadita

Privacy-preserving peer matching for shared attributes using browser crypto, WebRTC, Bloom filters, and local inference.

![Match Proof demo screenshot](docs/screenshot.png)

Match Proof is a static GitHub Pages app. It keeps profiles on-device, connects peers directly, and surfaces only verified shared attributes. V1 uses a real browser BBS signature proof path for requested candidate matches, session-specific Bloom filters for set intersection, WebRTC data channels for peer exchange, and a local-only insight adapter.

## Quickstart

```sh
npm install
make install-hooks
make dev
make test
make smoke
```

## Architecture

```mermaid
flowchart LR
  A["Phone A browser"] <-- "WebRTC data channel" --> B["Phone B browser"]
  A --> IA["IndexedDB profile store"]
  B --> IB["IndexedDB profile store"]
  A --> WA["Crypto worker"]
  B --> WB["Crypto worker"]
  GP["GitHub Pages static assets"] --> A
  GP --> B
```

The project is Mode A: Pure GitHub Pages. There is no runtime backend, no server-side database, and no frontend secret.

## Documentation

- Architecture: `docs/architecture.md`
- ADRs: `docs/adr/`
- Deploy guide: `docs/deploy.md`
- Privacy: `docs/privacy.md`
- Postmortem: `docs/postmortem.md`

## Validation

```sh
make lint
make test
make smoke
npm audit --audit-level=high
```
