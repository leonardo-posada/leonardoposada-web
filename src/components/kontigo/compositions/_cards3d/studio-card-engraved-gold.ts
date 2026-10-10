/** Champagne gold with horizontal machining and a recessed brand mark.
 * Pigment contains no baked lighting: the shared studio supplies reflections. */
export function createEngravedGoldFinish(width: number, height: number, mark: HTMLImageElement) {
  const make = () => { const c = document.createElement("canvas"); c.width = width; c.height = height; return c; };
  const color = make(), bump = make(), roughness = make(), mask = make();
  const mc = mask.getContext("2d")!;
  const mw = width * .095, mh = mw * 162 / 148;
  mc.filter = "blur(2px)";
  mc.drawImage(mark, width * .805, height * .105, mw, mh);
  const coverage = mc.getImageData(0, 0, width, height).data;
  const cc = color.getContext("2d")!, bc = bump.getContext("2d")!, rc = roughness.getContext("2d")!;
  const pigment = cc.createImageData(width, height), depth = bc.createImageData(width, height), rough = rc.createImageData(width, height);
  let seed = 49271;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  // Measured 9×3 palette from the archived gold-texture-4, reproduced as
  // interpolated pigment rather than loading a photographic card background.
  const palette = [
    [[143,115,78],[213,188,145],[212,187,144],[219,195,152],[241,219,176],[218,194,151],[221,197,154],[225,201,158],[174,146,106]],
    [[127,99,64],[195,168,126],[197,171,129],[202,177,134],[227,203,160],[203,178,135],[205,180,137],[208,183,140],[158,130,91]],
    [[114,86,53],[177,150,109],[181,154,112],[184,158,116],[211,186,143],[187,161,119],[188,162,120],[190,164,122],[143,115,78]],
  ];
  for (let y = 0; y < height; y++) {
    const brushed = (random() - .5) * 4;
    const py = Math.min(1.999, y / height * 2), iy = Math.floor(py), fy = py - iy;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4, k = coverage[i + 3] / 255;
      const grain = (random() - .5) * 2 + brushed;
      const px = Math.min(7.999, x / width * 8), ix = Math.floor(px), fx = px - ix;
      for (let c = 0; c < 3; c++) {
        const top = palette[iy][ix][c] * (1 - fx) + palette[iy][ix + 1][c] * fx;
        const bottom = palette[iy + 1][ix][c] * (1 - fx) + palette[iy + 1][ix + 1][c] * fx;
        pigment.data[i + c] = (top * (1 - fy) + bottom * fy) * [ .86, .80, .70 ][c] + grain - k * 33;
      }
      pigment.data[i + 3] = 255;
      const d = 150 + grain * 2;
      depth.data.set([d, d, d, 255], i);
      const r = 195 + grain * 2 - k * 2;
      rough.data.set([r, r, r, 255], i);
    }
  }
  cc.putImageData(pigment, 0, 0); bc.putImageData(depth, 0, 0); rc.putImageData(rough, 0, 0);
  // Individual machining strokes break up the uniform row grain.
  for (let i = 0; i < 22000; i++) {
    const x = random() * width, y = random() * height;
    const length = 15 + random() * 260;
    const light = random() > .5;
    for (const ctx of [cc, bc, rc]) {
      ctx.strokeStyle = light ? "rgba(255,250,238,.03)" : "rgba(40,27,15,.035)";
      ctx.lineWidth = .5 + random() * .7;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + length, y); ctx.stroke();
    }
  }
  // Shallow engraving stays above the metal body beneath the face.
  // A restrained tonal recess keeps the K readable alongside its bevel highlights.
  const recessAt = (u: number, v: number) => {
    const x = Math.max(0, Math.min(width - 2, u * (width - 1)));
    const y = Math.max(0, Math.min(height - 2, (1 - v) * (height - 1)));
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const a = (dx: number, dy: number) => {
      const index = ((iy + dy) * width + ix + dx) * 4 + 3;
      return coverage[index] / 255;
    };
    return ((a(0, 0) * (1 - fx) + a(1, 0) * fx) * (1 - fy) + (a(0, 1) * (1 - fx) + a(1, 1) * fx) * fy) * .0014;
  };
  return { color, bump, roughness, recessAt };
}
