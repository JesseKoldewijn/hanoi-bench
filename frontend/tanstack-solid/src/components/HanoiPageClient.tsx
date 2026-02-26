import type { Accessor } from "solid-js";
import { Show } from "solid-js";
import { HanoiAnimate } from "~/components/HanoiAnimate";
import { HanoiTable } from "~/components/HanoiTable";

export type HanoiParams = {
  n: number;
  speed: number;
  backend: "rust" | "go";
  view: "table" | "animate";
};

const DEFAULT_PARAMS: HanoiParams = {
  n: 5,
  speed: 400,
  backend: "rust",
  view: "table",
};

type HanoiPageClientProps = {
  params: Accessor<HanoiParams> | HanoiParams;
};

export function HanoiPageClient(props: HanoiPageClientProps) {
  const params = (): HanoiParams => {
    const p = props.params;
    return (typeof p === "function" ? p() : p) ?? DEFAULT_PARAMS;
  };

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
