/**
 * Reads e2e/results/timings.jsonl and writes e2e/results/results.json with
 * runAt, frontend, frontendVersion, results[], and stats for the static results page.
 * Run after: PLAYWRIGHT_BENCHMARK=1 playwright test
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const DEFAULT_DIR = path.join(ROOT, "e2e", "results");
const BENCHMARK_DIR = process.env.BENCHMARK_RESULTS_DIR
  ? path.resolve(process.cwd(), process.env.BENCHMARK_RESULTS_DIR)
  : DEFAULT_DIR;
const TIMINGS_PATH = path.join(BENCHMARK_DIR, "timings.jsonl");
const RESULTS_PATH = path.join(BENCHMARK_DIR, "results.json");
const PACKAGE_JSON_PATH = path.join(ROOT, "package.json");

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
    const frontend = entry.frontend ?? "waku";
    const k = `${entry.scenario}\0${entry.backend}\0${frontend}`;
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

function main() {
  const entries = loadTimings();
  const frontendVersion = (() => {
    try {
      const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf8"));
      return pkg.version ?? "0.0.0";
    } catch {
      return "0.0.0";
    }
  })();

  const frontends = [...new Set(entries.map((e) => e.frontend ?? "waku"))];
  const frontend = frontends.length === 1 ? frontends[0] : frontends.join(", ");
  const results = entries.map(toResult);
  const stats = computeStats(entries);

  const out = {
    runAt: new Date().toISOString(),
    frontend,
    frontendVersion,
    results,
    stats,
  };

  const dir = path.dirname(RESULTS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log("Wrote", RESULTS_PATH, "with", results.length, "results.");
}

main();
