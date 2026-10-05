// Builds the Devpost gallery: docs/gallery/01..06 PNGs (1800x1200) and carousel.gif.
//
// Re-run with real map tiles: on a machine where server.arcgisonline.com loads, from
// the repo root run
//   npm ci && node scripts/gallery/build-gallery.mjs --build
// (--build runs `npm run build` first; the script serves dist/ with `vite preview`
// on port 4971). Needs Playwright with a Chromium (set PLAYWRIGHT_MODULE and
// CHROMIUM_PATH if they differ from lib.mjs), Python 3 with Pillow, and curl.
// Picture 06 is a slide from docs/presentation/verdant-presentation.pptx: the script
// renders slide 2 with soffice + pdftoppm, or uses the PNG named in SLIDE_PNG.
// Raw captures go to a temp folder, are laid out in HTML pages (Young Serif and DM Mono
// captions), and are screenshotted at 1800x1200. No map imagery is ever drawn by hand.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { FONTS_LINK, launch, newPage, open, optimizePng, ROOT, serveFonts, startApp, stopApp, WORK } from "./lib.mjs";

const OUT = join(ROOT, "docs/gallery");
const CAP = join(WORK, "cap");
mkdirSync(OUT, { recursive: true });
mkdirSync(CAP, { recursive: true });

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.29 0 0 0 0 0.18 0 0 0 0.07 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const CSS = `
:root{--bg:#f2ecdd;--card:#faf6ec;--fg:#1e2b22;--muted:#5a5644;--border:#cfc3a5;--bar:#e8dfcb;--primary:#1f4d3a;--ochre:#b7791f;--ochre-ink:#8a5a12}
*{box-sizing:border-box;margin:0}
html,body{width:1800px;height:1200px;overflow:hidden}
body{background:var(--bg) ${NOISE};color:var(--fg);font-family:"Schibsted Grotesk",sans-serif;position:relative}
.abs{position:absolute}
.frame{position:absolute;background:var(--card);border:1px solid var(--border);border-radius:3px;box-shadow:0 4px 18px rgb(30 43 34/.10),0 1px 2px rgb(30 43 34/.08);overflow:hidden}
.chrome{height:36px;background:var(--bar);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 14px;gap:14px;font:400 13px "DM Mono",monospace;color:var(--muted)}
.dots{display:flex;gap:6px}.dots i{width:10px;height:10px;border-radius:50%;border:1px solid var(--border);background:var(--card)}
.url{flex:1;max-width:420px;height:22px;border:1px solid var(--border);background:var(--card);border-radius:3px;padding:0 10px;display:flex;align-items:center}
.crop{position:absolute;overflow:hidden}.crop img{position:absolute;max-width:none;display:block}
.title{font-family:"Young Serif",Georgia,serif;font-weight:400;line-height:1.1;letter-spacing:-0.01em}
.mono{font:400 17px/1.4 "DM Mono",monospace;color:var(--muted)}
.note{font:500 20px/1.35 "DM Mono",monospace;color:var(--ochre-ink)}
svg.arrow{position:absolute;overflow:visible}
svg.arrow path{fill:none;stroke:var(--ochre);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
`;
const page = (body, extraCss = "") =>
  `<!doctype html><html><head><meta charset="utf-8">${FONTS_LINK}<style>${CSS}${extraCss}</style></head><body>${body}</body></html>`;

/** A scaled crop of a raw capture. (x,y,w,h) are CSS px of the captured page; s scales it. */
const crop = (file, natW, x, y, w, h, s, left, top, extra = "") =>
  `<div class="crop" style="left:${left}px;top:${top}px;width:${w * s}px;height:${h * s}px;${extra}"><img src="${file}" style="left:${-x * s}px;top:${-y * s}px;width:${natW * s}px"></div>`;
const arrowH = (x1, y1, x2, y2) => {
  const mx = x1 + (x2 - x1) * 0.5;
  return `<svg class="abs" style="left:0;top:0;pointer-events:none" width="1800" height="1200"><path d="M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2} M${x2 - 14} ${y2 - 9} L${x2} ${y2} L${x2 - 14} ${y2 + 9}" style="fill:none;stroke:#b7791f;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round"/></svg>`;
};
/** Hand-drawn style curved arrow from (x1,y1) to (x2,y2) with an open arrowhead. */
const arrowTo = (x1, y1, x2, y2, bend = 0.5) => {
  const my = y1 + (y2 - y1) * bend;
  const ang = Math.atan2(y2 - my, x2 - x2 + 0.001);
  const hx = 11, a1 = Math.atan2(y2 - my, 0.001) ;
  const dir = y2 >= my ? 1 : -1;
  return `<svg class="abs" style="left:0;top:0;pointer-events:none" width="1800" height="1200"><path d="M${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2} M${x2 - 9} ${y2 - dir * 14} L${x2} ${y2} L${x2 + 9} ${y2 - dir * 14}" style="fill:none;stroke:#b7791f;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round"/></svg>`;
};
const caption = (title, sub, left, top, width = 560) =>
  `<div class="abs" style="left:${left}px;top:${top}px;width:${width}px"><div class="title" style="font-size:44px">${title}</div><div class="mono" style="margin-top:10px">${sub}</div></div>`;

