import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  buildTableForMetric,
  type Stats,
  type TableRow,
} from "../utils/benchData";

interface BenchResultsTableProps {
  stats: Stats;
  metricKey: string;
  metricLabel: string;
  scenarios: string[];
  combos: { backend: string; frontend: string }[];
}

export function BenchResultsTable({
  stats,
  metricKey,
  scenarios,
  combos,
}: BenchResultsTableProps) {
  const { scenarioIds, rows } = useMemo(
    () => buildTableForMetric(stats, scenarios, combos, metricKey),
    [stats, scenarios, combos, metricKey]
  );

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<TableRow>[]>(() => {
    const cols: ColumnDef<TableRow>[] = [
      {
        id: "combo",
        accessorKey: "combo",
        header: "Backend | Frontend",
      },
      {
        id: "mean",
        accessorKey: "mean",
        header: "mean",
        cell: ({ getValue }) => String(getValue()),
      },
    ];
    scenarioIds.forEach((scenarioId, idx) => {
      cols.push({
        id: scenarioId,
        accessorFn: (row) => row.cells[idx]?.mean ?? 0,
        header: scenarioId,
        cell: ({ row }) => row.original.cells[idx]?.label ?? "—",
      });
    });
    return cols;
  }, [scenarioIds]);

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <div className="table-wrap">
      <table
        className="bench-table"
        data-metric={metricKey}
        aria-labelledby={`metric-${metricKey}`}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isSortable = header.id !== "combo";
                return (
                  <th
                    key={header.id}
                    scope="col"
                    className={
                      isSortable ? "sortable num" : ""
                    }
                    onClick={
                      isSortable
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {isSortable && (
                      <span className="sort-icon" aria-hidden="true">
                        {{
                          asc: " ▲",
                          desc: " ▼",
                        }[header.column.getIsSorted() as string] ?? " ↕"}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              data-mean={row.original.mean}
              data-backend={row.original.backend}
              data-frontend={row.original.frontend}
            >
              {row.getVisibleCells().map((cell, i) => {
                const CellTag = i === 0 ? "th" : "td";
                const cellProps =
                  i === 0
                    ? { scope: "row" as const }
                    : {
                        "data-value":
                          i === 1
                            ? row.original.mean
                            : row.original.cells[i - 2]?.mean || undefined,
                        "data-relative":
                          row.original.cells[i - 2]?.relative || undefined,
                      };
                return (
                  <CellTag
                    key={cell.id}
                    className={i === 0 ? "" : "num"}
                    {...cellProps}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </CellTag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
