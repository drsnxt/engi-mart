import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const browser = await chromium.launch({
  executablePath: "/home/darshan/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome",
});
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});

const result = {};

await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Build bench sheet" }).click();
await page.waitForURL(/\/b\/b_[A-Za-z0-9_-]+/, { timeout: 30000 });
const workspaceUrl = page.url();
const viewId = workspaceUrl.split("/b/")[1].split("/")[0];
result.workspaceUrl = workspaceUrl;
result.viewId = viewId;
result.workspaceTitle = await page.locator(".workspace-titlebar h1").innerText();
result.storedEditToken = await page.evaluate((id) => Boolean(localStorage.getItem(`engi-mart:edit:${id}`)), viewId);
result.workspaceRows = await page.locator("table.bench-table tbody tr").count();
result.workspaceMatched = await page.locator(".bench-mapped").innerText();
result.cheapestTotal = await page.locator(".summary-range").innerText();
result.planLinks = await page.locator(".summary-actions a").count();
await page.screenshot({ path: "screenshots/integration-workspace-desktop.png" });

await page.goto(`${BASE}/b/${viewId}/plans`, { waitUntil: "networkidle" });
result.planCards = await page.locator(".plan-card").count();
result.planNames = await page.locator(".plan-card .plan-name").allInnerTexts();
result.plansLede = await page.locator(".lede").innerText();
result.planTotals = await page.locator(".plan-card-total strong").allInnerTexts();
result.fastestRunHref = await page.locator('a[href*="plan=fastest"]').first().getAttribute("href");
result.cheapestRunHref = await page.locator('a[href*="plan=cheapest"]').first().getAttribute("href");
await page.screenshot({ path: "screenshots/integration-plans-desktop.png" });

await page.goto(`${BASE}/b/${viewId}/run?plan=fastest`, { waitUntil: "networkidle" });
result.runTitle = await page.locator("#run-title").innerText();
result.fastestCoverage = await page.locator(".run-sub").innerText();
result.fastestMissing = await page.locator(".run-missing").innerText();
result.fastestStops = await page.locator(".run-stop").count();
await page.screenshot({ path: "screenshots/integration-run-fastest-desktop.png" });

await page.goto(`${BASE}/b/${viewId}/run?plan=cheapest`, { waitUntil: "networkidle" });
result.runStops = await page.locator(".run-stop").count();
result.runChecks = await page.locator(".run-check").count();
result.runTotal = await page.locator(".run-total-value").innerText();
result.cheapestCoverage = await page.locator(".run-sub").innerText();
await page.screenshot({ path: "screenshots/integration-run-desktop.png" });

await page.setViewportSize({ width: 390, height: 844 });
for (const [name, path] of [
  ["workspace", `/b/${viewId}`],
  ["plans", `/b/${viewId}/plans`],
  ["run", `/b/${viewId}/run?plan=fastest`],
]) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  result[`${name}MobileOverflow`] = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  );
  await page.screenshot({ path: `screenshots/integration-${name}-mobile.png` });
}

await page.setViewportSize({ width: 1440, height: 900 });
const demoResponse = await page.goto(BASE + "/b/demo", { waitUntil: "networkidle" });
result.demoStatus = demoResponse?.status();
result.demoHeading = await page.locator("h1").innerText();

await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.getByRole("tab", { name: "Describe idea" }).click();
await page
  .locator("#panel-idea textarea")
  .fill("Balcony plant watering rig with ESP32 and soil sensor");
await page.getByRole("button", { name: "Draft a bench sheet" }).click();
await page.waitForURL(/\/b\/b_[A-Za-z0-9_-]+/, { timeout: 30000 });
result.ideaWorkspaceUrl = page.url();
result.ideaTitle = await page.locator(".workspace-titlebar h1").innerText();

result.errors = errors;

console.log(JSON.stringify(result, null, 2));
await browser.close();
