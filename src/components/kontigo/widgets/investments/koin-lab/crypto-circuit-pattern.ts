/** A connected, engraved PCB layout rather than independent rectangular tiles. */
export function createCryptoCircuitPattern() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#9e9e9e";
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  type Point = [number, number];

  const path = (points: Point[]) => {
    ctx.beginPath();
    points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  };
  const trace = (points: Point[], width = 4.2) => {
    path(points); ctx.strokeStyle = "#272727"; ctx.lineWidth = width + 5; ctx.stroke();
    path(points); ctx.strokeStyle = "#c7c7c7"; ctx.lineWidth = width; ctx.stroke();
    ctx.save(); ctx.translate(-0.8, -0.8);
    path(points); ctx.strokeStyle = "#ededed"; ctx.lineWidth = 0.9; ctx.stroke();
    ctx.restore();
  };
  const pad = (x: number, y: number, r = 10) => {
    ctx.beginPath(); ctx.arc(x, y, r + 3, 0, Math.PI * 2); ctx.fillStyle = "#303030"; ctx.fill();
    ctx.beginPath(); ctx.arc(x - 0.8, y - 0.8, r, 0, Math.PI * 2); ctx.fillStyle = "#d9d9d9"; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, r - 4, 0, Math.PI * 2); ctx.fillStyle = "#555"; ctx.fill();
    ctx.beginPath(); ctx.arc(x - 0.8, y - 0.8, r - 6, 0, Math.PI * 2); ctx.fillStyle = "#969696"; ctx.fill();
  };
  const roundRect = (x: number, y: number, w: number, h: number, radius: number) => {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, radius);
  };
  const plate = (x: number, y: number, w: number, h: number, radius = 8) => {
    roundRect(x - 5, y - 5, w + 10, h + 10, radius + 4); ctx.fillStyle = "#303030"; ctx.fill();
    roundRect(x - 2, y - 2, w + 4, h + 4, radius + 2); ctx.fillStyle = "#e0e0e0"; ctx.fill();
    roundRect(x + 2, y + 2, w - 4, h - 4, radius); ctx.fillStyle = "#555"; ctx.fill();
    roundRect(x + 6, y + 6, w - 12, h - 12, Math.max(1, radius - 2)); ctx.fillStyle = "#b5b5b5"; ctx.fill();
  };
  const pins = (x: number, y: number, count: number, direction: "horizontal" | "vertical", step = 12) => {
    for (let i = 0; i < count; i++) {
      const px = x + (direction === "horizontal" ? i * step : 0);
      const py = y + (direction === "vertical" ? i * step : 0);
      const w = direction === "horizontal" ? 6 : 15, h = direction === "horizontal" ? 15 : 6;
      ctx.fillStyle = "#292929"; ctx.fillRect(px - 2, py - 2, w + 4, h + 4);
      ctx.fillStyle = "#dedede"; ctx.fillRect(px, py, w, h);
    }
  };

  // The reference has a large processor to the left, two long modules, and
  // small ICs linked by parallel 45-degree tracks with round terminals.
  // Route whole bundles first, then seat the components over their endpoints.
  for (let i = 0; i < 12; i++) {
    // Left-side processor pins fan out to the circumference.
    const y = 274 + i * 20;
    trace([[177, y], [128 - (i % 3) * 10, y], [92 - (i % 3) * 10, y + 36], [-20, y + 36]]);
  }
  for (let i = 0; i < 13; i++) {
    // Upper bank wraps around the processor into a broad top bus.
    const x = 184 + i * 18;
    trace([[x, 249], [x, 202 - i * 8], [x + 37, 165 - i * 8], [470 + i * 15, 165 - i * 8], [470 + i * 15, 26]]);
  }
  for (let i = 0; i < 9; i++) {
    const x = 205 + i * 22;
    trace([[x, 550], [x, 607 - i * 3], [x + 44, 651 - i * 3], [x + 44, 731]]);
    // The lower left terminals have the characteristic staggered fan.
    const px = 155 + i * 17, py = 622 + i * 20;
    trace([[183 + i * 11, 550], [183 + i * 11, py - 27], [px, py - 12], [px, py]]);
    pad(px, py, 8);
  }
  for (let i = 0; i < 9; i++) {
    // Right-going lines from the upper module terminate on circular pads.
    const x = 580 + i * 14;
    const tx = 785 + i * 16, ty = 236 + i * 27;
    trace([[x, 179], [x, 213 + i * 9], [tx - 38, 213 + i * 9], [tx, ty - 13], [tx, ty]]);
    pad(tx, ty, 9);
  }
  for (let i = 0; i < 9; i++) {
    // Wide curved corner bus down the right side, like the reference.
    const y = 580 + i * 13;
    trace([[1000, y], [766 - i * 13, y], [720 - i * 13, y + 46], [720 - i * 13, 778 + i * 13], [674 - i * 13, 824 + i * 13], [609 - i * 13, 824 + i * 13]]);
  }
  for (let i = 0; i < 8; i++) {
    const x = 714 + i * 18, y = 909 - i * 20;
    trace([[604 + i * 10, 759], [643 + i * 13, 759], [x, 799 - i * 8], [x, y]]);
    pad(x, y, 10);
  }
  for (let i = 0; i < 16; i++) {
    const x = 256 + i * 19;
    trace([[x, 861], [x, 902 + (i % 3) * 12], [x + 25, 927 + (i % 3) * 12], [x + 25, 1038]]);
  }
  // Small chip interconnects in the open middle of the board.
  for (let i = 0; i < 7; i++) {
    trace([[448, 292 + i * 17], [493, 292 + i * 17], [514, 313 + i * 17], [540, 313 + i * 17]]);
    trace([[610, 310 + i * 17], [650 + i * 11, 310 + i * 17], [676 + i * 11, 336 + i * 17], [775, 336 + i * 17]]);
    trace([[447, 462 + i * 18], [484 + i * 12, 462 + i * 18], [503 + i * 12, 481 + i * 18], [623, 481 + i * 18]]);
  }
  for (let i = 0; i < 6; i++) {
    trace([[430, 702 + i * 13], [524 + i * 12, 702 + i * 13], [546 + i * 12, 680 + i * 13], [725, 680 + i * 13]]);
  }

  // Main die and its double machined rim; no third-party lettering.
  plate(177, 249, 272, 303, 21);
  roundRect(194, 266, 238, 269, 13); ctx.strokeStyle = "#696969"; ctx.lineWidth = 2; ctx.stroke();
  pins(185, 230, 22, "horizontal"); pins(185, 555, 22, "horizontal");
  pins(156, 266, 23, "vertical"); pins(455, 266, 23, "vertical");
  for (let i = 0; i < 3; i++) plate(288 + i * 39, 377, 30, 31, 2);

  // Long top and bottom memory modules.
  const memory = (x: number, y: number, w: number) => {
    plate(x, y, w, 64, 6);
    const count = Math.floor((w - 24) / 44);
    for (let i = 0; i < count; i++) {
      plate(x + 14 + i * 44, y + 13, 34, 36, 1);
    }
    const pinCount = Math.floor(w / 12) - 1;
    pins(x + 7, y - 20, pinCount, "horizontal"); pins(x + 7, y + 69, pinCount, "horizontal");
  };
  memory(483, 109, 275);
  memory(219, 795, 406);

  // Four diagonal-hatched processors: recognizable shapes at phone size.
  const smallChip = (x: number, y: number, size: number) => {
    plate(x, y, size, size, 6);
    pins(x + 7, y - 18, Math.floor(size / 12), "horizontal");
    pins(x + 7, y + size + 4, Math.floor(size / 12), "horizontal");
    pins(x - 18, y + 7, Math.floor(size / 12), "vertical");
    pins(x + size + 4, y + 7, Math.floor(size / 12), "vertical");
    ctx.save(); roundRect(x + 7, y + 7, size - 14, size - 14, 2); ctx.clip();
    for (let d = -size; d < size; d += 12) trace([[x + d, y], [x + d + size, y + size]], 3.6);
    ctx.restore();
  };
  smallChip(539, 287, 67);
  smallChip(539, 389, 67);
  smallChip(678, 390, 66);
  smallChip(678, 491, 66);
  smallChip(731, 629, 80);

  // Discrete capacitors and vertical pin rows break up the long routes.
  for (let i = 0; i < 7; i++) plate(504, 490 + i * 34, 28, 15, 1);
  for (let i = 0; i < 5; i++) plate(323 + i * 31, 689, 14, 38, 2);
  for (let i = 0; i < 6; i++) plate(814 + i * 18, 598, 9, 23, 1);
  for (let i = 0; i < 3; i++) plate(822 + i * 31, 505, 19, 38, 2);

  return canvas;
}
