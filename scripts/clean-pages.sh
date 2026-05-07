#!/usr/bin/env bash
set -euo pipefail

rm -rf docs/assets
rm -f docs/index.html docs/404.html docs/manifest.webmanifest docs/registerSW.js
rm -f docs/sw.js docs/sw.js.map
rm -f docs/workbox-*.js docs/workbox-*.js.map
rm -f docs/favicon.svg docs/icons.svg
