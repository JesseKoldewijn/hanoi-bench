import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = path.join(__dirname, "results");
const TIMINGS_FILE = path.join(RESULTS_DIR, "timings.jsonl");

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

export function writeTiming(
  entry: Omit<TimingEntry, "frontend">,
  frontend: string
): void {
  if (!isBenchmarkEnabled()) return;
  const full = { ...entry, frontend };
  try {
    if (!fs.existsSync(RESULTS_DIR)) {
      fs.mkdirSync(RESULTS_DIR, { recursive: true });
    }
    fs.appendFileSync(TIMINGS_FILE, JSON.stringify(full) + "\n");
  } catch {
    // ignore write errors
  }
}
