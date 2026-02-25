/**
 * Single source of truth for backends. Add a new backend here and ensure the app
 * supports it (getBackendBaseUrl, query param, VITE_BACKEND_* env).
 */
export const BACKENDS = ["rust", "go"] as const;
export type Backend = (typeof BACKENDS)[number];

/** Same n range for both table and animate views */
export const BENCHMARK_N_VALUES = [5, 8, 10, 12, 14, 16, 18] as const;

export function expectedMovesForN(n: number): number {
  return Math.pow(2, n) - 1;
}

/** Lower speed for larger n so animate benchmark completes in reasonable time */
export function getAnimateSpeedMs(n: number): number {
  if (n <= 8) return 200;
  if (n <= 10) return 100;
  if (n <= 12) return 50;
  if (n <= 14) return 25;
  return 10;
}
