/**
 * Data helpers for benchmark results. Supports both:
 * - New: stats[scenario][backend][frontend][metricKey]
 * - Legacy: stats[scenario][backend][metricKey]
 */

const METRIC_KEYS = ["timeToStreamCompleteMs", "navigationTimingMs"] as const;

function isLegacyFormat(stats: unknown): stats is Record<string, Record<string, Record<string, { mean: number }>>> {
  if (!stats || typeof stats !== "object") return false;
  for (const scenario of Object.keys(stats)) {
    const byBackend = (stats as Record<string, unknown>)[scenario] as Record<string, unknown> | undefined;
    if (!byBackend || typeof byBackend !== "object") continue;
    for (const backend of Object.keys(byBackend)) {
      const backendVal = byBackend[backend];
      if (!backendVal || typeof backendVal !== "object") continue;
      if (METRIC_KEYS.some((mk) => (backendVal as Record<string, unknown>)[mk] != null)) return true;
    }
  }
  return false;
}

function isNewFormat(stats: unknown): stats is Record<string, Record<string, Record<string, Record<string, { mean: number }>>>> {
  if (!stats || typeof stats !== "object") return false;
  for (const scenario of Object.keys(stats)) {
    const byBackend = (stats as Record<string, unknown>)[scenario] as Record<string, unknown> | undefined;
    if (!byBackend || typeof byBackend !== "object") continue;
    for (const backend of Object.keys(byBackend)) {
      const backendVal = byBackend[backend];
      if (!backendVal || typeof backendVal !== "object") continue;
      const firstChild = Object.values(backendVal as Record<string, unknown>)[0];
      if (!firstChild || typeof firstChild !== "object") continue;
      if (METRIC_KEYS.some((mk) => (firstChild as Record<string, unknown>)[mk] != null)) return true;
    }
  }
  return false;
}

export type Combo = { backend: string; frontend: string };

export function comboLabel(c: Combo): string {
  return `${c.backend} (${c.frontend})`;
}

export function getCombosFromStats(
  stats: Record<string, unknown>,
  topLevelFrontend?: string | null
): Combo[] {
  const seen = new Set<string>();
  const combos: Combo[] = [];

  if (isNewFormat(stats)) {
    for (const scenario of Object.keys(stats)) {
      const byBackend = stats[scenario];
      if (!byBackend || typeof byBackend !== "object") continue;
      for (const backend of Object.keys(byBackend)) {
        const byFrontend = (byBackend as Record<string, unknown>)[backend];
        if (!byFrontend || typeof byFrontend !== "object") continue;
        for (const frontend of Object.keys(byFrontend as Record<string, unknown>)) {
          const key = `${backend}\0${frontend}`;
          if (!seen.has(key)) {
            seen.add(key);
            combos.push({ backend, frontend });
          }
        }
      }
    }
  } else if (isLegacyFormat(stats)) {
    const backends = new Set<string>();
    for (const scenario of Object.keys(stats)) {
      const byBackend = stats[scenario];
      if (!byBackend || typeof byBackend !== "object") continue;
      for (const backend of Object.keys(byBackend)) backends.add(backend);
    }
    const frontend = topLevelFrontend ?? "unknown";
    for (const backend of Array.from(backends).sort()) {
      combos.push({ backend, frontend });
    }
  }

  combos.sort((a, b) => {
    const la = comboLabel(a);
    const lb = comboLabel(b);
    return la.localeCompare(lb);
  });
  return combos;
}

function getMean(
  stats: Record<string, unknown>,
  scenario: string,
  backend: string,
  frontend: string | null,
  metricKey: string
): number | null {
  const s = stats[scenario] as Record<string, unknown> | undefined;
  if (!s) return null;
  const b = s[backend] as Record<string, unknown> | undefined;
  if (!b) return null;

  if (frontend && typeof (b[frontend] as Record<string, unknown>) === "object") {
    const f = b[frontend] as Record<string, unknown> | undefined;
    const m = f?.[metricKey] as { mean?: number } | undefined;
    return m?.mean ?? null;
  }
  const m = b[metricKey] as { mean?: number } | undefined;
  return m?.mean ?? null;
}

export type TableRow = {
  combo: Combo;
  comboLabel: string;
  mean: number;
  cells: { mean: number; spread: number; relative: number; label: string }[];
};

