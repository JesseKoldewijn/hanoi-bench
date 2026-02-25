/// <reference path="../../.tanstack/types.ts" />
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/solid-router";
import { HydrationScript } from "solid-js/web";
import { Suspense } from "solid-js";
import { Header } from "~/components/Header";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Hanoi Benchmark" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: NotFound,
  shellComponent: RootShell,
});

function RootShell() {
  return (
    <html lang="en">
      <head>
        <HydrationScript />
        <HeadContent />
      </head>
      <body>
        <Suspense fallback={<p>Loading...</p>}>
          <div class="flex min-h-screen flex-col">
            <Header />
            <main class="container mx-auto flex-1 px-4 py-6">
              <Outlet />
            </main>
          </div>
        </Suspense>
        <Scripts />
      </body>
    </html>
  );
}
