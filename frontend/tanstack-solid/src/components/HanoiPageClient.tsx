import { createEffect, createSignal, Show } from "solid-js";
import { HanoiAnimate } from "~/components/HanoiAnimate";
import { HanoiTable } from "~/components/HanoiTable";

type Params = {
  n: number;
  speed: number;
  backend: "rust" | "go";
  view: "table" | "animate";
};

function parseSearch(): Params {
  if (typeof window === "undefined") {
    return { n: 5, speed: 400, backend: "rust", view: "table" };
  }
  const search = new URLSearchParams(window.location.search);
  const n = Math.min(32, Math.max(1, parseInt(search.get("n") ?? "5", 10) || 5));
  const speed = Math.max(50, parseInt(search.get("speed") ?? "400", 10) || 400);
  const backend = search.get("backend") === "go" ? "go" : "rust";
  const view = search.get("view") === "animate" ? "animate" : "table";
  return { n, speed, backend, view };
}

export function HanoiPageClient() {
  const [params] = createSignal<Params>(parseSearch());

  return (
    <div class="space-y-6">
      <div class="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
        <span>Disks: {params().n}</span>
        <span>Backend: {params().backend}</span>
        <Show when={params().view === "animate"}>
          <span class="text-xs">Speed: {params().speed} ms/move</span>
        </Show>
        <span>View: {params().view}</span>
        <span class="text-xs">
          Query: ?n={params().n}&backend={params().backend}&view={params().view}
          {params().view === "animate" ? `&speed=${params().speed}` : ""}
        </span>
      </div>

      <Show
        when={params().view === "table"}
        fallback={
          <HanoiAnimate
            n={params().n}
            backend={params().backend}
            speedMs={params().speed}
          />
        }
      >
        <HanoiTable n={params().n} backend={params().backend} />
      </Show>
    </div>
  );
}