export function buildTableForMetric(
  stats: Record<string, unknown>,
  combos: Combo[],
  scenarios: string[],
  metricKey: string
): { scenarioIds: string[]; rows: TableRow[] } {
  const scenarioIds = scenarios.filter((s) => combos.some((c) => getMean(stats, s, c.backend, c.frontend, metricKey) != null));

  const rows: TableRow[] = [];
  for (const combo of combos) {
    const cells: TableRow["cells"] = [];
    let sumMean = 0;
    let countMean = 0;
    for (const scenario of scenarioIds) {
      const meanVal = getMean(stats, scenario, combo.backend, combo.frontend, metricKey);
      const s = stats[scenario] as Record<string, unknown> | undefined;
      const b = s?.[combo.backend] as Record<string, unknown> | undefined;
      let spread = 0;
      if (meanVal != null && b) {
        const leaf = combo.frontend ? (b[combo.frontend] as Record<string, { min?: number; max?: number; sampleCount?: number }>) : (b[metricKey] as { min?: number; max?: number; sampleCount?: number });
        if (leaf && leaf.sampleCount && leaf.sampleCount > 1 && leaf.min != null && leaf.max != null) {
          spread = (leaf.max - leaf.min) / 2;
        }
      }
      if (meanVal == null) {
        cells.push({ mean: 0, spread: 0, relative: 0, label: "—" });
      } else {
        sumMean += meanVal;
        countMean += 1;
        cells.push({ mean: meanVal, spread, relative: 0, label: "" });
      }
    }
    const overallMean = countMean ? sumMean / countMean : 0;
    rows.push({
      combo,
      comboLabel: comboLabel(combo),
      mean: Math.round(overallMean * 100) / 100,
      cells,
    });
  }

  for (let col = 0; col < scenarioIds.length; col++) {
    const values = rows.map((r) => r.cells[col].mean).filter((v) => v > 0);
    const best = values.length ? Math.min(...values) : 0;
    for (const row of rows) {
      const c = row.cells[col];
      if (c.mean <= 0) {
        c.label = "—";
        continue;
      }
      const relative = best > 0 ? Math.round((c.mean / best) * 100) / 100 : 1;
      c.relative = relative;
      const spreadStr = c.spread > 0 ? ` ± ${formatNum(c.spread)}` : "";
      c.label = `${formatNum(c.mean)}${spreadStr} (${relative.toFixed(2)}×)`;
    }
  }
  return { scenarioIds, rows };
}

function formatNum(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

export type ChartDataPoint = Record<string, string | number>;

export function buildChartData(
  stats: Record<string, unknown>,
  combos: Combo[],
  scenarios: string[],
  metricKey: string
): ChartDataPoint[] {
  const scenarioIds = scenarios.filter((s) => combos.some((c) => getMean(stats, s, c.backend, c.frontend, metricKey) != null));

  return scenarioIds.map((scenario) => {
    const point: ChartDataPoint = { scenario };
    for (const combo of combos) {
      const mean = getMean(stats, scenario, combo.backend, combo.frontend, metricKey);
      const key = comboLabel(combo);
      point[key] = mean ?? 0;
    }
    return point;
  });
}

export function getScenariosFromStats(stats: Record<string, unknown>): string[] {
  return Object.keys(stats).sort();
}

export type ViewType = "animate" | "table";

/** Filter scenarios by view type (animate-* vs table-*), sorted by numeric n */
export function filterScenariosByView(scenarios: string[], view: ViewType): string[] {
  const prefix = view === "animate" ? "animate-" : "table-";
  return scenarios
    .filter((s) => s.startsWith(prefix))
    .sort((a, b) => {
      const na = parseInt(a.match(/n(\d+)/)?.[1] ?? "0", 10);
      const nb = parseInt(b.match(/n(\d+)/)?.[1] ?? "0", 10);
      return na - nb;
    });
}

/** Human-readable scenario label (e.g. animate-n3 → n=3) */
export function scenarioLabel(scenarioId: string): string {
  const match = scenarioId.match(/^(?:animate|table)-n(\d+)$/);
  return match ? `n=${match[1]}` : scenarioId;
}

export function getMetricsFromStats(stats: Record<string, unknown>): string[] {
  const keys = new Set<string>();
  for (const scenario of Object.keys(stats)) {
    const byBackend = (stats as Record<string, unknown>)[scenario] as Record<string, unknown> | undefined;
    if (!byBackend || typeof byBackend !== "object") continue;
    for (const backend of Object.keys(byBackend)) {
      const b = byBackend[backend] as Record<string, unknown> | undefined;
      if (!b || typeof b !== "object") continue;
      if (METRIC_KEYS.some((mk) => (b as Record<string, unknown>)[mk] != null)) {
        for (const mk of METRIC_KEYS) if ((b as Record<string, unknown>)[mk] != null) keys.add(mk);
      } else {
        const firstFrontend = Object.values(b)[0] as Record<string, unknown> | undefined;
        if (firstFrontend && typeof firstFrontend === "object") {
          for (const mk of METRIC_KEYS) if ((firstFrontend as Record<string, unknown>)[mk] != null) keys.add(mk);
        }
      }
    }
  }
  return keys.size > 0 ? Array.from(keys) : [...METRIC_KEYS];
}
