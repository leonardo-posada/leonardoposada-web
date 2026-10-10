/** Pearlescent silver pigment with restrained brand-tinted edge blooms.
 * Fine grain controls real surface reflections independently of the color. */
export function createWhiteSilverFinish(width: number, height: number) {
  const make = () => { const c = document.createElement("canvas"); c.width = width; c.height = height; return c; };
  const color = make(), bump = make(), roughness = make();
  const cc = color.getContext("2d")!, bc = bump.getContext("2d")!, rc = roughness.getContext("2d")!;
  const pixels = cc.createImageData(width, height), depths = bc.createImageData(width, height), satin = rc.createImageData(width, height);
  let seed = 170041;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const u = x / width, v = y / height;
    const silk = Math.exp(-(((u - .66 * v - .14) / .28) ** 2));
    const shadow = Math.exp(-(((u - .68 * v - .46) / .24) ** 2));
    // Broad, off-edge blooms avoid visible circles or rainbow stripes.
    const orange = .64 * Math.exp(-(((u - .10) / .48) ** 2 + ((v - 1.03) / .61) ** 2));
    const fuchsia = .36 * Math.exp(-(((u - .96) / .48) ** 2 + ((v - .12) / .66) ** 2));
    const n = random() - .5, i = (y * width + x) * 4;
    const base = 221 + silk * 20 - shadow * 17 + n * 3;
    const mix = (channel: number, warm: number, pink: number) => channel * (1 - orange - fuchsia) + warm * orange + pink * fuchsia;
    pixels.data.set([mix(base, 255, 224), mix(base + 2, 92, 65), mix(base + 5, 0, 166), 255], i);
    const depth = 128 + n * 16, rough = 205 + n * 8 - silk * 14;
    depths.data.set([depth, depth, depth, 255], i);
    satin.data.set([rough, rough, rough, 255], i);
  }
  cc.putImageData(pixels, 0, 0); bc.putImageData(depths, 0, 0); rc.putImageData(satin, 0, 0);
  return { color, bump, roughness };
}
