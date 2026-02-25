import { createEffect, createSignal } from "solid-js";
import { useLocation } from "@tanstack/solid-router";
import { HanoiAnimate } from "./HanoiAnimate";
import { HanoiTable } from "./HanoiTable";

function useSearchParams() {
  const location = useLocation();
  const [params, setParams] = createSignal({
    n: 5,
    speed: 400,
    backend: "rust" as "rust" | "go",
    view: "table" as "table" | "animate",
  });

  createEffect(() => {
    const searchStr = location().searchStr ?? "";
    const search = new URLSearchParams(
      searchStr.startsWith("?") ? searchStr.slice(1) : searchStr
    );
    const n = Math.min(
      32,
      Math.max(1, parseInt(search.get("n") ?? "5", 10) || 5)
    );
    const speed = Math.max(50, parseInt(search.get("speed") ?? "400", 10) || 400);
    const backend = search.get("backend") === "go" ? "go" : "rust";
    const view = search.get("view") === "animate" ? "animate" : "table";
    setParams({ n, speed, backend, view });
  });

  return params;
}

export function HanoiPageClient() {
  const params = useSearchParams();
  const p = () => params();

  return (
    <div class="space-y-6">
      <div class="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
        <span>Disks: {p().n}</span>
        <span>Backend: {p().backend}</span>
        {p().view === "animate" && <span>Speed: {p().speed} ms/move</span>}
        <span>View: {p().view}</span>
        <span class="text-xs">
          Query: ?n={p().n}&backend={p().backend}&view={p().view}
          {p().view === "animate" ? `&speed=${p().speed}` : ""}
        </span>
      </div>

      {p().view === "table" ? (
        <HanoiTable n={p().n} backend={p().backend} />
      ) : (
        <HanoiAnimate
          n={p().n}
          backend={p().backend}
          speedMs={p().speed}
        />
      )}
    </div>
  );
}
