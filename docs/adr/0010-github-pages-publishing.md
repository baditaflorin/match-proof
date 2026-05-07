# 0010 - GitHub Pages Publishing Strategy

## Status

Accepted

## Context

The live Pages URL is a first-class deliverable from the first commit.

## Decision

Publish from `main /docs`.

Live URL:

https://baditaflorin.github.io/match-proof/

Vite uses:

- `base: /match-proof/`
- hashed assets under `docs/assets/`
- `docs/404.html` copied from `docs/index.html`
- service worker scope `/match-proof/`

The `docs/` directory is not gitignored because it is the Pages publish directory.

## Consequences

- Documentation and built site share `docs/`; Vite is configured with `emptyOutDir: false`.
- Rollback is a normal git revert of a publishing commit.
- GitHub Pages does not support `_headers` or `_redirects`, so SPA fallback uses `404.html`.

## Alternatives Considered

- `gh-pages` branch: rejected to keep source and published artifacts visible in one branch.
- Repository root: rejected because source files and static publish files would mix too heavily.
