import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = path.join(__dirname, "results");
const TIMINGS_FILE = path.join(RESULTS_DIR, "timings.jsonl");

export const FRONTEND = "waku" as const;

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
    fs.appendFileSync(TIMINGS_FILE, JSON.stringify(entry) + "\n");
  } catch {
    // ignore write errors
  }
}
