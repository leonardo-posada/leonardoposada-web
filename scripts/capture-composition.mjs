#!/usr/bin/env node
/**
 * Capture a Kontigo composition preview page to a WebP file.
 *
 * Usage:
 *   node scripts/capture-composition.mjs \
 *     --name card-system \
 *     --out public/work/kontigo/card-system.webp
 *
 * Options:
 *   --name <slug>         Composition slug registered in the preview route.
 *   --out <path>          Target WebP path (relative to repo root).
 *   --url <base>          Dev server base URL (default http://localhost:3001).
 *   --viewport <WxH>      Browser viewport (default 1800x1600).
 *   --dpr <n>             Device scale factor (default 2 for retina output).
 *   --quality <0-100>     WebP quality (default 95; use 100 for lossless).
 *   --lossless            Shortcut for lossless WebP output.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { parseArgs } from "node:util";
import { resolve, dirname } from "node:path";
import { mkdir } from "node:fs/promises";

const { values } = parseArgs({
  options: {
    name: { type: "string", short: "n" },
    out: { type: "string", short: "o" },
    url: { type: "string", default: "http://localhost:3001" },
    viewport: { type: "string", default: "1800x1600" },
    dpr: { type: "string", default: "2" },
    quality: { type: "string", default: "95" },
    lossless: { type: "boolean", default: false },
  },
});

if (!values.name || !values.out) {
  console.error(
    "Missing required flags. Example:\n  node scripts/capture-composition.mjs --name card-system --out public/work/kontigo/card-system.webp",
  );
  process.exit(1);
}

const [vw, vh] = values.viewport.split("x").map(Number);
const dpr = Number(values.dpr);
const quality = Number(values.quality);
const target = `${values.url}/work/kontigo/compositions/${values.name}`;
const outPath = resolve(values.out);

console.log(`→ ${target}`);
console.log(`  viewport ${vw}x${vh} · dpr ${dpr} · quality ${values.lossless ? "lossless" : quality}`);

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({
  viewport: { width: vw, height: vh },
  deviceScaleFactor: dpr,
});
const page = await context.newPage();
page.on("pageerror", (e) => console.error("PAGEERROR", e.message));

await page.goto(target, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const box = await page.evaluate(() => {
  const el = document.querySelector("main > div > div");
  if (!el) return null;
  el.scrollIntoView({ block: "center", behavior: "instant" });
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
});
if (!box) {
  console.error("Composition element not found on page");
  await browser.close();
  process.exit(1);
}

const tmpPng = `/tmp/${values.name}-capture-${Date.now()}.png`;
await page.screenshot({
  path: tmpPng,
  type: "png",
  clip: box,
  animations: "disabled",
  timeout: 20000,
});
await browser.close();

await mkdir(dirname(outPath), { recursive: true });
const info = await sharp(tmpPng)
  .webp(values.lossless ? { lossless: true, effort: 6 } : { quality, effort: 6 })
  .toFile(outPath);

console.log(`✓ ${outPath}`);
console.log(`  ${info.width}x${info.height} · ${Math.round(info.size / 1024)} KB`);
