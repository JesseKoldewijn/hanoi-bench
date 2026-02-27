export type Move = { from: number; to: number };

export type StreamResult = {
  moves: Move[];
  totalMoves: number | null;
  error: string | null;
};

const API_BASE = "/api";

function getApiUrl(n: number, backend: "rust" | "go"): string {
  return `${API_BASE}/hanoi?n=${encodeURIComponent(n)}&backend=${backend}`;
}

export async function streamHanoiMoves(
  n: number,
  backend: "rust" | "go",
  signal?: AbortSignal
): Promise<StreamResult> {
  const url = getApiUrl(n, backend);
  const moves: Move[] = [];
  let totalMoves: number | null;

  try {
    const res = await fetch(url, signal !== undefined ? { signal } : {});
    if (!res.ok) {
      const text = await res.text();
      return {
        moves: [],
        totalMoves: null,
        error: `HTTP ${res.status}: ${text}`,
      };
    }
    totalMoves = res.headers.get("X-Total-Moves")
      ? parseInt(res.headers.get("X-Total-Moves")!, 10)
      : null;
    const reader = res.body?.getReader();
    if (!reader) return { moves, totalMoves, error: "No body" };

    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          const obj = JSON.parse(trimmed) as { from?: number; to?: number };
          if (typeof obj.from === "number" && typeof obj.to === "number") {
            moves.push({ from: obj.from, to: obj.to });
          }
        } catch {
          // skip malformed line
        }
      }
    }
    if (buffer.trim()) {
      try {
        const obj = JSON.parse(buffer.trim()) as { from?: number; to?: number };
        if (typeof obj.from === "number" && typeof obj.to === "number") {
          moves.push({ from: obj.from, to: obj.to });
        }
      } catch {
        // skip
      }
    }
    return { moves, totalMoves, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { moves, totalMoves: null, error: message };
  }
}
