"use client";

import { useEffect, useRef, useState } from "react";

import { type Move, streamHanoiMoves } from "@/lib/api";

const ROD_LABELS = ["A", "B", "C"];

type HanoiAnimateProps = { n: number; backend: "rust" | "go"; speedMs: number };

export function HanoiAnimate({ n, backend, speedMs }: HanoiAnimateProps) {
  const [moves, setMoves] = useState<Move[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [rods, setRods] = useState<number[][]>([[], [], []]);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setLoading(true);
    setError(null);
    setMoves([]);
    setStepIndex(0);
    const initial = Array.from({ length: n }, (_, i) => n - i);
    setRods([initial, [], []]);
    streamHanoiMoves(n, backend).then((res) => {
      if (!mounted.current) return;
      setMoves(res.moves);
      setError(res.error);
      setLoading(false);
    });
    return () => {
      mounted.current = false;
    };
  }, [n, backend]);

  useEffect(() => {
    if (loading || error || moves.length === 0 || stepIndex >= moves.length)
      return;

    const t = setTimeout(() => {
      if (!mounted.current) return;
      const move = moves[stepIndex];
      setRods((prev) => {
        const next = prev.map((stack) => [...stack]);
        if (next[move!.from]!.length === 0) return prev;
        const disk = next[move!.from]!.pop()!;
        next[move!.to]!.push(disk);
        return next;
      });
      setStepIndex((s) => s + 1);
    }, speedMs);

    return () => clearTimeout(t);
  }, [stepIndex, moves, loading, error, speedMs]);

  if (loading) return <p className="text-muted-foreground">Loading moves...</p>;
  if (error)
    return <p className="text-red-600 dark:text-red-400">Error: {error}</p>;

  const maxHeight = n;

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Step {Math.min(stepIndex, moves.length)} / {moves.length}
      </p>
      <div
        className="flex items-end justify-around gap-4"
        style={{ minHeight: maxHeight * 24 + 80 }}
      >
        {[0, 1, 2].map((rodIndex) => (
          <div
            key={rodIndex}
            className="flex max-w-[120px] flex-1 flex-col items-center"
          >
            <div className="mb-1 text-sm font-medium">
              {ROD_LABELS[rodIndex]}
            </div>
            <div
              className="bg-muted-foreground/30 w-1 flex-1 rounded-b"
              style={{ minHeight: maxHeight * 20 }}
            />
            <div className="mt-1 flex w-full flex-col-reverse items-center gap-0.5">
              {rods[rodIndex]?.map((size, i) => (
                <div
                  key={`${rodIndex}-${i}-${size}`}
                  className="bg-primary h-5 rounded transition-all duration-300 ease-out"
                  style={{
                    width: Math.max(24, 24 + size * 16),
                    minWidth: 24,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
