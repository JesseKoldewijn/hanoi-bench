/// <reference path="../../.tanstack/types.ts" />
import { createFileRoute } from "@tanstack/solid-router";
import { HanoiPageClient } from "~/components/HanoiPageClient";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <HanoiPageClient />;
}
