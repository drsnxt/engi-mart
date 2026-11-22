import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const CHROME = "/home/darshan/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome";
const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};
const PAGES = [
  ["home", "/"],
  ["demo-workspace", "/b/demo"],
  ["demo-plans", "/b/demo/plans"],
  ["demo-run", "/b/demo/run"],
];
const DYNAMIC_ID = "b_929b12dc99";
const browser = await chromium.launch({ executablePath: CHROME });
const result = { screenshots: [], overflows: [], smallText: [], errors: [] };

async function inspect(page, label) {
  const data = await page.evaluate(() => {
    const sizes = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim();
      if (!text) continue;
      const el = node.parentElement;
      if (!el || seen.has(el)) continue;
      seen.add(el);
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      const size = Number.parseFloat(style.fontSize);
      if (size > 0 && size < 11) sizes.push({ text: text.slice(0, 40), size, tag: el.tagName, cls: el.className });
    }
    return {
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      small: sizes.slice(0, 12),
    };
  });
  if (data.overflow) result.overflows.push({ label, ...data });
  if (data.small.length) result.smallText.push({ label, small: data.small });
}

for (const theme of ["light", "dark"]) {
  for (const [sizeName, viewport] of Object.entries(VIEWPORTS)) {
    const context = await browser.newContext({ viewport, colorScheme: theme });
    await context.addInitScript((value) => {
      localStorage.setItem("engi-mart:theme", value);
    }, theme);
    const page = await context.newPage();
    page.on("pageerror", (error) => result.errors.push(String(error)));
    page.on("console", (message) => {
      if (message.type() === "error") result.errors.push(message.text());
    });

    for (const [name, path] of PAGES) {
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      const actual = await page.evaluate(() => document.documentElement.dataset.theme);
      const file = `screenshots/${theme}-${name}-${sizeName}.png`;
      await page.screenshot({ path: file });
      result.screenshots.push(file);
      await inspect(page, `${theme}/${sizeName}/${name}`);
      result[`theme-${theme}-${sizeName}-${name}`] = actual;
    }

    if (sizeName === "mobile") {
      await page.setViewportSize({ width: 320, height: 800 });
      for (const [name, path] of PAGES) {
        await page.goto(BASE + path, { waitUntil: "networkidle" });
        await inspect(page, `${theme}/320/${name}`);
      }
    }

    await context.close();
  }
}

// System default and persistence.
const prefContext = await browser.newContext({ viewport: VIEWPORTS.desktop, colorScheme: "dark" });
const prefPage = await prefContext.newPage();
await prefPage.goto(BASE + "/", { waitUntil: "networkidle" });
result.systemPrefDark = await prefPage.evaluate(() => document.documentElement.dataset.theme);
await prefPage.getByRole("button", { name: "Toggle dark mode" }).click();
result.afterToggle = await prefPage.evaluate(() => ({
  theme: document.documentElement.dataset.theme,
  stored: localStorage.getItem("engi-mart:theme"),
}));
await prefPage.reload({ waitUntil: "networkidle" });
result.afterReload = await prefPage.evaluate(() => document.documentElement.dataset.theme);
await prefContext.close();

// Dynamic workspace re-check, plus high-contrast in both themes.
for (const theme of ["light", "dark"]) {
  const context = await browser.newContext({ viewport: VIEWPORTS.desktop, colorScheme: theme });
  await context.addInitScript((value) => localStorage.setItem("engi-mart:theme", value), theme);
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") result.errors.push(message.text());
  });
  for (const [name, path] of [
    ["dynamic-workspace", `/b/${DYNAMIC_ID}`],
    ["dynamic-plans", `/b/${DYNAMIC_ID}/plans`],
    ["dynamic-run", `/b/${DYNAMIC_ID}/run?plan=cheapest`],
  ]) {
    const response = await page.goto(BASE + path, { waitUntil: "networkidle" });
    result[`${theme}-${name}-status`] = response?.status();
    await inspect(page, `${theme}/dynamic/${name}`);
    if (theme === "dark" || name === "dynamic-workspace") {
      const file = `screenshots/${theme}-${name}-desktop.png`;
      await page.screenshot({ path: file });
      result.screenshots.push(file);
    }
  }
  await page.goto(BASE + "/b/demo/run", { waitUntil: "networkidle" });
  const hc = page.getByRole("button", { name: /High contrast/ });
  await hc.click();
  result[`${theme}-highContrast`] = await page.evaluate(() => {
    const card = document.querySelector(".run-card");
    const style = card ? getComputedStyle(card) : null;
    return { background: style?.backgroundColor, color: style?.color };
  });
  await page.setViewportSize(VIEWPORTS.mobile);
  await page.goto(BASE + "/b/demo", { waitUntil: "networkidle" });
  await inspect(page, `${theme}/mobile/demo-workspace`);
  await context.close();
}

console.log(JSON.stringify(result, null, 2));
await browser.close();