// ------------------------------------------------------------------ captures
const boxOf = async (loc) => {
  const b = await loc.first().boundingBox();
  const y = await loc.first().page().evaluate(() => window.scrollY);
  return { x: b.x, y: b.y + y, w: b.width, h: b.height };
};

async function captureAll(browser) {
  const meta = {};
  const shot = (page, name, opts = {}) => page.screenshot({ path: join(CAP, name + ".png"), ...opts });

  // Dashboard and site page, desktop.
  {
    const { context, page } = await newPage(browser, { width: 1440, height: 900, dsf: 2 });
    await open(page, "/");
    await shot(page, "dash", { fullPage: true });
    meta.dash = {
      hero: await boxOf(page.locator("section").first()),
      kpi: await boxOf(page.locator("h1")),
      list: await boxOf(page.locator("section", { has: page.locator("h2", { hasText: "Sampling priority list" }) })),
      feed: await boxOf(page.locator("section", { has: page.locator("h2", { hasText: "Community reports" }) })),
    };
    await open(page, "/site/callville-bay");
    await shot(page, "site", { fullPage: true });
    meta.site = {
      card: await boxOf(page.locator("section").first()),
      advisory: await boxOf(page.getByText("Official advisory: none issued")),
      why: await boxOf(page.locator("section", { has: page.locator("h2", { hasText: "Why is risk elevated?" }) })),
    };
    await context.close();
  }

  // Phones: report steps 1, 2, 3.
  {
    const { context, page } = await newPage(browser, { width: 390, height: 844, dsf: 2 });
    await open(page, "/report");
    await page.getByRole("radio", { name: /Callville Bay/ }).click();
    await shot(page, "phone1");
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.waitForTimeout(500);
    await page.getByRole("radio", { name: "Looks like a bloom" }).click();
    await page.getByText("Is it a bloom?").first().evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 80, behavior: "instant" }));
    await page.waitForTimeout(600);
    await shot(page, "phone2");
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.waitForTimeout(600);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await shot(page, "phone3");
    await context.close();
  }

  // Report flow: submit, ranger requests a sample, then confirms; capture queue and outcome.
  {
    const { context, page } = await newPage(browser, { width: 1440, height: 900, dsf: 2 });
    await open(page, "/report");
    await page.getByRole("radio", { name: /Callville Bay/ }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.waitForTimeout(400);
    await page.getByRole("radio", { name: "Looks like a bloom" }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: "Submit report" }).click();
    await page.waitForTimeout(1500);
    await open(page, "/rangers");
    const mine = page.locator("article", { hasText: "Submitted in this session" }).first();
    const art = (await mine.count()) ? mine : page.locator("article").first();
    await art.getByRole("button", { name: "Request field sample" }).click();
    await page.waitForTimeout(900);
    await shot(page, "rangers-a", { fullPage: true });
    meta.ranger = { art: await boxOf(art), h1: await boxOf(page.locator("h1")) };
    await art.getByRole("button", { name: "Confirmed by field sample" }).click();
    await page.waitForTimeout(600);
    await open(page, "/my-reports");
    await shot(page, "myreports", { fullPage: true });
    const card = page.locator("li", { hasText: "You got it right" }).first();
    meta.mine = { card: await boxOf((await card.count()) ? card : page.getByText("You got it right").first()) };
    await context.close();
  }

  // Languages: the same top of the dashboard in en, pt, nb.
  for (const lang of ["en", "pt", "nb"]) {
    const { context, page } = await newPage(browser, { width: 640, height: 900, dsf: 2, lang });
    await open(page, "/");
    await shot(page, "lang-" + lang, { fullPage: true });
    await context.close();
  }
  writeFileSync(join(CAP, "meta.json"), JSON.stringify(meta, null, 1));
  return meta;
}

// ------------------------------------------------------------------ slide
function slidePng() {
  if (process.env.SLIDE_PNG && existsSync(process.env.SLIDE_PNG)) return process.env.SLIDE_PNG;
  const pptx = join(ROOT, "docs/presentation/verdant-presentation.pptx");
  execFileSync("soffice", ["--headless", "--convert-to", "pdf", "--outdir", WORK, pptx], { stdio: "ignore" });
  execFileSync("pdftoppm", ["-r", "220", "-f", "2", "-l", "2", "-png", join(WORK, "verdant-presentation.pdf"), join(WORK, "slide")]);
  return join(WORK, "slide-2.png");
}

