import { expect } from "@playwright/test";
import { test } from "@playwright/test";

test.describe("error handling", () => {
  test("shows error message when backend returns 500", async ({ page }) => {
    await page.route("**/hanoi?*", (route) =>
      route.fulfill({ status: 500, body: "Internal Server Error" })
    );
    await page.goto("/?n=5&view=table&backend=rust");

    await expect(page.getByText(/Error:/)).toBeVisible({ timeout: 10_000 });
  });

  test("shows error when backend request fails", async ({ page }) => {
    await page.route("**/hanoi?*", (route) => route.abort("connectionfailed"));
    await page.goto("/?n=5&view=table&backend=go");

    await expect(page.getByText(/Error:/)).toBeVisible({ timeout: 10_000 });
  });
});
