import React, { useMemo, useState, useEffect } from "react";
import { AgCharts } from "ag-charts-react";
import type { ChartDataPoint } from "../utils/benchData";
import { comboLabel, scenarioLabel } from "../utils/benchData";
import type { Combo } from "../utils/benchData";

function getIsDark(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

type Props = {
  data: ChartDataPoint[];
  combos: Combo[];
  metricKey: string;
  metricLabel: string;
};

export default function BenchmarkAreaChart({ data, combos, metricKey, metricLabel }: Props) {
  const [isDark, setIsDark] = useState(getIsDark);

  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => setIsDark(getIsDark()));
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const options = useMemo(
    () => ({
      theme: isDark ? ("ag-default-dark" as const) : ("ag-default" as const),
      data,
      series: combos.map((c) => ({
        type: "area" as const,
        xKey: "scenario",
        yKey: comboLabel(c),
        yName: comboLabel(c),
        fillOpacity: 0.6,
      })),
      axes: [
        {
          type: "category",
          position: "bottom" as const,
          label: {
            formatter: ({ value }: { value: string }) => scenarioLabel(String(value)),
          },
        },
        { type: "number", position: "left" as const },
      ],
      legend: { enabled: true },
    }),
    [data, combos, metricKey, metricLabel, isDark]
  );

  if (data.length === 0 || combos.length === 0) return null;

  return (
    <div className="chart-wrap" style={{ minHeight: 300 }}>
      <AgCharts options={options} />
    </div>
  );
}