// ------------------------------------------------------------------ layouts
function layouts(m) {
  const L = {};

  // 01 dashboard hero
  {
    const s = 0.9, fx = 70, fy = 70;
    const fw = 1440 * s + 2;
    const topH = m.dash.list.y - 16, lh = m.dash.list.h;
    const fh = 37 + (topH + 20 + lh + 20) * s;
    let html = `<div class="frame" style="left:${fx}px;top:${fy}px;width:${fw}px;height:${fh}px;background:#eee8d8"><div class="chrome"><div class="dots"><i></i><i></i><i></i></div><div class="url">verdant.albert14059.workers.dev</div></div></div>`;
    const y0 = fy + 37, x0 = fx + 1;
    html += crop("dash.png", 1440, 0, 0, 1440, topH, s, x0, y0);
    const ly = y0 + (topH + 20) * s;
    html += crop("dash.png", 1440, 843, m.dash.list.y, 533, lh, s, x0 + 843 * s, ly);
    html += crop("dash.png", 1440, 64, m.dash.feed.y, 765, lh, s, x0 + 64 * s, ly, "border-right:1px solid #cfc3a5;border-bottom:1px solid #cfc3a5;");
    const rx = fx + fw + 50, rw = 1800 - rx - 50;
    html += caption("Where to sample first", "Dashboard<br>Lake Mead pilot", rx, 90, rw);
    html += `<div class="note abs" style="left:${rx}px;top:${ly - 60}px;width:${rw}px">The list ranks every site by score. Callville Bay is first, tagged as the site to sample first.</div>`;
    L["01-dashboard"] = page(html);
  }

  // 02 Callville Bay close-up
  {
    const s1 = 1.2, c = m.site.card, top = 60, left = 114;
    let html = crop("site.png", 1440, c.x, c.y, c.w, c.h, s1, left, top, "border:1px solid #cfc3a5;border-radius:3px;box-shadow:0 4px 18px rgb(30 43 34/.10);");
    const ax = left + (m.site.advisory.x - c.x) * s1, ay = top + (m.site.advisory.y - c.y) * s1;
    const aw = m.site.advisory.w * s1, ah = m.site.advisory.h * s1;
    html += `<div class="abs" style="left:${ax - 8}px;top:${ay - 8}px;width:${aw + 16}px;height:${ah + 16}px;border:2.5px solid #b7791f;border-radius:6px"></div>`;
    const cardBottom = top + c.h * s1;
    const noteY = cardBottom + 50;
    html += `<div class="note abs" style="left:1330px;top:${noteY}px;width:360px">Official status sits next to the score.</div>`;
    html += arrowTo(1500, noteY - 8, ax + aw / 2, ay + ah + 14, 0.5);
    const w = m.site.why, s2 = 1.3, by = 560;
    html += crop("site.png", 1440, 54, w.y - 10, 760, 340, s2, left, by);
    html += `<div class="note abs" style="left:1130px;top:${by + 40}px;width:480px">Bars show points: factor score times weight.</div>`;
    html += caption("Why this site scores 79", "Site page<br>Callville Bay", 1130, 960, 560);
    L["02-callville-bay"] = page(html);
  }

  // 03 phones
  {
    const s = 1.0, bz = 14, pw = 390 * s + bz * 2, ph = 844 * s + bz * 2;
    const labels = ["1 Pick the site", "2 Is it a bloom?", "3 Review and send"];
    const gap = (1800 - 3 * pw) / 4;
    let html = "";
    ["phone1", "phone2", "phone3"].forEach((f, i) => {
      const left = gap + i * (pw + gap), top = 170 + (i === 1 ? 40 : 0);
      html += `<div class="abs" style="left:${left}px;top:${top}px;width:${pw}px;height:${ph}px;background:#1e2b22;border-radius:34px;box-shadow:0 6px 22px rgb(30 43 34/.18)"></div>`;
      html += `<div class="crop" style="left:${left + bz}px;top:${top + bz}px;width:${390 * s}px;height:${844 * s}px;border-radius:22px"><img src="${f}.png" style="left:0;top:0;width:${390 * s}px"></div>`;
      html += `<div class="mono abs" style="left:${left}px;top:${top + ph + 22}px;width:${pw}px;text-align:center;color:#1e2b22">${labels[i]}</div>`;
    });
    html += caption("Report in three steps", "Phone width, 390 px", gap, 40, 700);
    L["03-report-on-phones"] = page(html);
  }

  // 04 ranger queue + payoff
  {
    const r = m.ranger, s = 1.2, cx = 64, cw = 1312, top = 70, left = 60;
    const ry = r.h1.y - 10, rh = r.art.y + r.art.h - ry + 30;
    let html = `<div class="frame" style="left:${left}px;top:${top}px;width:${cw * s + 2}px;height:${rh * s + 38}px"><div class="chrome"><div class="dots"><i></i><i></i><i></i></div><div class="url">verdant.albert14059.workers.dev/rangers</div></div></div>`;
    html += crop("rangers-a.png", 1440, cx, ry, cw, rh, s, left + 1, top + 37);
    const c0 = m.mine.card, c = { ...c0, y: c0.y + 36, h: c0.h - 36 }, ps = 1.05, pad = 24;
    const pw = (c.w + pad * 2) * ps, ph = (c.h + pad) * ps;
    const px = 1800 - 50 - pw, py = top + 37 + rh * s - 70;
    html += `<div class="frame" style="left:${px}px;top:${py}px;width:${pw}px;height:${ph}px;background:#eee8d8;box-shadow:0 10px 30px rgb(30 43 34/.18),0 1px 2px rgb(30 43 34/.1)"></div>`;
    html += crop("myreports.png", 1440, c.x - pad, c.y, c.w + pad * 2, c.h + pad, ps, px + 1, py + 1);
    html += caption("Triage, then the outcome", "Ranger queue, then My reports", left, 1000, 800);
    L["04-ranger-and-payoff"] = page(html);
  }

  // 05 three languages
  {
    const s = 0.8, cw = 640, ch = 834, colW = cw * s, gap = (1800 - 3 * colW) / 4;
    const names = ["English", "Português", "Norsk"];
    const keys = ["en", "pt", "nb"];
    let html = "";
    keys.forEach((k, i) => {
      const left = gap + i * (colW + gap), top = 230;
      html += `<div class="frame" style="left:${left}px;top:${top}px;width:${colW + 2}px;height:${ch * s + 2}px"></div>`;
      html += crop(`lang-${k}.png`, cw, 0, 0, cw, ch, s, left + 1, top + 1);
      html += `<div class="title abs" style="left:${left}px;top:${top + ch * s + 36}px;font-size:40px">${names[i]}</div>`;
    });
    html += `<div class="title abs" style="left:${gap}px;top:60px;font-size:44px">Seven languages</div><div class="mono abs" style="left:${gap}px;top:116px">Switch in the header: EN, PT, ES, FR, IT, NL, NO</div>`;
    L["05-three-languages"] = page(html);
  }

  // 06 slide
  {
    const w = 1500, h = Math.round(w * 1238 / 2200);
    let html = `<div class="frame" style="left:150px;top:100px;width:${w + 2}px;height:${h + 2}px"></div>`;
    html += `<img class="abs" src="slide.png" style="left:151px;top:101px;width:${w}px;height:${h}px">`;
    html += caption("From observation to follow-up", "Pitch deck, slide 2", 150, 100 + h + 60, 1200);
    L["06-slide"] = page(html);
  }
  return L;
}

