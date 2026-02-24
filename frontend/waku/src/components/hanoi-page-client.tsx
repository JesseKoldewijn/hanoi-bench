"use client";

import { useEffect, useState } from "react";

import { HanoiAnimate } from "@/components/hanoi-animate";
import { HanoiTable } from "@/components/hanoi-table";

function useSearchParams() {
  const [params, setParams] = useState({
    n: 5,
    speed: 400,
    backend: "rust" as "rust" | "go",
    view: "table" as "table" | "animate",
  });

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const n = Math.min(
      32,
      Math.max(1, parseInt(search.get("n") ?? "5", 10) || 5)
    );
    const speed = Math.max(
      50,
      parseInt(search.get("speed") ?? "400", 10) || 400
    );
    const backend = search.get("backend") === "go" ? "go" : "rust";
    const view = search.get("view") === "animate" ? "animate" : "table";
    setParams({ n, speed, backend, view });
  }, []);

  return params;
}

export function HanoiPageClient() {
  const { n, speed, backend, view } = useSearchParams();

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
        <span>Disks: {n}</span>
        <span>Backend: {backend}</span>
        {view === "animate" && <span>Speed: {speed} ms/move</span>}
        <span>View: {view}</span>
        <span className="text-xs">
          Query: ?n={n}&backend={backend}&view={view}
          {view === "animate" ? `&speed=${speed}` : ""}
        </span>
      </div>

      {view === "table" ? (
        <HanoiTable n={n} backend={backend} />
      ) : (
        <HanoiAnimate n={n} backend={backend} speedMs={speed} />
      )}
    </div>
  );
}
