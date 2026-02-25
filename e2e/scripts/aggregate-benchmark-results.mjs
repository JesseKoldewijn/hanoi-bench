/**
 * Reads e2e/results/timings.jsonl and writes e2e/results/results.json with
 * runAt, frontends, results[], and stats for the static results page.
 * Stats: stats[scenario][backend][frontend][metric]
 * Run after: PLAYWRIGHT_BENCHMARK=1 playwright test
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const TIMINGS_PATH = path.join(ROOT, "e2e", "results", "timings.jsonl");
const RESULTS_PATH = path.join(ROOT, "e2e", "results", "results.json");

const METRIC_KEYS = ["timeToStreamCompleteMs", "navigationTimingMs"];

function loadTimings() {
  if (!fs.existsSync(TIMINGS_PATH)) return [];
  const raw = fs.readFileSync(TIMINGS_PATH, "utf8").trim();
  if (!raw) return [];
  return raw
    .split("\n")
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function toResult(entry) {
  const metrics = {};
  for (const key of METRIC_KEYS) {
    if (entry[key] != null) metrics[key] = entry[key];
  }
  return {
    scenario: entry.scenario,
    backend: entry.backend,
    frontend: entry.frontend ?? "waku",
    metrics,
  };
}

function computeStats(entries) {
  const byScenarioBackendFrontend = new Map();
  for (const entry of entries) {
    const k = `${entry.scenario}\0${entry.backend}\0${entry.frontend ?? "waku"}`;
    if (!byScenarioBackendFrontend.has(k)) byScenarioBackendFrontend.set(k, []);
    byScenarioBackendFrontend.get(k).push(entry);
  }

  const stats = {};
  for (const [key, list] of byScenarioBackendFrontend) {
    const [scenario, backend, frontend] = key.split("\0");
    if (!stats[scenario]) stats[scenario] = {};
    if (!stats[scenario][backend]) stats[scenario][backend] = {};
    stats[scenario][backend][frontend] = {};

    for (const metricKey of METRIC_KEYS) {
      const values = list
        .map((e) => e[metricKey])
        .filter((v) => v != null && typeof v === "number");
      if (values.length === 0) continue;

      const sum = values.reduce((a, b) => a + b, 0);
      stats[scenario][backend][frontend][metricKey] = {
        mean: Math.round((sum / values.length) * 100) / 100,
        min: Math.min(...values),
        max: Math.max(...values),
        sampleCount: values.length,
      };
    }
  }
  return stats;
}

function collectFrontendRuns(entries) {
  const seen = new Map();
  for (const e of entries) {
    const f = e.frontend ?? "waku";
    if (!seen.has(f)) seen.set(f, true);
  }
  return Array.from(seen.keys()).sort();
}

function main() {
  const entries = loadTimings();
  const results = entries.map(toResult);
  const stats = computeStats(entries);
  const frontends = collectFrontendRuns(entries);

  const out = {
    runAt: new Date().toISOString(),
    frontends,
    results,
    stats,
  };

  const dir = path.dirname(RESULTS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(
    "Wrote",
    RESULTS_PATH,
    "with",
    results.length,
    "results across",
    frontends.length,
    "frontend(s)."
  );
}

main();
