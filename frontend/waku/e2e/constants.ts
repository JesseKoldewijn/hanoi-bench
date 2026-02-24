/**
 * Single source of truth for backends. Add a new backend here and ensure the app
 * supports it (getBackendBaseUrl, query param, VITE_BACKEND_* env).
 */
export const BACKENDS = ["rust", "go"] as const;
export type Backend = (typeof BACKENDS)[number];

export function expectedMovesForN(n: number): number {
  return Math.pow(2, n) - 1;
}
