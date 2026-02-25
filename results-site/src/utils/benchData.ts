export const METRIC_LABELS: Record<string, string> = {
  timeToStreamCompleteMs: "Time to stream complete (ms)",
  navigationTimingMs: "Navigation timing (ms)",
};

export type MetricStats = {
  mean: number;
  min: number;
  max: number;
  sampleCount: number;
};

/** stats[scenario][backend][frontend][metricKey] */
export type Stats = Record<
  string,
  Record<string, Record<string, Record<string, MetricStats>>>
>;

export type CellData = {
  mean: number;
  spread: number;
  relative: number;
  label: string;
};

export type TableRow = {
  combo: string;
  backend: string;
  frontend: string;
  mean: number;
  cells: CellData[];
};

export function formatNum(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

/** Support both stats[scenario][backend][frontend][metric] and legacy stats[scenario][backend][metric] */
function getMetricValue(
  stats: Stats,
  scenario: string,
  backend: string,
  frontend: string,
  metricKey: string
): MetricStats | null {
  const byBackend = stats[scenario]?.[backend] as Record<string, unknown>;
  if (!byBackend) return null;
  const byFrontend = byBackend[frontend] as Record<string, MetricStats> | undefined;
  if (byFrontend?.[metricKey]) return byFrontend[metricKey];
  if (frontend === "waku") {
    const direct = byBackend[metricKey] as MetricStats | undefined;
    if (direct && typeof direct === "object" && direct.mean != null) return direct;
  }
  return null;
}

const METRIC_KEYS = ["timeToStreamCompleteMs", "navigationTimingMs"];

export function getCombosFromStats(stats: Stats): { backend: string; frontend: string }[] {
  const seen = new Set<string>();
  const combos: { backend: string; frontend: string }[] = [];
  for (const scenario of Object.keys(stats)) {
    for (const backend of Object.keys(stats[scenario] ?? {})) {
      const byThird = stats[scenario]![backend] as Record<string, unknown>;
      if (!byThird || typeof byThird !== "object") continue;
      const keys = Object.keys(byThird);
      const isLegacy = keys.every((k) => METRIC_KEYS.includes(k));
      if (isLegacy) {
        const k = `${backend}|waku`;
        if (!seen.has(k)) {
          seen.add(k);
          combos.push({ backend, frontend: "waku" });
        }
      } else {
        for (const frontend of keys) {
          const inner = byThird[frontend] as Record<string, unknown>;
          if (!inner || typeof inner !== "object") continue;
          const hasMetric = Object.keys(inner).some(
            (mk) => METRIC_KEYS.includes(mk) && (inner[mk] as any)?.mean != null
          );
          if (hasMetric) {
            const comboKey = `${backend}|${frontend}`;
            if (!seen.has(comboKey)) {
              seen.add(comboKey);
              combos.push({ backend, frontend });
            }
          }
        }
      }
    }
  }
  return combos.sort((a, b) =>
    a.backend !== b.backend
      ? a.backend.localeCompare(b.backend)
      : a.frontend.localeCompare(b.frontend)
  );
}

export function buildTableForMetric(
  stats: Stats,
  scenarios: string[],
  combos: { backend: string; frontend: string }[],
  metricKey: string
): { scenarioIds: string[]; rows: TableRow[] } {
  const scenarioIds = scenarios.filter((s) => {
    for (const { backend, frontend } of combos) {
      if (getMetricValue(stats, s, backend, frontend, metricKey)) return true;
    }
    return false;
  });
  const rows: TableRow[] = [];
  for (const { backend, frontend } of combos) {
    const comboLabel = `${backend} (${frontend})`;
    const cells: CellData[] = [];
    let sumMean = 0;
    let countMean = 0;
    for (const scenario of scenarioIds) {
      const s = getMetricValue(stats, scenario, backend, frontend, metricKey);
      if (!s) {
        cells.push({ mean: 0, spread: 0, relative: 0, label: "—" });
        continue;
      }
      const spread = s.sampleCount > 1 ? (s.max - s.min) / 2 : 0;
      sumMean += s.mean;
      countMean += 1;
      cells.push({ mean: s.mean, spread, relative: 0, label: "" });
    }
    const overallMean = countMean ? sumMean / countMean : 0;
    rows.push({
      combo: comboLabel,
      backend,
      frontend,
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
      c.label = `${formatNum(c.mean)}${spreadStr} (${relative.toFixed(2)})`;
    }
  }
  return { scenarioIds, rows };
}

export type ChartDataPoint = Record<string, string | number>;

export function buildChartData(
  stats: Stats,
  scenarios: string[],
  combos: { backend: string; frontend: string }[],
  metricKey: string
): ChartDataPoint[] {
  const scenarioIds = scenarios.filter((s) => {
    for (const { backend, frontend } of combos) {
      if (getMetricValue(stats, s, backend, frontend, metricKey)) return true;
    }
    return false;
  });
  return scenarioIds.map((scenario) => {
    const point: ChartDataPoint = { scenario };
    for (const { backend, frontend } of combos) {
      const s = getMetricValue(stats, scenario, backend, frontend, metricKey);
      point[`${backend} (${frontend})`] = s?.mean ?? 0;
    }
    return point;
  });
}
