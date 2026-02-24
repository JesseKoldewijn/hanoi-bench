"use client";

import { useEffect, useState } from "react";

import { type Move, streamHanoiMoves } from "@/lib/api";

const ROD_LABELS: Record<number, string> = { 0: "A", 1: "B", 2: "C" };

type HanoiTableProps = { n: number; backend: "rust" | "go" };

export function HanoiTable({ n, backend }: HanoiTableProps) {
  const [moves, setMoves] = useState<Move[]>([]);
  const [totalMoves, setTotalMoves] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setMoves([]);
    setTotalMoves(null);
    const controller = new AbortController();
    streamHanoiMoves(n, backend, controller.signal).then((res) => {
      setMoves(res.moves);
      setTotalMoves(res.totalMoves);
      setError(res.error);
      setLoading(false);
    });
    return () => controller.abort();
  }, [n, backend]);

  if (loading && moves.length === 0) {
    return <p className="text-[var(--muted-foreground)]">Loading moves...</p>;
  }

  if (error) {
    return <p className="text-red-600 dark:text-red-400">Error: {error}</p>;
  }

  const total = totalMoves ?? moves.length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--muted-foreground)]">
        Total moves: {total} (2^{n} − 1 = {Math.pow(2, n) - 1})
      </p>
      <div className="overflow-hidden rounded-md border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              <th className="p-3 text-left font-medium">Step</th>
              <th className="p-3 text-left font-medium">From</th>
              <th className="p-3 text-left font-medium">To</th>
            </tr>
          </thead>
          <tbody>
            {moves.map((move, i) => (
              <tr
                key={i}
                className="border-b border-[var(--border)] last:border-0"
              >
                <td className="p-3">{i + 1}</td>
                <td className="p-3">{ROD_LABELS[move.from] ?? move.from}</td>
                <td className="p-3">{ROD_LABELS[move.to] ?? move.to}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
