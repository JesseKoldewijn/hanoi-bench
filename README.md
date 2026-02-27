# hanoi-bench

Fullstack benchmark: Tower of Hanoi algorithm streamed over HTTP GET. Two frontends (Waku + React, TanStack Solid) and two backends (Rust, Go) run on separate ports.

## Project structure

| Component            | Port | Stack                         |
| -------------------- | ---- | ----------------------------- |
| **Waku** (frontend)  | 3000 | Waku + React + Tailwind 4     |
| **TanStack Solid**   | 3001 | TanStack Start + Solid + Tailwind 4 |
| **Rust** (backend)   | 6001 | Axum + tokio-stream           |
| **Go** (backend)     | 6002 | net/http                      |

## Frontends

Both frontends share the same API contract: table view (all steps) and animated Tower of Hanoi with query-param configurable speed. Multi-theme (CSS variables) with a theme toggle (top-right).

### Query params (both)

| Param     | Description            | Default |
| --------- | ---------------------- | ------- |
| `n`       | Number of disks (1–32) | 5       |
| `view`    | `table` or `animate`   | table   |
| `backend` | `rust` or `go`         | rust    |
| `speed`   | Animation: ms per move | 400     |

Examples:

- Table, 5 disks, Rust: `?n=5&view=table&backend=rust`
- Animate, 3 disks, 300 ms/move, Go: `?n=3&view=animate&backend=go&speed=300`

### Env (optional)

Copy `.env.example` to `.env` in the frontend directory and set backend URLs if not using localhost:

- `VITE_BACKEND_RUST` – Rust API base URL (default `http://localhost:6001`)
- `VITE_BACKEND_GO` – Go API base URL (default `http://localhost:6002`)

### Waku (port 3000)

```bash
cd frontend/waku
yarn install
yarn dev
```

Open http://localhost:3000. Ensure backends are running for table/animation data.

### TanStack Solid (port 3001)

```bash
cd frontend/tanstack-solid
yarn install
yarn dev
```

Open http://localhost:3001. Ensure backends are running for table/animation data.

### Theme

Use the theme toggle (top-right) to switch light/dark. Preference is stored in `localStorage`.

---

## Backends

Two one-to-one backends (identical API, streamed NDJSON):

| Backend  | Port | Run locally                    |
| -------- | ---- | ------------------------------ |
| **Rust** | 6001 | `cd backend/rust && cargo run` |
| **Go**   | 6002 | `cd backend/go && go run .`    |

### Endpoints (both)

| Method | Path           | Description                                              |
| ------ | -------------- | -------------------------------------------------------- |
| GET    | `/hanoi?n=<n>` | Stream moves as NDJSON. `n` = disks (1–32, default 10).  |
| GET    | `/health`      | Health check. Returns `ok`.                              |

### Example

```bash
curl -N "http://localhost:6001/hanoi?n=3"   # Rust
curl -N "http://localhost:6002/hanoi?n=3"   # Go
```

Response: `Content-Type: application/x-ndjson`, `X-Total-Moves: 7`, one JSON object per line, e.g. `{"from":0,"to":2}`.

### Tests

- **Rust**: `cd backend/rust && cargo test`
- **Go**: `cd backend/go && go test ./...`

---

## Docker

From the project root:

```bash
docker compose up --build
```

- **frontend_waku**: http://localhost:3000
- **frontend_tanstack_solid**: http://localhost:3001
- **backend_rust**: port 6001
- **backend_go**: port 6002

Browsers at localhost:3000 and localhost:3001 will call localhost:6001 / localhost:6002 for API (host network).

---

## Benchmark and results site

The results site (`results-site/`) is an Astro app that displays benchmark results with AG Charts and TanStack Table. It compares frontend×backend performance across table and animate scenarios.

### Run benchmarks locally

With the stack running (e.g. `docker compose up -d`):

```bash
bash scripts/run-all-benchmarks.sh
```

This runs Playwright e2e tests against both frontends, aggregates timing data, and writes `results-site/public/benchmark-results.json`. Then build and serve the results site:

```bash
cd results-site
yarn install
yarn build
yarn preview
```

### E2E tests

E2E specs live in `frontend/waku/e2e/` and run against either frontend via `PLAYWRIGHT_BASE_URL`:

```bash
cd frontend/waku
# Against Waku (default)
npx playwright test

# Against TanStack Solid
PLAYWRIGHT_BASE_URL=http://localhost:3001 BENCHMARK_FRONTEND=tanstack-solid npx playwright test
```

---

## CI

The workflow **Benchmark and build results site** (`.github/workflows/benchmark-and-site.yml`) runs on push to `main` and on `workflow_dispatch`. It starts the stack, runs Playwright benchmarks for both frontends, aggregates results, copies them into the Astro results site, and builds it.

### Dry-run (for local testing with act)

When triggered manually, you can pass **dry_run: true** to skip Docker, the benchmark, and artifact upload. Only checkout, Volta, results-site install, and Astro build run—useful to validate the workflow with [act](https://github.com/nektos/act) without starting the full stack.

```bash
# Requires act and Docker
act workflow_dispatch -W .github/workflows/benchmark-and-site.yml --input dry_run=true -j benchmark-and-build
```
