import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_RESULTS_DIR = path.join(__dirname, "results");
const TIMINGS_PATH = process.env.BENCHMARK_TIMINGS_PATH
  ? path.resolve(process.env.BENCHMARK_TIMINGS_PATH)
  : path.join(DEFAULT_RESULTS_DIR, "timings.jsonl");
const RESULTS_DIR = path.dirname(TIMINGS_PATH);

export const FRONTEND = (process.env.BENCHMARK_FRONTEND ?? "waku") as string;

export type TimingEntry = {
  scenario: string;
  backend: string;
  frontend: string;
  timeToStreamCompleteMs?: number;
  navigationTimingMs?: number;
};

export function isBenchmarkEnabled(): boolean {
  return process.env.PLAYWRIGHT_BENCHMARK === "1";
}

export function writeTiming(entry: TimingEntry): void {
  if (!isBenchmarkEnabled()) return;
  try {
    if (!fs.existsSync(RESULTS_DIR)) {
      fs.mkdirSync(RESULTS_DIR, { recursive: true });
    }
    fs.appendFileSync(TIMINGS_PATH, JSON.stringify(entry) + "\n");
  } catch {
    // ignore write errors
  }
}
