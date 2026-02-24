import { expect } from "@playwright/test";
import { test } from "@playwright/test";

import { writeTiming, isBenchmarkEnabled, FRONTEND } from "./benchmark";
import { BACKENDS, expectedMovesForN } from "./constants";

test.describe("table view", () => {
  for (const backend of BACKENDS) {
    test(`${backend} – n=5 shows total moves and table`, async ({
      page,
    }, testInfo) => {
      const n = 5;
      const total = expectedMovesForN(n);
      const start = isBenchmarkEnabled() ? Date.now() : 0;
      await page.goto(`/?n=${n}&view=table&backend=${backend}`);

      await expect(
        page.getByText(new RegExp(`Total moves: ${total}`))
      ).toBeVisible({ timeout: 30_000 });
      if (isBenchmarkEnabled() && start) {
        const timeToStreamCompleteMs = Date.now() - start;
        writeTiming({
          scenario: "table-n5",
          backend,
          frontend: FRONTEND,
          timeToStreamCompleteMs,
        });
        await testInfo.attach("timing", {
          body: JSON.stringify({
            scenario: "table-n5",
            backend,
            timeToStreamCompleteMs,
          }),
        });
      }
      await expect(page.getByRole("table")).toBeVisible();
      const rows = page.getByRole("table").locator("tbody tr");
      await expect(rows).toHaveCount(total);
    });

    test(`${backend} – n=10 stream completes`, async ({
      page,
    }, testInfo) => {
      const n = 10;
      const total = expectedMovesForN(n);
      const start = isBenchmarkEnabled() ? Date.now() : 0;
      await page.goto(`/?n=${n}&view=table&backend=${backend}`);

      await expect(
        page.getByText(new RegExp(`Total moves: ${total}`))
      ).toBeVisible({ timeout: 60_000 });
      if (isBenchmarkEnabled() && start) {
        const timeToStreamCompleteMs = Date.now() - start;
        writeTiming({
          scenario: "table-n10",
          backend,
          frontend: FRONTEND,
          timeToStreamCompleteMs,
        });
        await testInfo.attach("timing", {
          body: JSON.stringify({
            scenario: "table-n10",
            backend,
            timeToStreamCompleteMs,
          }),
        });
      }
    });

    test(`${backend} – n=8 stream completes`, async ({
      page,
    }, testInfo) => {
      const n = 8;
      const total = expectedMovesForN(n);
      const start = isBenchmarkEnabled() ? Date.now() : 0;
      await page.goto(`/?n=${n}&view=table&backend=${backend}`);

      await expect(
        page.getByText(new RegExp(`Total moves: ${total}`))
      ).toBeVisible({ timeout: 60_000 });
      if (isBenchmarkEnabled() && start) {
        const timeToStreamCompleteMs = Date.now() - start;
        writeTiming({
          scenario: "table-n8",
          backend,
          frontend: FRONTEND,
          timeToStreamCompleteMs,
        });
        await testInfo.attach("timing", {
          body: JSON.stringify({
            scenario: "table-n8",
            backend,
            timeToStreamCompleteMs,
          }),
        });
      }
    });

    test(`${backend} – n=12 stream completes (stress)`, async ({
      page,
    }, testInfo) => {
      const n = 12;
      const total = expectedMovesForN(n);
      const start = isBenchmarkEnabled() ? Date.now() : 0;
      await page.goto(`/?n=${n}&view=table&backend=${backend}`);

      await expect(
        page.getByText(new RegExp(`Total moves: ${total}`))
      ).toBeVisible({ timeout: 120_000 });
      if (isBenchmarkEnabled() && start) {
        const timeToStreamCompleteMs = Date.now() - start;
        writeTiming({
          scenario: "table-n12",
          backend,
          frontend: FRONTEND,
          timeToStreamCompleteMs,
        });
        await testInfo.attach("timing", {
          body: JSON.stringify({
            scenario: "table-n12",
            backend,
            timeToStreamCompleteMs,
          }),
        });
      }
    });
  }
});
