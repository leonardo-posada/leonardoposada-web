/** V6: original vector artwork printed under a satin laminate.
 * All coordinates are authored at 686 × 396; no photographic background.
 */
export function drawIllustratedArt(ctx: CanvasRenderingContext2D, width: number, height: number, mask = false) {
  ctx.save();
  ctx.scale(width / 686, height / 396);
  const gradient = (x: number, y: number, ex: number, ey: number, colors: string[]) => {
    const g = ctx.createLinearGradient(x, y, ex, ey);
    colors.forEach((color, i) => g.addColorStop(i / (colors.length - 1), color));
    return g;
  };
  const shape = (path: string, fill: string | CanvasGradient, varnish = "#b8b8b8") => {
    ctx.fillStyle = mask ? varnish : fill; ctx.fill(new Path2D(path));
  };
  ctx.fillStyle = mask ? "#454545" : gradient(0, 0, 480, 390, ["#ec5408", "#ff790b", "#ff972f"]);
  ctx.fillRect(0, 0, 686, 396);

  // Sky peeking between the oversized petals. The art intentionally bleeds off the card.
  shape("M343 0H686V151C632 147 624 100 573 79C507 50 443 95 390 65C365 51 352 27 343 0Z", gradient(405, 0, 686, 155, ["#b9eff0", "#81cce8"]), "#747474");
  shape("M466 -52C552 -61 602 -11 580 54C563 108 511 135 465 168C506 124 488 61 444 43C391 22 393 -42 466 -52Z", gradient(429, -5, 554, 107, ["#17604d", "#075140", "#358975"]));

  // One sculptural four-petal bloom: orange ink melts into warm pink, with a
  // narrow central crease rather than outlines or artificial drop shadows.
  shape("M468 176C409 147 324 165 310 104C295 35 365 -10 426 20C463 39 473 80 468 176Z", gradient(332, 39, 470, 179, ["#ffafbc", "#f487a6", "#f16b70", "#ec5c21"]), "#ededed");
  shape("M468 176C465 105 494 34 563 27C640 18 674 81 636 132C608 171 551 180 468 176Z", gradient(604, 34, 476, 191, ["#ffc1cf", "#f6a3bf", "#ee728b", "#e85f27"]), "#ededed");
  shape("M468 176C557 145 633 161 645 221C657 279 592 323 535 289C494 265 476 224 468 176Z", gradient(478, 167, 612, 278, ["#d64913", "#f46c28", "#ff9976", "#ffb9bb"]), "#ededed");
  shape("M468 176C473 262 446 311 385 311C321 311 282 254 314 211C343 173 405 171 468 176Z", gradient(455, 174, 335, 302, ["#e8540c", "#ff833f", "#ffa388", "#f9b4c5"]), "#ededed");

  // A forest-green ribbon folds around the bloom, with a blue reverse face.
  shape("M284 421C315 344 370 348 443 347C544 345 583 328 592 278C602 224 644 198 710 205L709 417Z", gradient(419, 422, 657, 245, ["#083d33", "#12614c", "#2d826a"]), "#a0a0a0");
  shape("M552 408C596 350 635 381 677 332C702 303 704 274 700 251C750 319 726 376 684 412Z", gradient(601, 375, 698, 299, ["#b4e8ed", "#81c6e5", "#459cbe"]));
  shape("M598 395C639 351 645 306 613 276C648 280 673 310 658 342C646 369 623 383 598 395Z", gradient(620, 288, 648, 371, ["#55a7c8", "#a8e4ed"]));

  // Hairline stems add a drawn, human detail without competing with the chip.
  ctx.strokeStyle = mask ? "#cccccc" : "#ffc2c5";
  ctx.lineWidth = 1.5; ctx.lineCap = "round";
  ctx.stroke(new Path2D("M248 396C219 317 251 270 283 222C318 168 302 126 282 96"));
  ctx.strokeStyle = mask ? "#cccccc" : "#ffa66a";
  ctx.stroke(new Path2D("M449 398C477 371 541 369 570 344C599 319 593 288 612 260"));

  const flower = (x: number, y: number, r: number, fill: string) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-.22);
    ctx.fillStyle = mask ? "#efefef" : fill;
    ctx.beginPath();
    for (const [cx, cy] of [[-r * .5, -r * .5], [r * .5, -r * .5], [r * .5, r * .5], [-r * .5, r * .5]]) {
      ctx.moveTo(cx + r * .7, cy); ctx.arc(cx, cy, r * .7, 0, Math.PI * 2);
    }
    ctx.fill(); ctx.restore();
  };
  flower(280, 94, 17, "#c1eff0");
  flower(610, 255, 12, "#ffb3c7");
  // A tiny paired leaf on the stem: a quiet signature for this print.
  shape("M259 275C235 279 225 266 230 251C247 250 258 261 259 275ZM259 275C267 253 282 247 295 255C291 272 278 280 259 275Z", "#195e49");
  ctx.restore();
}

export function createIllustratedFinish(width: number, height: number) {
  const canvas = () => { const c = document.createElement("canvas"); c.width = width; c.height = height; return c; };
  const color = canvas(), bump = canvas(), roughness = canvas(), coverage = canvas();
  const context = color.getContext("2d")!;
  drawIllustratedArt(context, width, height);
  drawIllustratedArt(coverage.getContext("2d")!, width, height, true);
  const pixels = context.getImageData(0, 0, width, height);
  const bctx = bump.getContext("2d")!, rctx = roughness.getContext("2d")!;
  const bp = bctx.createImageData(width, height), rp = rctx.createImageData(width, height);
  let seed = 16163;
  for (let i = 0; i < pixels.data.length; i += 4) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const n = seed / 4294967296 - .5;
    // Subpixel print grain, not a gritty metallic surface.
    for (let j = 0; j < 3; j++) pixels.data[i + j] += n * 3.4;
    bp.data.set([128 + n * 18, 128 + n * 18, 128 + n * 18, 255], i);
    rp.data.set([198 + n * 8, 198 + n * 8, 198 + n * 8, 255], i);
  }
  context.putImageData(pixels, 0, 0); bctx.putImageData(bp, 0, 0); rctx.putImageData(rp, 0, 0);
  return { color, bump, roughness, coverage };
}
