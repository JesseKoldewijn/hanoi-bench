import { AgCharts } from "ag-charts-react";
import { useEffect, useMemo, useState } from "react";
import { buildChartData, type Stats } from "../utils/benchData";

interface BenchmarkAreaChartProps {
  stats: Stats;
  metricKey: string;
  metricLabel: string;
  scenarios: string[];
  combos: { backend: string; frontend: string }[];
}

function useDarkMode(): boolean {
  const [dark, setDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );
  useEffect(() => {
    if (typeof document === "undefined") return;
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return dark;
}

export function BenchmarkAreaChart({
  stats,
  metricKey,
  metricLabel,
  scenarios,
  combos,
}: BenchmarkAreaChartProps) {
  const isDark = useDarkMode();
  const chartData = useMemo(
    () => buildChartData(stats, scenarios, combos, metricKey),
    [stats, scenarios, combos, metricKey]
  );

  const comboLabels = combos.map((c) => `${c.backend} (${c.frontend})`);
  const chartOptions = useMemo(
    () => ({
      title: { text: metricLabel },
      data: chartData,
      series: comboLabels.map((label) => ({
        type: "area" as const,
        xKey: "scenario",
        yKey: label,
        yName: label,
      })),
      theme: isDark ? "ag-default-dark" : "ag-default",
    }),
    [chartData, comboLabels, metricLabel, isDark]
  );

  if (chartData.length === 0) return null;

  return (
    <div
      className="chart-wrap"
      data-metric-chart={metricKey}
      style={{ minHeight: 300, width: "100%" }}
    >
      <AgCharts options={chartOptions} />
    </div>
  );
}
