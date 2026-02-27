import { createFileRoute } from "@tanstack/solid-router";

const BACKEND_RUST =
  process.env.NITRO_BACKEND_RUST ?? "http://localhost:6001";
const BACKEND_GO = process.env.NITRO_BACKEND_GO ?? "http://localhost:6002";

export const Route = createFileRoute("/api/hanoi")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const n = Math.min(
          32,
          Math.max(1, parseInt(url.searchParams.get("n") ?? "5", 10) || 5)
        );
        const backend = url.searchParams.get("backend") === "go" ? "go" : "rust";
        const base = backend === "go" ? BACKEND_GO : BACKEND_RUST;
        const backendUrl = `${base}/hanoi?n=${encodeURIComponent(n)}`;

        try {
          const res = await fetch(backendUrl);
          const headers = new Headers();
          const contentType = res.headers.get("Content-Type");
          if (contentType) headers.set("Content-Type", contentType);
          const totalMoves = res.headers.get("X-Total-Moves");
          if (totalMoves) headers.set("X-Total-Moves", totalMoves);

          return new Response(res.body, {
            status: res.status,
            statusText: res.statusText,
            headers,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return new Response(
            JSON.stringify({ error: message }),
            {
              status: 502,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
    },
  },
});
