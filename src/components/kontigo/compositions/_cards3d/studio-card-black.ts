/** Machined graphite finish generated at runtime, with a diagonal brushed grain.
 * Pigment stays dark; the independent roughness/bump maps catch moving lights. */
export function createBlackFinish(width: number, height: number) {
  const make = () => { const c = document.createElement("canvas"); c.width = width; c.height = height; return c; };
  const color = make(), bump = make(), roughness = make();
  const cc = color.getContext("2d")!, bc = bump.getContext("2d")!, rc = roughness.getContext("2d")!;
  const pixels = cc.createImageData(width, height), depths = bc.createImageData(width, height), rough = rc.createImageData(width, height);
  let seed = 160731;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const u = x / width, v = y / height;
    // V10's silver sweep bends from the upper-left toward the center;
    // the lower-right stays near black instead of becoming flat gray.
    const axis = .27 + .72 * v - .22 * v * v;
    const shoulder = Math.exp(-(((u - axis) / .10) ** 2 + ((v - .05) / .39) ** 2));
    const halo = Math.exp(-(((u - axis) / .26) ** 2 + ((v - .08) / .55) ** 2));
    const secondary = Math.exp(-(((u - .77) / .14) ** 2 + ((v - .10) / .25) ** 2));
    const topFill = Math.exp(-(((u - .16) / .24) ** 2 + ((v + .04) / .25) ** 2));
    const returnLight = Math.exp(-(((u - (.58 - .23 * v)) / .09) ** 2 + ((v - .72) / .5) ** 2));
    const n = random() - .5, index = (y * width + x) * 4;
    const value = 7 + 125 * shoulder + 32 * halo + 112 * secondary + 25 * topFill + 20 * returnLight + n * 2;
    pixels.data.set([value * .98, value, value * 1.025, 255], index);
    const depth = 128 + n * 12, satin = 214 - 54 * shoulder - 25 * secondary + n * 8;
    depths.data.set([depth, depth, depth, 255], index);
    rough.data.set([satin, satin, satin, 255], index);
  }
  cc.putImageData(pixels, 0, 0); bc.putImageData(depths, 0, 0); rc.putImageData(rough, 0, 0);
  for (let i = 0; i < 30000; i++) {
    const x = random() * width, y = random() * height, length = 18 + random() * 190;
    const light = random() > .5;
    for (const ctx of [cc, bc]) {
      ctx.strokeStyle = ctx === cc ? (light ? "rgba(202,213,224,.095)" : "rgba(0,0,0,.16)") : (light ? "rgba(255,255,255,.11)" : "rgba(0,0,0,.11)");
      ctx.lineWidth = .4;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + length * .65, y - length); ctx.stroke();
    }
  }
  return { color, bump, roughness };
}
