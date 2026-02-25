import { expect } from "@playwright/test";
import { test } from "@playwright/test";

import { writeTiming, isBenchmarkEnabled } from "./benchmark";
import {
  BACKENDS,
  BENCHMARK_N_VALUES,
  expectedMovesForN,
  getAnimateSpeedMs,
} from "./constants";

function timeoutForN(n: number, speedMs: number): number {
  const totalMoves = Math.pow(2, n) - 1;
  const animateTime = totalMoves * speedMs;
  return Math.max(60_000, animateTime * 1.5);
}

test.describe("animate view", () => {
  for (const backend of BACKENDS) {
    for (const n of BENCHMARK_N_VALUES) {
      test(`${backend} – n=${n} stream completes and step counter reaches end`, async (
        { page },
        testInfo
      ) => {
        const total = expectedMovesForN(n);
        const speedMs = getAnimateSpeedMs(n);
        const start = isBenchmarkEnabled() ? Date.now() : 0;
        await page.goto(`/?n=${n}&view=animate&backend=${backend}&speed=${speedMs}`);

        await expect(page.getByText("Loading moves...")).toBeVisible();
        await expect(page.getByText("Loading moves...")).not.toBeVisible({
          timeout: 30_000,
        });

        await expect(
          page.getByText(new RegExp(`Step ${total} / ${total}`))
        ).toBeVisible({ timeout: timeoutForN(n, speedMs) });
        if (isBenchmarkEnabled() && start) {
          const timeToStreamCompleteMs = Date.now() - start;
          writeTiming(
            {
              scenario: `animate-n${n}`,
              backend,
              timeToStreamCompleteMs,
            },
            testInfo.project.name
          );
          await testInfo.attach("timing", {
            body: JSON.stringify({
              scenario: `animate-n${n}`,
              backend,
              timeToStreamCompleteMs,
            }),
          });
        }
      });
    }
  }
});
