// Shared helpers for build-gallery.mjs and capture-screenshots.mjs.
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const PORT = Number(process.env.GALLERY_PORT ?? 4971);
export const BASE = `http://127.0.0.1:${PORT}`;
export const WORK = join(tmpdir(), "verdant-gallery");
mkdirSync(WORK, { recursive: true });

const PW = process.env.PLAYWRIGHT_MODULE ?? "/opt/node-tools/node_modules/playwright/index.mjs";
const CHROMIUM = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";
export const { chromium } = await import(PW);

export const launch = () =>
  chromium.launch({
    ...(existsSync(CHROMIUM) ? { executablePath: CHROMIUM } : {}),
    // Sandbox-only: the proxy-bypass lets Chromium reach the local preview server.
    args: ["--proxy-bypass-list=127.0.0.1;localhost"],
  });

// ---- Fonts: the app loads Google Fonts; fetch them once with curl (honours HTTPS_PROXY)
// and serve them to Chromium from disk so captures never depend on browser networking.
const FONT_CSS_URL =
  "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Schibsted+Grotesk:wght@400;500;600;700&family=Young+Serif&display=swap";
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36";
let fontCss = null;
const fontFiles = new Map();
function curl(url, out) {
  execFileSync("curl", ["-sS", "-m", "30", "-A", UA, "-o", out, url]);
}
function prepareFonts() {
  if (fontCss !== null) return;
  const cssFile = join(WORK, "fonts.css");
  if (!existsSync(cssFile)) curl(FONT_CSS_URL, cssFile);
  fontCss = readFileSync(cssFile, "utf8");
  for (const url of fontCss.match(/https:\/\/fonts\.gstatic\.com[^)]+/g) ?? []) {
    const f = join(WORK, "font-" + Buffer.from(url).toString("base64url").slice(-40) + ".woff2");
    if (!existsSync(f)) curl(url, f);
    fontFiles.set(url, f);
  }
}
export async function serveFonts(context) {
  prepareFonts();
  await context.route(/fonts\.googleapis\.com/, (r) =>
    r.fulfill({ status: 200, contentType: "text/css", headers: { "access-control-allow-origin": "*" }, body: fontCss }));
  await context.route(/fonts\.gstatic\.com/, (r) => {
    const f = fontFiles.get(r.request().url());
    return f
      ? r.fulfill({ status: 200, contentType: "font/woff2", headers: { "access-control-allow-origin": "*" }, body: readFileSync(f) })
      : r.abort();
  });
}
export const FONTS_LINK = `<link rel="stylesheet" href="${FONT_CSS_URL}">`;

// ---- App: build (if needed) and serve with vite preview.
let server = null;
export async function startApp({ build = false } = {}) {
  try {
    if ((await fetch(BASE)).ok) return; // already serving
  } catch {}
  if (build || !existsSync(join(ROOT, "dist/index.html"))) {
    execFileSync("npm", ["run", "build"], { cwd: ROOT, stdio: "inherit" });
  }
  server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--host", "127.0.0.1", "--strictPort"], { cwd: ROOT, stdio: "ignore", detached: true });
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(BASE)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("vite preview did not start");
}
export function stopApp() {
  if (server) {
    try {
      process.kill(-server.pid); // the whole npx/vite process group
    } catch {}
  }
}

// ---- Pages
export async function newPage(browser, { width, height, dsf = 1, lang = "en", extra = {} }) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dsf, ...extra });
  await serveFonts(context);
  await context.addInitScript((l) => {
    try {
      localStorage.setItem("verdant.lang", l);
    } catch {}
  }, lang);
  const page = await context.newPage();
  return { context, page };
}
export async function open(page, path) {
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1800); // count-up animations and map settle
}

// ---- PNG optimisation with Pillow (palette quantise only when above the size limit).
export function optimizePng(file, maxKB) {
  const py = `
import sys, os
from PIL import Image
f, maxkb = sys.argv[1], int(sys.argv[2])
im = Image.open(f).convert("RGB")
im.save(f, optimize=True)
if os.path.getsize(f) > maxkb * 1024:
    im.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(f, optimize=True)
`;
  execFileSync("python3", ["-c", py, file, String(maxKB)]);
}
export const writeTmp = (name, text) => (writeFileSync(join(WORK, name), text), join(WORK, name));
