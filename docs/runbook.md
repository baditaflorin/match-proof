# Runbook

Mode A has no runtime server.

## Local Debugging

```sh
npm install
make dev
make test
make smoke
```

## Pages Debugging

1. Confirm Pages is serving `main /docs`.
2. Confirm `vite.config.ts` uses `base: /match-proof/`.
3. Confirm `docs/index.html` and `docs/404.html` exist.
4. Open https://baditaflorin.github.io/match-proof/ in a private browser window.

## Resource Sizing

No server resources are required. Browser storage use is expected to stay below 5 MB for normal v1 profiles.
