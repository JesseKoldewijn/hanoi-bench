# hanoi-bench

Fullstack benchmark: Tower of Hanoi algorithm streamed over HTTP GET. Backend and frontend run on separate ports.

## Frontend (Waku + React + Tailwind 4 + shadcn)

Port **3000**. Table view (steps) and animated Tower of Hanoi with query-param configurable speed. Multi-theme (CSS variables) with a theme toggle (top-right).

### Run

```bash
cd frontend/waku
yarn install
yarn dev
```

Open http://localhost:3000. Ensure backends are running (Rust 6001, Go 6002) for table/animation data.

### Query params

| Param     | Description            | Default |
| --------- | ---------------------- | ------- |
| `n`       | Number of disks (1–32) | 5       |
| `view`    | `table` or `animate`   | table   |
| `backend` | `rust` or `go`         | rust    |
| `speed`   | Animation: ms per move | 400     |

Examples:

- Table, 5 disks, Rust: `?n=5&view=table&backend=rust`
- Animate, 3 disks, 300 ms/move, Go: `?n=3&view=animate&backend=go&speed=300`

### Theme

Use the theme toggle (top-right) to switch light/dark. Preference is stored in `localStorage`.

### Env (optional)

Copy `.env.example` to `.env` and set backend URLs if not using localhost:

- `VITE_BACKEND_RUST` – Rust API base URL (default `http://localhost:6001`)
- `VITE_BACKEND_GO` – Go API base URL (default `http://localhost:6002`)

---

## Backends

Two one-to-one backends (identical API, streamed NDJSON):

| Backend  | Port | Run locally                    |
| -------- | ---- | ------------------------------ |
| **Rust** | 6001 | `cd backend/rust && cargo run` |
| **Go**   | 6002 | `cd backend/go && go run .`    |

### Endpoints (both)

| Method | Path           | Description                                             |
| ------ | -------------- | ------------------------------------------------------- |
| GET    | `/hanoi?n=<n>` | Stream moves as NDJSON. `n` = disks (1–32, default 10). |
| GET    | `/health`      | Health check. Returns `ok`.                             |

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

- **frontend**: http://localhost:3000
- **backend_rust**: port 6001
- **backend_go**: port 6002

Browser at localhost:3000 will call localhost:6001 / localhost:6002 for API (host network).

---

## CI

The workflow **Benchmark and build results site** (`.github/workflows/benchmark-and-site.yml`) runs on push to `main` and on `workflow_dispatch`. It starts the stack, runs Playwright benchmarks, copies results into the Astro results site, and builds it.

### Dry-run (for local testing with act)

When triggered manually, you can pass **dry_run: true** to skip Docker, the benchmark, and artifact upload. Only checkout, Volta, results-site install, and Astro build run—useful to validate the workflow with [act](https://github.com/nektos/act) without starting the full stack.

```bash
# Requires act and Docker
act workflow_dispatch -W .github/workflows/benchmark-and-site.yml --eventpath .github/events/dry-run.json -j benchmark-and-build
```

Or pass the input inline: `act workflow_dispatch -W .github/workflows/benchmark-and-site.yml --input dry_run=true -j benchmark-and-build`
