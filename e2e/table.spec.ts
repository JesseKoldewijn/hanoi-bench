import { expect } from "@playwright/test";
import { test } from "@playwright/test";

import { writeTiming, isBenchmarkEnabled } from "./benchmark";
import { BACKENDS, BENCHMARK_N_VALUES, expectedMovesForN } from "./constants";

function timeoutForN(n: number): number {
  if (n <= 8) return 30_000;
  if (n <= 10) return 60_000;
  if (n <= 12) return 120_000;
  if (n <= 14) return 180_000;
  if (n <= 16) return 300_000;
  return 600_000; // n=18
}

test.describe("table view", () => {
  for (const backend of BACKENDS) {
    for (const n of BENCHMARK_N_VALUES) {
      test(`${backend} – n=${n} stream completes`, async (
        { page },
        testInfo
      ) => {
        const total = expectedMovesForN(n);
        const start = isBenchmarkEnabled() ? Date.now() : 0;
        await page.goto(`/?n=${n}&view=table&backend=${backend}`);

        await expect(
          page.getByText(new RegExp(`Total moves: ${total}`))
        ).toBeVisible({ timeout: timeoutForN(n) });
        if (isBenchmarkEnabled() && start) {
          const timeToStreamCompleteMs = Date.now() - start;
          writeTiming(
            {
              scenario: `table-n${n}`,
              backend,
              timeToStreamCompleteMs,
            },
            testInfo.project.name
          );
          await testInfo.attach("timing", {
            body: JSON.stringify({
              scenario: `table-n${n}`,
              backend,
              timeToStreamCompleteMs,
            }),
          });
        }
        if (n <= 10) {
          await expect(page.getByRole("table")).toBeVisible();
          const rows = page.getByRole("table").locator("tbody tr");
          await expect(rows).toHaveCount(total);
        }
      });
    }
  }
});
