# Hanoi Benchmark Results Site

Static Astro site that renders benchmark results from `public/benchmark-results.json`. The results page is **statically generated at build time**: the JSON is read during `npm run build` and rendered into HTML (no client-side fetch). Backends and scenarios are derived from the JSON (no hardcoded lists).

## Local dev

- Ensure `public/benchmark-results.json` exists (a sample is committed for local dev; CI overwrites it with real results).
- `npm run dev` then open the dev server URL.
- To use real data, run the benchmark from the repo root (docker compose up, then `cd frontend/waku && yarn test:e2e:benchmark`) and copy `frontend/waku/e2e/results/results.json` to `results-site/public/benchmark-results.json`.

## Build

- `npm run build` — output in `dist/`.
- CI runs the full stack, runs the benchmark, copies results here, then runs this build. The built `dist/` is uploaded as an artifact for deployment (e.g. Vercel `vercel deploy --prebuilt`).

## Deploy on Vercel (build from repo)

1. In [Vercel](https://vercel.com), add a new project and import your Git repository.
2. Set **Root Directory** to `results-site` (click Edit next to the root and enter `results-site`).
3. Leave **Build Command** as `npm run build` and **Output Directory** as `dist`.
4. Deploy. The site is built with whatever `public/benchmark-results.json` exists in the repo at build time. To get fresh data, run CI (which commits updated results) and redeploy, or copy benchmark results into `public/benchmark-results.json` and trigger a new build.
