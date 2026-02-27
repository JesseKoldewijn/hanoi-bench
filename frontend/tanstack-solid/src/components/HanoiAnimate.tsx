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

  createEffect(() => {
    if (import.meta.env.SSR) return;
    const n = props.n;
    const backend = props.backend;
    setLoading(true);
    setError(null);
    setMoves([]);
    const initial = Array.from({ length: n }, (_, i) => n - i);
    setRods([initial, [], []]);
    setStepIndex(0);
    const controller = new AbortController();
    streamHanoiMoves(n, backend, controller.signal)
      .then((res) => {
        setMoves(res.moves);
        setError(res.error);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });
    onCleanup(() => controller.abort());
  });

  createEffect(() => {
    if (loading() || error() || moves().length === 0) return;
    const moveList = moves();
    const idx = stepIndex();
    if (idx >= moveList.length) return;
    const speedMs = props.speedMs;
    const t = setTimeout(() => {
      const currentMoves = moves();
      if (idx >= currentMoves.length) return;
      const move = currentMoves[idx]!;
      setRods((prev) => {
        const next = prev.map((stack) => [...stack]);
        if (next[move.from]!.length === 0) return prev;
        const disk = next[move.from]!.pop()!;
        next[move.to]!.push(disk);
        return prev;
      });
      setStepIndex((s) => s + 1);
    }, speedMs);
    onCleanup(() => clearTimeout(t));
  });

  return (
    <>
      {loading() && moves().length === 0 && (
        <p class="text-muted-foreground">Loading moves...</p>
      )}
      {error() && (
        <p class="text-red-600 dark:text-red-400">Error: {error()}</p>
      )}
      {!loading() && !error() && (
        <div class="space-y-4">
          <p class="text-muted-foreground text-sm">
            Step {Math.min(stepIndex(), moves().length)} / {moves().length}
          </p>
          <div
            class="flex items-end justify-around gap-4"
            style={{ "min-height": `${props.n * 24 + 80}px` }}
          >
            {[0, 1, 2].map((rodIndex) => (
              <div
                key={rodIndex}
                class="flex max-w-[120px] flex-1 flex-col items-center"
              >
                <div class="mb-1 text-sm font-medium">
                  {ROD_LABELS[rodIndex]}
                </div>
                <div
                  class="bg-muted-foreground/30 w-1 flex-1 rounded-b"
                  style={{ "min-height": `${props.n * 20}px` }}
                />
                <div class="mt-1 flex w-full flex-col-reverse items-center gap-0.5">
                  {(rods()[rodIndex] ?? []).map((size, i) => (
                    <div
                      key={`${rodIndex}-${i}-${size}`}
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
      )}
    </>
  );
}
