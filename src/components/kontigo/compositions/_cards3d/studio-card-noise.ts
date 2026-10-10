/** V1's fine, directionless grain and curved orange/black pigment gradient.
 * Color, micro-height and roughness are generated separately so the lights
 * still respond to the 3D surface rather than becoming a baked card photo. */
export function createNoiseFinish(width: number, height: number) {
  const makeCanvas = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = height;
    return canvas;
  };
  const color = makeCanvas(), bump = makeCanvas(), roughness = makeCanvas();
  const colorContext = color.getContext("2d")!;
  const bumpContext = bump.getContext("2d")!;
  const roughnessContext = roughness.getContext("2d")!;
  const pixels = colorContext.createImageData(width, height);
  const relief = bumpContext.createImageData(width, height);
  const finish = roughnessContext.createImageData(width, height);
  let seed = 12038113;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  // Half the previous grain diameter: four times as many grains per area,
  // at the same texture resolution and with no extra runtime animation.
  const grainSize = 1.5;
  const gridWidth = Math.ceil(width / grainSize) + 1, gridHeight = Math.ceil(height / grainSize) + 1;
  const grain = Float32Array.from({ length: gridWidth * gridHeight }, () => random() - .5);
  const stops = [
    [-1, 20, 11, 3], [-.45, 29, 14, 2], [-.18, 106, 40, 0],
    [-.06, 236, 85, 0], [.03, 255, 119, 7], [.19, 241, 94, 1], [.55, 212, 73, 0],
  ];
  const bandTint = [0, 26, 24];
  for (let y = 0; y < height; y++) {
    const v = y / (height - 1);
    const center = 1.01 - .9 * v + .075 * Math.sin(v * Math.PI);
    const gy = Math.floor(y / grainSize), fy = y / grainSize - gy;
    for (let x = 0; x < width; x++) {
      const d = x / (width - 1) - center;
      let stop = 0;
      while (stop < stops.length - 2 && d > stops[stop + 1][0]) stop++;
      const a = stops[stop], b = stops[stop + 1];
      const t = Math.max(0, Math.min(1, (d - a[0]) / (b[0] - a[0])));
      const smooth = t * t * (3 - 2 * t);
      const gx = Math.floor(x / grainSize), fx = x / grainSize - gx;
      const top = grain[gy * gridWidth + gx] * (1 - fx) + grain[gy * gridWidth + gx + 1] * fx;
      const bottom = grain[(gy + 1) * gridWidth + gx] * (1 - fx) + grain[(gy + 1) * gridWidth + gx + 1] * fx;
      const n = top * (1 - fy) + bottom * fy;
      const fine = random() - .5;
      const brightness = 1 + n * .24 + fine * .08;
      const warmBand = Math.exp(-((d / .12) ** 2)) * v ** 1.7;
      const i = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) {
        pixels.data[i + c] = (a[c + 1] + (b[c + 1] - a[c + 1]) * smooth + warmBand * bandTint[c]) * brightness;
        // Scale the micro-height with the diameter to preserve the finish's
        // reflection softness instead of turning smaller grains into spikes.
        relief.data[i + c] = 128 + n * 29 + fine * 9;
        finish.data[i + c] = 226 + n * 25 - warmBand * 18;
      }
      pixels.data[i + 3] = relief.data[i + 3] = finish.data[i + 3] = 255;
    }
  }
  colorContext.putImageData(pixels, 0, 0);
  bumpContext.putImageData(relief, 0, 0);
  roughnessContext.putImageData(finish, 0, 0);
  return { color, bump, roughness };
}
