# E2E and benchmark

## Tests

- **Smoke**: home page, query params, view summary.
- **Table**: per-backend (rust, go) table view for n=5, n=10, n=12 (stress).
- **Animate**: per-backend animate view for n=3, n=5; stream completes and step counter reaches end.
- **Error**: 500 and connection failure handling.

Run: `yarn test:e2e` (requires app on `http://localhost:3000` and backends on 6001/6002).

## Benchmark

With `PLAYWRIGHT_BENCHMARK=1`, table and animate tests append timing entries to a timings file.  
Run: `yarn test:e2e:benchmark` — runs Waku-only, aggregates into **`e2e/results/results.json`**.

To benchmark **all frontends** (Waku + TanStack Solid), from repo root: `bash scripts/run-all-benchmarks.sh`. Requires `docker compose up` with frontends on 3000 and 3001.

### Results JSON (for static results page)

Path: **`e2e/results/results.json`** (gitignored; produced by benchmark + aggregate).

Shape:

- **runAt**: ISO8601 timestamp of the run.
- **frontend**: `"waku"` or `"waku, tanstack-solid"` when multiple.
- **frontendVersion**: from `package.json` (e.g. `"0.1.0"`).
- **results**: array of `{ scenario, backend, frontend, metrics: { timeToStreamCompleteMs?, ... } }`.
- **stats**: `stats[scenario][backend][frontend][metric]` = `{ mean, min, max, sampleCount }`.

To drive a public static results site: run `scripts/run-all-benchmarks.sh` (it copies `e2e/results/results.json` into the static site’s public data (e.g. `results-site/public/benchmark-results.json`) and build/serve the site so the page can fetch this JSON.