// ------------------------------------------------------------------ main
await startApp({ build: process.argv.includes("--build") });
const browser = await launch();
try {
  const meta = await captureAll(browser);
  copyFileSync(slidePng(), join(CAP, "slide.png"));
  const layoutHtml = layouts(meta);
  const ctx = await browser.newContext({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 1 });
  await serveFonts(ctx);
  const p = await ctx.newPage();
  for (const [name, html] of Object.entries(layoutHtml)) {
    const f = join(CAP, name + ".html");
    writeFileSync(f, html);
    await p.goto("file://" + f);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(400);
    const out = join(OUT, name + ".png").replace("06-slide", "06-slide");
    await p.screenshot({ path: out });
    optimizePng(out, 1400);
    console.log("wrote", out);
  }
  await ctx.close();
} finally {
  await browser.close();
  stopApp();
}

// carousel.gif: 6 frames, 900x600, 3 s each, loops forever.
execFileSync("python3", ["-c", `
import glob, os, sys
from PIL import Image
out = sys.argv[1]
files = sorted(glob.glob(os.path.join(out, "0?-*.png")))
frames = [Image.open(f).convert("RGB").resize((900, 600), Image.LANCZOS).quantize(colors=128, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE) for f in files]
frames[0].save(os.path.join(out, "carousel.gif"), save_all=True, append_images=frames[1:], duration=3000, loop=0, optimize=True)
print(len(frames), "frames", os.path.getsize(os.path.join(out, "carousel.gif")) // 1024, "KB")
`, OUT], { stdio: "inherit" });
