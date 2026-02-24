import { expect } from "@playwright/test";
import { test } from "@playwright/test";

test.describe("smoke", () => {
  test("home page shows Hanoi Benchmark and default query summary", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Hanoi Benchmark" })).toBeVisible();
    await expect(page.getByText(/Disks:/)).toBeVisible();
    await expect(page.getByText(/Backend:/)).toBeVisible();
    await expect(page.getByText(/View:/)).toBeVisible();
  });

  test("query params are reflected in summary", async ({ page }) => {
    await page.goto("/?n=5&view=table&backend=rust");
    await expect(page.getByText("Disks: 5")).toBeVisible();
    await expect(page.getByText("Backend: rust")).toBeVisible();
    await expect(page.getByText("View: table")).toBeVisible();
  });

  test("animate view shows speed in summary", async ({ page }) => {
    await page.goto("/?n=3&view=animate&backend=go&speed=200");
    await expect(page.getByText(/Speed: 200/)).toBeVisible();
    await expect(page.getByText("View: animate")).toBeVisible();
  });
});
