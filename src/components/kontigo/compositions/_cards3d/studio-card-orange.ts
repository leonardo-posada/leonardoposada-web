/** Procedural orange pigment and spot-UV K. No baked card background.
 * The K changes roughness and micro-height, so its sheen follows the lights. */
export function createOrangeFinish(width: number, height: number, mark: HTMLImageElement) {
  const make = () => { const c = document.createElement("canvas"); c.width = width; c.height = height; return c; };
  const color = make(), bump = make(), roughness = make(), varnish = make(), coverage = make(), mask = make();
  const maskContext = mask.getContext("2d")!;
  // Oversized mark, intentionally cropped by the top and right edges like V8.
  maskContext.drawImage(mark, width * .695, -height * .09, width * .37, height * .70);
  const alpha = maskContext.getImageData(0, 0, width, height).data;
  const cc = color.getContext("2d")!, bc = bump.getContext("2d")!, rc = roughness.getContext("2d")!, vc = varnish.getContext("2d")!, ac = coverage.getContext("2d")!;
  const pigment = cc.createImageData(width, height), relief = bc.createImageData(width, height), finish = rc.createImageData(width, height), coat = vc.createImageData(width, height), uv = ac.createImageData(width, height);
  let seed = 140381;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4, u = x / width, v = y / height;
    const k = alpha[i + 3] / 255;
    // Warm, feathered light pools echo V8 without whitening the orange base.
    const upper = Math.exp(-(((u - .08) / .36) ** 2 + ((v + .01) / .38) ** 2));
    const lower = Math.exp(-(((u - .52) / .34) ** 2 + ((v - 1.02) / .34) ** 2));
    const n = random() - .5;
    pigment.data[i] = 255 + n * 2;
    pigment.data[i + 1] = 86 + upper * 44 + lower * 42 + k * 8 + n * 4;
    pigment.data[i + 2] = 2 + upper * 12 + lower * 9 + k * 2;
    for (let c = 0; c < 3; c++) {
      relief.data[i + c] = 150 - k * 30 + n * (k ? 3 : 9);
      finish.data[i + c] = 224 - k * 132 + n * 8;
      coat.data[i + c] = 185 - k * 148;
      uv.data[i + c] = 28 + k * 227;
    }
    pigment.data[i + 3] = relief.data[i + 3] = finish.data[i + 3] = coat.data[i + 3] = uv.data[i + 3] = 255;
  }
  cc.putImageData(pigment, 0, 0); bc.putImageData(relief, 0, 0); rc.putImageData(finish, 0, 0); vc.putImageData(coat, 0, 0); ac.putImageData(uv, 0, 0);
  return { color, bump, roughness, varnish, coverage };
}
