/**
 * Debug script: captures network + console when loading TanStack animate view.
 * Run: npx tsx e2e/debug-animate.ts
 */
import { chromium } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3001";
const URL = `${BASE}/?n=3&view=animate&backend=rust&speed=200`;

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const apiRequests: { url: string; status?: number; error?: string }[] = [];
  const consoleLogs: string[] = [];

  const page = await context.newPage();

  context.on("request", (req) => {
    const url = req.url();
    if (url.includes("hanoi") || url.includes("/api/")) {
      apiRequests.push({ url });
    }
  });
  page.on("response", (res) => {
    const url = res.url();
    if (url.includes("hanoi") || url.includes("/api/")) {
      const r = apiRequests.find((x) => x.url === url);
      if (r) r.status = res.status();
    }
  });
  context.on("requestfailed", (req) => {
    const url = req.url();
    if (url.includes("hanoi") || url.includes("/api/")) {
      const r = apiRequests.find((x) => x.url === url);
      if (r) r.error = req.failure()?.errorText ?? "unknown";
    }
  });
  context.on("console", (msg) => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 15000 });

  await page.waitForTimeout(5000);

  const loadingVisible = await page.getByText("Loading moves...").isVisible();
  const step7Visible = await page.getByText(/Step 7 \/ 7/).isVisible();

  console.log("\n=== Page state after 5s ===");
  console.log("Loading moves... visible:", loadingVisible);
  console.log("Step 7 / 7 visible:", step7Visible);

  console.log("\n=== API / hanoi requests ===");
  for (const r of apiRequests) {
    console.log(r.url, "status:", r.status ?? "pending?", "error:", r.error ?? "-");
  }

  console.log("\n=== Console logs ===");
  consoleLogs.forEach((l) => console.log(l));
  if (consoleLogs.length === 0) console.log("(no console output)");

  const body = await page.locator("body").innerText();
  console.log("\n=== Page text (snippet) ===");
  console.log(body.slice(0, 800));

  await page.screenshot({ path: "e2e/debug-screenshot.png" });
  console.log("\nScreenshot saved to e2e/debug-screenshot.png");

  await browser.close();
}

main().catch(console.error);
