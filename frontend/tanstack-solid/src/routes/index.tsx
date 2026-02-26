/// <reference path="../../.tanstack/types.ts" />
import { createFileRoute } from "@tanstack/solid-router";
import { HanoiPageClient } from "~/components/HanoiPageClient";

function parseSearchParams(search: Record<string, unknown>) {
  const n = Math.min(
    32,
    Math.max(1, parseInt(String(search?.n ?? "5"), 10) || 5)
  );
  const speed = Math.max(
    50,
    parseInt(String(search?.speed ?? "400"), 10) || 400
  );
  const backend = search?.backend === "go" ? ("go" as const) : ("rust" as const);
  const view =
    search?.view === "animate" ? ("animate" as const) : ("table" as const);
  return { n, speed, backend, view };
}

export const Route = createFileRoute("/")({
  validateSearch: parseSearchParams,
  component: Home,
});

function Home() {
  const params = Route.useSearch();
  return <HanoiPageClient params={params} />;
}
