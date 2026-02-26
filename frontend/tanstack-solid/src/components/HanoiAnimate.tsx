import { createEffect, createSignal, onCleanup } from "solid-js";
import { type Move, streamHanoiMoves } from "~/lib/api";

const ROD_LABELS = ["A", "B", "C"];

type HanoiAnimateProps = { n: number; backend: "rust" | "go"; speedMs: number };

export function HanoiAnimate(props: HanoiAnimateProps) {
  const [moves, setMoves] = createSignal<Move[]>([]);
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [stepIndex, setStepIndex] = createSignal(0);
  const [rods, setRods] = createSignal<number[][]>([[], [], []]);
  const mounted = { current: true };

  createEffect(() => {
    if (import.meta.env.SSR) return;
    const n = props.n;
    const backend = props.backend;
    mounted.current = true;
    setLoading(true);
    setError(null);
    setMoves([]);
    setStepIndex(0);
    const initial = Array.from({ length: n }, (_, i) => n - i);
    setRods([initial, [], []]);
    streamHanoiMoves(n, backend).then((res) => {
      setMoves(res.moves);
      setError(res.error);
      setLoading(false);
    });
    onCleanup(() => {
      mounted.current = false;
    });
  });

  createEffect(() => {
    if (loading() || error() || moves().length === 0) return;
    const idx = stepIndex();
    if (idx >= moves().length) return;
    const speedMs = props.speedMs;
    const t = setTimeout(() => {
      if (!mounted.current) return;
      const move = moves()[idx]!;
      setRods((prev) => {
        const next = prev.map((stack) => [...stack]);
        if (next[move.from]!.length === 0) return prev;
        const disk = next[move.from]!.pop()!;
        next[move.to]!.push(disk);
        return next;
      });
      setStepIndex((s) => s + 1);
    }, speedMs);
    onCleanup(() => clearTimeout(t));
  });

  if (loading())
    return <p class="text-muted-foreground">Loading moves...</p>;
  if (error())
    return <p class="text-red-600 dark:text-red-400">Error: {error()}</p>;

  const moveList = moves();
  const step = stepIndex();
  const maxHeight = props.n;

  return (
    <div class="space-y-4">
      <p class="text-muted-foreground text-sm">
        Step {Math.min(step, moveList.length)} / {moveList.length}
      </p>
      <div
        class="flex items-end justify-around gap-4"
        style={{ "min-height": `${maxHeight * 24 + 80}px` }}
      >
        {[0, 1, 2].map((rodIndex) => (
          <div
            class="flex max-w-[120px] flex-1 flex-col items-center"
          >
            <div class="mb-1 text-sm font-medium">
              {ROD_LABELS[rodIndex]}
            </div>
            <div
              class="bg-muted-foreground/30 w-1 flex-1 rounded-b"
              style={{ "min-height": `${maxHeight * 20}px` }}
            />
            <div class="mt-1 flex w-full flex-col-reverse items-center gap-0.5">
              {(rods()[rodIndex] ?? []).map((size, i) => (
                <div
                  class="bg-primary h-5 rounded transition-all duration-300 ease-out"
                  style={{
                    width: `${Math.max(24, 24 + size * 16)}px`,
                    "min-width": "24px",
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
