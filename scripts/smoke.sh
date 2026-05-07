#!/usr/bin/env bash
set -euo pipefail

make build

PORT="${PORT:-$(node -e "console.log(4500 + Math.floor(Math.random() * 1000))")}"
BASE_URL="http://127.0.0.1:${PORT}"
npx vite preview --host 127.0.0.1 --port "${PORT}" --strictPort >/tmp/match-proof-preview.log 2>&1 &
SERVER_PID=$!

cleanup() {
  kill "${SERVER_PID}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

READY=0
for _ in $(seq 1 30); do
  if curl -fsS "${BASE_URL}/match-proof/" >/dev/null; then
    READY=1
    break
  fi
  sleep 0.5
done

if [[ "${READY}" != "1" ]]; then
  cat /tmp/match-proof-preview.log
  exit 1
fi

PLAYWRIGHT_BASE_URL="${BASE_URL}" npx playwright test
