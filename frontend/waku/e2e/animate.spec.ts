import { expect } from "@playwright/test";
import { test } from "@playwright/test";

import { writeTiming, isBenchmarkEnabled, FRONTEND } from "./benchmark";
import { BACKENDS, expectedMovesForN } from "./constants";

test.describe("animate view", () => {
  for (const backend of BACKENDS) {
    test(`${backend} – n=3 stream completes and step counter reaches end`, async ({
      page,
    }, testInfo) => {
      const n = 3;
      const total = expectedMovesForN(n);
      const start = isBenchmarkEnabled() ? Date.now() : 0;
      await page.goto(`/?n=${n}&view=animate&backend=${backend}&speed=200`);

      await expect(
        page.getByText(new RegExp(`Step ${total} / ${total}`))
      ).toBeVisible({ timeout: 30_000 });
      if (isBenchmarkEnabled() && start) {
        const timeToStreamCompleteMs = Date.now() - start;
        writeTiming({
          scenario: "animate-n3",
          backend,
          frontend: FRONTEND,
          timeToStreamCompleteMs,
        });
        await testInfo.attach("timing", {
          body: JSON.stringify({
            scenario: "animate-n3",
            backend,
            timeToStreamCompleteMs,
          }),
        });
      }
    });

    test(`${backend} – n=4 stream completes and step counter reaches end`, async ({
      page,
    }, testInfo) => {
      const n = 4;
      const total = expectedMovesForN(n);
      const start = isBenchmarkEnabled() ? Date.now() : 0;
      await page.goto(`/?n=${n}&view=animate&backend=${backend}&speed=200`);

      await expect(
        page.getByText(new RegExp(`Step ${total} / ${total}`))
      ).toBeVisible({ timeout: 25_000 });
      if (isBenchmarkEnabled() && start) {
        const timeToStreamCompleteMs = Date.now() - start;
        writeTiming({
          scenario: "animate-n4",
          backend,
          frontend: FRONTEND,
          timeToStreamCompleteMs,
        });
        await testInfo.attach("timing", {
          body: JSON.stringify({
            scenario: "animate-n4",
            backend,
            timeToStreamCompleteMs,
          }),
        });
      }
    });

    test(`${backend} – n=5 stream completes and step counter reaches end`, async ({
      page,
    }, testInfo) => {
      const n = 5;
      const total = expectedMovesForN(n);
      const start = isBenchmarkEnabled() ? Date.now() : 0;
      await page.goto(`/?n=${n}&view=animate&backend=${backend}&speed=200`);

      await expect(
        page.getByText(new RegExp(`Step ${total} / ${total}`))
      ).toBeVisible({ timeout: 45_000 });
      if (isBenchmarkEnabled() && start) {
        const timeToStreamCompleteMs = Date.now() - start;
        writeTiming({
          scenario: "animate-n5",
          backend,
          frontend: FRONTEND,
          timeToStreamCompleteMs,
        });
        await testInfo.attach("timing", {
          body: JSON.stringify({
            scenario: "animate-n5",
            backend,
            timeToStreamCompleteMs,
          }),
        });
      }
    });

    test(`${backend} – n=6 stream completes and step counter reaches end`, async ({
      page,
    }, testInfo) => {
      const n = 6;
      const total = expectedMovesForN(n);
      const start = isBenchmarkEnabled() ? Date.now() : 0;
      await page.goto(`/?n=${n}&view=animate&backend=${backend}&speed=200`);

      await expect(
        page.getByText(new RegExp(`Step ${total} / ${total}`))
      ).toBeVisible({ timeout: 45_000 });
      if (isBenchmarkEnabled() && start) {
        const timeToStreamCompleteMs = Date.now() - start;
        writeTiming({
          scenario: "animate-n6",
          backend,
          frontend: FRONTEND,
          timeToStreamCompleteMs,
        });
        await testInfo.attach("timing", {
          body: JSON.stringify({
            scenario: "animate-n6",
            backend,
            timeToStreamCompleteMs,
          }),
        });
      }
    });
  }
});
