import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import type { TableRow } from "../utils/benchData";

const columnHelper = createColumnHelper<TableRow>();

type Props = {
  scenarioIds: string[];
  rows: TableRow[];
  metricKey: string;
};

export default function BenchResultsTable({ scenarioIds, rows, metricKey }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "mean", desc: false }]);

  const columns = [
    columnHelper.accessor("comboLabel", {
      header: "Combo",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("mean", {
      header: "mean",
      cell: (info) => {
        const v = info.getValue();
        return Number.isInteger(v) ? String(v) : v.toFixed(2);
      },
    }),
    ...scenarioIds.map((sid) => {
      const idx = scenarioIds.indexOf(sid);
      return columnHelper.accessor((row) => row.cells[idx]?.mean ?? 0, {
        id: sid,
        header: sid,
        cell: ({ row }) => {
          const cell = row.original.cells[idx];
          return cell ? cell.label : "—";
        },
      });
    }),
  ];

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.comboLabel,
  });

  return (
    <div className="table-wrap">
      <table className="bench-table" data-metric={metricKey}>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  scope="col"
                  className={h.column.getCanSort() ? "sortable" : ""}
                  onClick={h.column.getToggleSortingHandler()}
                  style={{ textAlign: h.id === "mean" || scenarioIds.includes(h.id) ? "right" : "left" }}
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                  {h.column.getCanSort() && (
                    <span className="sort-icon" aria-hidden="true">
                      {h.column.getIsSorted() === "asc" ? " ▲" : h.column.getIsSorted() === "desc" ? " ▼" : " ↕"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} data-mean={row.original.mean} data-combo={row.original.comboLabel}>
              <th scope="row">{row.original.comboLabel}</th>
              <td className="num" data-value={row.original.mean}>
                {Number.isInteger(row.original.mean) ? String(row.original.mean) : row.original.mean.toFixed(2)}
              </td>
              {scenarioIds.map((sid) => {
                const idx = scenarioIds.indexOf(sid);
                const cell = row.original.cells[idx];
                return (
                  <td
                    key={sid}
                    className="num"
                    data-value={cell?.mean || undefined}
                    data-relative={cell?.relative || undefined}
                  >
                    {cell?.label ?? "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
