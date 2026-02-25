#!/usr/bin/env bash
# Run benchmarks for all frontends (Waku + TanStack Solid) and aggregate results.
# Requires: docker compose up, frontends on 3000 (Waku) and 3001 (TanStack Solid).
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TIMINGS_DIR="$ROOT/e2e/results"
TIMINGS_FILE="$TIMINGS_DIR/timings.jsonl"
mkdir -p "$TIMINGS_DIR"
: > "$TIMINGS_FILE"

cd "$ROOT/frontend/waku"
echo "Benchmarking Waku (localhost:3000)..."
PLAYWRIGHT_BASE_URL=http://localhost:3000 \
  BENCHMARK_FRONTEND=waku \
  BENCHMARK_TIMINGS_PATH="$TIMINGS_FILE" \
  PLAYWRIGHT_BENCHMARK=1 \
  npx playwright test

echo "Benchmarking TanStack Solid (localhost:3001)..."
PLAYWRIGHT_BASE_URL=http://localhost:3001 \
  BENCHMARK_FRONTEND=tanstack-solid \
  BENCHMARK_TIMINGS_PATH="$TIMINGS_FILE" \
  PLAYWRIGHT_BENCHMARK=1 \
  npx playwright test

echo "Aggregating results..."
BENCHMARK_RESULTS_DIR="$TIMINGS_DIR" node e2e/scripts/aggregate-benchmark-results.mjs

cp "$ROOT/e2e/results/results.json" "$ROOT/results-site/public/benchmark-results.json"
echo "Done. Results copied to results-site/public/benchmark-results.json"
