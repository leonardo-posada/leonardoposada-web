import { getChipDesign, type ChipVariant } from "./chip-designs";

/** Independent contacts, recessed channels and machining maps, derived from
 * the shared vectors. Lighting is left to the renderer, not painted here. */
export function createSilverChipSurface(variant: ChipVariant) {
  const width = 768, height = 552;
  const canvas = () => {
    const c = document.createElement("canvas"); c.width = width; c.height = height; return c;
  };
  const mask = canvas(), maskCtx = mask.getContext("2d")!;
  maskCtx.fillStyle = "white"; maskCtx.fillRect(0, 0, width, height);
  maskCtx.save(); maskCtx.scale(width / 100, height / 72);
  maskCtx.strokeStyle = "black"; maskCtx.lineJoin = "round"; maskCtx.lineWidth = 1.1;
  maskCtx.stroke(new Path2D(getChipDesign(variant).grooves)); maskCtx.restore();
  const hard = maskCtx.getImageData(0, 0, width, height).data;
  const softened = canvas(), softCtx = softened.getContext("2d")!;
  softCtx.filter = "blur(1.5px)"; softCtx.drawImage(mask, 0, 0);
  const depth = softCtx.getImageData(0, 0, width, height).data;

  // Connected contacts get subtly different finishes, as separate metal pads
  // do. Flood fill only runs on selection; it never runs in the animation loop.
  const labels = new Uint16Array(width * height), queue = new Int32Array(width * height);
  let label = 0;
  for (let start = 0; start < labels.length; start++) {
    if (labels[start] || hard[start * 4] < 128) continue;
    label++; let read = 0, end = 1; queue[0] = start; labels[start] = label;
    while (read < end) {
      const at = queue[read++], x = at % width;
      const visit = (next: number) => {
        if (next < 0 || next >= labels.length || labels[next] || hard[next * 4] < 128) return;
        labels[next] = label; queue[end++] = next;
      };
      if (x > 0) visit(at - 1); if (x < width - 1) visit(at + 1);
      visit(at - width); visit(at + width);
    }
  }
  const color = canvas(), bump = canvas(), roughness = canvas(), direction = canvas();
  const colorCtx = color.getContext("2d")!, bumpCtx = bump.getContext("2d")!, roughCtx = roughness.getContext("2d")!;
  const rgb = colorCtx.createImageData(width, height), micro = bumpCtx.createImageData(width, height), rough = roughCtx.createImageData(width, height);
  const directionCtx = direction.getContext("2d")!, brushing = directionCtx.createImageData(width, height);
  const silver = [165, 174, 186], channel = [30, 36, 44];
  let seed = 18317;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let y = 0; y < height; y++) {
    const grainLine = random() - .5;
    for (let x = 0; x < width; x++) {
      const p = y * width + x, i = p * 4, h = depth[i] / 255;
      const grain = (random() - .5) * 2.5 + grainLine * 2;
      const contact = labels[p] || 1;
      const tone = 1 - (contact % 4) * .025;
      const face = Math.min(1, Math.max(0, (h - .08) / .73));
      for (let c = 0; c < 3; c++) {
        rgb.data[i + c] = channel[c] * (1 - face) + (silver[c] * tone + grain) * face;
        micro.data[i + c] = 128 + grain * 2;
        rough.data[i + c] = 174 + (contact % 4) * 19 + grain * 2 + (1 - h) * 22;
      }
      const angle = contact % 3 === 0 ? Math.PI / 2 : contact % 3 === 1 ? .16 : -.22;
      brushing.data[i] = (Math.cos(angle) * .5 + .5) * 255;
      brushing.data[i + 1] = (Math.sin(angle) * .5 + .5) * 255;
      brushing.data[i + 2] = 235 * h; brushing.data[i + 3] = 255;
      rgb.data[i + 3] = micro.data[i + 3] = rough.data[i + 3] = 255;
    }
  }
  colorCtx.putImageData(rgb, 0, 0); bumpCtx.putImageData(micro, 0, 0); roughCtx.putImageData(rough, 0, 0);
  directionCtx.putImageData(brushing, 0, 0);
  const heightAt = (u: number, v: number) => {
    const px = Math.max(0, Math.min(width - 1.001, u * (width - 1)));
    const py = Math.max(0, Math.min(height - 1.001, v * (height - 1)));
    const x = Math.floor(px), y = Math.floor(py), dx = px - x, dy = py - y;
    const a = depth[(y * width + x) * 4], b = depth[(y * width + x + 1) * 4];
    const c = depth[((y + 1) * width + x) * 4], d = depth[((y + 1) * width + x + 1) * 4];
    return ((a * (1 - dx) + b * dx) * (1 - dy) + (c * (1 - dx) + d * dx) * dy) / 255;
  };
  return { color, bump, roughness, direction, heightAt };
}
