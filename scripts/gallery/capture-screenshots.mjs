// Re-captures the README screenshots in docs/screenshots/ from the current build.
//
// Re-run: from the repo root, on a machine where the map tiles load (the Esri tile
// server must be reachable, otherwise the map area renders blank):
//   node scripts/gallery/capture-screenshots.mjs [--build]
// Needs Playwright (set PLAYWRIGHT_MODULE and CHROMIUM_PATH if they differ from the
// defaults in lib.mjs), Python 3 with Pillow, and curl. English UI, 1x scale,
// 1440 px desktop and 390 px phone widths, same filenames as before.
import { join } from "node:path";
import { launch, newPage, open, optimizePng, ROOT, startApp, stopApp } from "./lib.mjs";

const OUT = join(ROOT, "docs/screenshots");
const MAX_KB = 700;
const D = { width: 1440, height: 900 };
const M = { width: 390, height: 844 };

await startApp({ build: process.argv.includes("--build") });
const browser = await launch();
try {
  const shots = [
    // name, path, viewport, fullPage, prepare(page)
    ["dashboard", "/", D, false],
    ["site-detail", "/site/callville-bay", D, true],
    ["report", "/report", D, true],
    ["my-reports", "/my-reports", D, false],
    ["rangers", "/rangers", D, false],
    ["oah-cities", "/oah-cities", D, false],
    ["methodology", "/methodology", D, false],
    ["coimbra-dashboard", "/", D, true, async (p) => p.getByRole("button", { name: "Coimbra" }).click()],
    ["dashboard-mobile", "/", M, false],
    ["report-mobile", "/report", M, false],
    ["my-reports-mobile", "/my-reports", M, false],
    ["rangers-mobile", "/rangers", M, false],
    ["oah-cities-mobile", "/oah-cities", M, false],
    ["methodology-mobile", "/methodology", M, false],
  ];
  for (const [name, path, vp, fullPage, prepare] of shots) {
    const { context, page } = await newPage(browser, vp);
    await open(page, path);
    if (prepare) {
      await prepare(page);
      await page.waitForTimeout(1500);
    }
    const file = join(OUT, `${name}.png`);
    await page.screenshot({ path: file, fullPage });
    optimizePng(file, MAX_KB);
    await context.close();
    console.log("wrote", file);
  }
} finally {
  await browser.close();
  stopApp();
}
