/** Procedural gold: broad curved tonal bands and fine flowing machining marks.
 * No photographic card background. Roughness and microrelief let the studio
 * reflections respond independently when the card tilts. */
export function createGoldFinish(width: number, height: number) {
  const make = () => { const c = document.createElement("canvas"); c.width = width; c.height = height; return c; };
  const color = make(), bump = make(), roughness = make();
  const cc = color.getContext("2d")!, bc = bump.getContext("2d")!, rc = roughness.getContext("2d")!;
  const pixels = cc.createImageData(width, height), depths = bc.createImageData(width, height), rough = rc.createImageData(width, height);
  let seed = 73129;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const bell = (v: number, center: number, spread: number) => Math.exp(-(((v - center) / spread) ** 2));
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const u = x / width, v = y / height;
    const left = bell(u, .16 + .035 * Math.sin(v * 4), .13) * (1 - .28 * v);
    const middle = bell(u, .44 + .22 * (1 - v), .12) * .62;
    const right = bell(u, .9 + .025 * Math.sin(v * 5), .075) * (.65 + .22 * v);
    const top = bell(v, -.06, .43) * bell(u, .19, .35);
    const shadow = bell(u, .70 - .06 * v, .13) * (.28 + .72 * v);
    const bottom = v * v * .26;
    const value = Math.max(0, Math.min(1, .39 + .38 * left + .30 * middle + .42 * right + .22 * top - .27 * shadow - bottom));
    const n = (random() - .5) * 2;
    const offset = (y * width + x) * 4;
    pixels.data.set([69 + value * 177 + n * 1.3, 34 + value * 158 + n, 9 + value * 89 + n * .7, 255], offset);
    const level = 128 + n * 6;
    depths.data.set([level, level, level, 255], offset);
    const grainRoughness = 195 + 22 * shadow - 18 * left + n * 4;
    rough.data.set([grainRoughness, grainRoughness, grainRoughness, 255], offset);
  }
  cc.putImageData(pixels, 0, 0); bc.putImageData(depths, 0, 0); rc.putImageData(rough, 0, 0);
  // Curved hairlines follow the rolling finish rather than straight stripes.
  for (let i = 0; i < 18000; i++) {
    const x = random() * width, y = random() * height, length = 12 + random() * 145;
    const bend = Math.sin(x / width * 5 - y / height * 1.3) * length * .22;
    const light = random() > .5;
    for (const ctx of [cc, bc]) {
      ctx.strokeStyle = ctx === cc ? (light ? "rgba(255,227,162,.045)" : "rgba(49,23,4,.06)") : (light ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.10)");
      ctx.lineWidth = .35 + random() * .35;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + length * .5, y + bend * .35, x + length, y + bend); ctx.stroke();
    }
  }
  return { color, bump, roughness };
}
