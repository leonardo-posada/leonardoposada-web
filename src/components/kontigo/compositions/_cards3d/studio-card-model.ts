import type { StudioCardDesign } from "./studio-card-design";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { createIllustratedFinish } from "./studio-card-illustrated";
import { createWhiteSilverFinish } from "./studio-card-silver";
import { createBlackFinish } from "./studio-card-black";
import { createEngravedGoldFinish } from "./studio-card-engraved-gold";
import { createGoldFinish } from "./studio-card-gold";
import { createOrangeFinish } from "./studio-card-orange";
import { createNoiseFinish } from "./studio-card-noise";
import { createSilverChip } from "./silver-chip-model";
import { DEFAULT_CARD_CHIP, type ChipVariant } from "./chip-designs";

export const CARD_WIDTH = 3.43;
export const CARD_HEIGHT = CARD_WIDTH * 396 / 686;

/** Shared physical card; V1 has a fine granular finish. */
export function createStudioCard(renderer: THREE.WebGLRenderer, wordmark: string, variant: StudioCardDesign = "v1", chipVariant: ChipVariant = DEFAULT_CARD_CHIP, printFace?: HTMLCanvasElement, orangeMark?: HTMLImageElement, engravedChip = false, softChipReflections = false) {
  const isSilver = variant === "v6";
  const isIllustrated = variant === "v5";
  const isBlack = variant === "v4";
  const isEngraved = variant === "v7";
  const isGold = variant === "v3" || isEngraved;
  const isNoise = !isGold && !isBlack && !isIllustrated && !isSilver;
  const logoShapes = new SVGLoader().parse(wordmark).paths.flatMap(path => SVGLoader.createShapes(path));
  if (!logoShapes.length) throw new Error("Empty card wordmark");
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  const geometry = <T extends THREE.BufferGeometry>(value: T) => { geometries.push(value); return value; };
  const material = <T extends THREE.Material>(value: T) => { materials.push(value); return value; };
  const texture = (canvas: HTMLCanvasElement, color = false) => {
    const result = new THREE.CanvasTexture(canvas);
    if (color) result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    textures.push(result);
    return result;
  };
  const rounded = (w: number, h: number, r: number) => {
    const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  };

  // A neutral photographic studio: broad softboxes and narrow edge lights.
  // Specular reflections move over the metal when the actual card rotates.
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(isSilver ? "#5f6266" : "#252525");
  const softboxCanvas = document.createElement("canvas");
  softboxCanvas.width = 128; softboxCanvas.height = 128;
  const softContext = softboxCanvas.getContext("2d")!;
  const softPixels = softContext.createImageData(128, 128);
  for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
    const edge = Math.min(x / 24, (127 - x) / 24, y / 24, (127 - y) / 24, 1);
    const v = Math.round(255 * edge * edge * (3 - 2 * edge));
    softPixels.data.set([v, v, v, 255], (y * 128 + x) * 4);
  }
  softContext.putImageData(softPixels, 0, 0);
  const softbox = texture(softboxCanvas, true);
  const panelGeo = geometry(new THREE.PlaneGeometry(1, 1));
  const panel = (x: number, y: number, z: number, w: number, h: number, strength: number, tint: string, rotation = 0) => {
    const light = new THREE.Mesh(panelGeo, material(new THREE.MeshBasicMaterial({
      map: softbox, color: new THREE.Color((isBlack || isSilver || isEngraved) ? "#F4F7FA" : tint).multiplyScalar(strength), side: THREE.DoubleSide,
    })));
    light.position.set(x, y, z); light.lookAt(0, 0, 0); light.rotateZ(rotation); light.scale.set(w, h, 1);
    studio.add(light);
  };
  panel(-2.5, 3.7, 4.5, 5.5, 4.5, 3, "#FFF4E5", -.3);
  panel(1.0, -.8, 5.5, 1.15, 8, 5, "#FFFFFF", -.55);
  panel(-4, -.6, 3, 1.6, 6, 2.5, "#E9F1FF");
  panel(4, 2, 2, 1.2, 5, 3.5, "#FFE2BC");
  panel(.5, -4.5, 2, 6, .65, 3, "#FFFFFF");
  if (isSilver) {
    // Broad neutral bounce retains the silver between the moving strip
    // highlights, instead of letting it reflect a nearly black studio.
    panel(-2, -3, 5, 5, 4, 1.15, "#FFFFFF", -.15);
    panel(3.5, 0, 4, 1.3, 7, 2.2, "#FFFFFF", .12);
  }
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(studio, .025, .1, 30, { size: 256 });
  pmrem.dispose();

  // The color is pigment, not a baked photograph of a reflection. Seeded
  // horizontal micro-scratches also drive physical roughness and surface bump.
  let seed = 38113;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const tw = 1536, th = 888;
  const pigment = document.createElement("canvas"); pigment.width = tw; pigment.height = th;
  const pigmentContext = pigment.getContext("2d")!;
  const base = pigmentContext.createLinearGradient(0, 0, tw * .68, th);
  if (isGold) {
    base.addColorStop(0, "#795014"); base.addColorStop(.28, "#af822b");
    base.addColorStop(.54, "#93631b"); base.addColorStop(.8, "#70470e");
    base.addColorStop(1, "#a57521");
  } else {
  base.addColorStop(0, "#100F0E"); base.addColorStop(.26, "#1C120D");
  base.addColorStop(.45, "#44200A"); base.addColorStop(.62, "#C24A06");
  base.addColorStop(.80, "#F46D06"); base.addColorStop(1, "#FF850C");
  }
  pigmentContext.fillStyle = base; pigmentContext.fillRect(0, 0, tw, th);
  const grain = document.createElement("canvas"); grain.width = tw; grain.height = th;
  const grainContext = grain.getContext("2d")!;
  grainContext.fillStyle = "#808080"; grainContext.fillRect(0, 0, tw, th);
  for (let i = 0; i < 14000; i++) {
    const x = random() * tw, y = random() * th, length = 8 + random() * 220;
    const light = random() > .5;
    const alpha = .025 + random() * .055;
    pigmentContext.strokeStyle = light ? `rgba(255,224,173,${alpha})` : `rgba(0,0,0,${alpha})`;
    pigmentContext.lineWidth = .35 + random() * .50;
    pigmentContext.beginPath(); pigmentContext.moveTo(x, y); pigmentContext.lineTo(x + length, y); pigmentContext.stroke();
    grainContext.strokeStyle = light ? "rgba(255,255,255,.13)" : "rgba(0,0,0,.13)";
    grainContext.lineWidth = .5;
    grainContext.beginPath(); grainContext.moveTo(x, y); grainContext.lineTo(x + length, y); grainContext.stroke();
  }
  const orange = variant === "v2" && orangeMark ? createOrangeFinish(tw, th, orangeMark) : null;
  const illustrated = isIllustrated ? createIllustratedFinish(tw, th) : null;
  const engraved = isEngraved && orangeMark ? createEngravedGoldFinish(tw, th, orangeMark) : null;
  const noise = engraved ?? (isSilver ? createWhiteSilverFinish(tw, th) : null) ?? illustrated ?? (isBlack ? createBlackFinish(tw, th) : null) ?? orange ?? (isGold ? createGoldFinish(tw, th) : null) ?? (isNoise ? createNoiseFinish(tw, th) : null);
  const pigmentMap = texture(noise?.color ?? pigment, true);
  // Keep the chip's machined contacts identical in both versions.
  const grainMap = texture(grain);
  const coat = material(new THREE.MeshPhysicalMaterial({
    map: pigmentMap, toneMapped: !orange && !illustrated,
    // Preserve the strong brand pigment under the soft studio lighting.
    emissive: (orange || illustrated) ? "#ffffff" : "#000000", emissiveMap: (orange || illustrated) ? pigmentMap : null, emissiveIntensity: illustrated ? .12 : orange ? .35 : 0,
    specularIntensity: illustrated ? .32 : orange ? .25 : 1,
    metalness: isSilver ? .82 : illustrated ? .04 : orange ? .55 : isNoise ? .87 : .93, roughness: isEngraved ? .42 : isSilver ? .32 : illustrated ? .72 : orange ? .62 : isBlack ? .46 : isGold ? .48 : isNoise ? .38 : .34,
    roughnessMap: noise ? texture(noise.roughness) : null,
    bumpMap: noise ? texture(noise.bump) : grainMap, bumpScale: isEngraved ? .0008 : isSilver ? .00065 : illustrated ? .00045 : orange ? .009 : isBlack ? .0016 : isNoise ? .00065 : .0011,
    anisotropy: (isNoise || illustrated || isSilver) ? 0 : .7, anisotropyRotation: isBlack ? Math.PI / 3 : 0,
    clearcoat: isSilver ? .6 : illustrated ? .42 : orange ? .65 : isNoise ? .24 : .18, clearcoatRoughness: isSilver ? .16 : illustrated ? .38 : orange ? .7 : .3,
    clearcoatMap: illustrated ? texture(illustrated.coverage) : orange ? texture(orange.coverage) : null,
    clearcoatRoughnessMap: orange ? texture(orange.varnish) : null, envMapIntensity: isEngraved ? .72 : isSilver ? 1.05 : illustrated ? .45 : orange ? .7 : isBlack ? .85 : isGold ? .62 : 1.1,
  }));
  const group = new THREE.Group();
  const radius = CARD_WIDTH * .045;

  // A very shallow crown (under a tenth of a millimetre at physical scale)
  // gives long lights a soft rolloff without making the face look inflated.
  const w = CARD_WIDTH - .018, h = CARD_HEIGHT - .018, r = radius - .006;
  const positions: number[] = [], normals: number[] = [], uvs: number[] = [], indices: number[] = [];
  // The face now defines the silhouette, including its smooth rounded corners.
  const nx = isEngraved ? 420 : 180, ny = isEngraved ? 260 : 120, crown = .003;
  for (let iy = 0; iy <= ny; iy++) {
    const y = -h / 2 + h * iy / ny;
    const dy = Math.max(0, Math.abs(y) - (h / 2 - r));
    const extent = w / 2 - r + Math.sqrt(Math.max(0, r * r - dy * dy));
    for (let ix = 0; ix <= nx; ix++) {
      const x = -extent + 2 * extent * ix / nx;
      const z = .0155 + crown * (1 - (2 * x / w) ** 2) * (1 - (2 * y / h) ** 2) - (engraved?.recessAt(x / w + .5, y / h + .5) ?? 0);
      positions.push(x, y, z);
      const n = new THREE.Vector3(8 * crown * x / (w * w) * (1 - (2 * y / h) ** 2), 8 * crown * y / (h * h) * (1 - (2 * x / w) ** 2), 1).normalize();
      normals.push(n.x, n.y, n.z); uvs.push(x / w + .5, y / h + .5);
      if (ix < nx && iy < ny) {
        const a = iy * (nx + 1) + ix, b = a + nx + 1;
        indices.push(a, a + 1, b, a + 1, b + 1, b);
      }
    }
  }
  const faceGeo = geometry(new THREE.BufferGeometry());
  faceGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  faceGeo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  faceGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  faceGeo.setIndex(indices);
  if (engraved) faceGeo.computeVertexNormals();
  group.add(new THREE.Mesh(faceGeo, coat));

  // EMV contact assembly: a dark recessed bed, individual silver contacts,
  // fine physical channels between pads and machined bevels on each contact.
  const chip = new THREE.Group(); chip.position.set(-1.20, -.005, .021);
  const recess = new THREE.Mesh(geometry(new THREE.ExtrudeGeometry(rounded(.453, .324, .041), {
    depth: .001, bevelEnabled: true, bevelSize: .0015, bevelThickness: .001, bevelSegments: 2, curveSegments: 16,
  })), material(new THREE.MeshStandardMaterial({ color: "#28251F", metalness: .65, roughness: .3 })));
  chip.add(recess);
  const contact = (x: number, y: number, cw: number, ch: number, cr: number, index: number) => {
    const silver = material(new THREE.MeshPhysicalMaterial({
      color: index % 2 ? "#C4C8CC" : "#E1DFD7", metalness: 1,
      roughness: .23 + index * .008, anisotropy: .75,
      bumpMap: grainMap, bumpScale: .00015, envMapIntensity: 1.3,
    }));
    const pad = new THREE.Mesh(geometry(new THREE.ExtrudeGeometry(rounded(cw, ch, cr), {
      depth: .0015, bevelEnabled: true, bevelSize: .0011, bevelThickness: .0012, bevelSegments: 2, curveSegments: 12,
    })), silver);
    pad.position.set(x, y, .0015); chip.add(pad);
  };
  contact(0, 0, .130, .184, .013, 0);
  for (const sign of [-1, 1]) {
    for (let row = 0; row < 3; row++) contact(sign * .145, (1 - row) * .0615, .148, .0565, .008, row + (sign > 0 ? 1 : 0));
    contact(sign * .109, .128, .210, .052, .018, 3);
    contact(sign * .109, -.128, .210, .052, .018, 2);
  }
  group.add(chip);
  let customChip: ReturnType<typeof createSilverChip> | undefined;
  let chipDetail = false;
  let chipLift = 0;
  const setChipDetail = (detail: boolean) => {
    chipDetail = detail;
    group.children.forEach(object => { object.visible = detail ? object === (customChip?.group ?? chip) : object !== chip || !customChip; });
  };
  const setChip = (next?: ChipVariant) => {
    if (customChip) { group.remove(customChip.group); customChip.dispose(); customChip = undefined; }
    chip.visible = !next;
    if (next) {
      customChip = createSilverChip(next, Math.min(8, renderer.capabilities.getMaxAnisotropy()), isGold, isEngraved && engravedChip, softChipReflections);
      customChip.group.position.y += chipLift;
      group.add(customChip.group);
    }
    setChipDetail(chipDetail);
  };
  if (chipVariant) setChip(chipVariant);

  // Contactless waves are their own vector curves, independent of the chip.
  const waves = new THREE.Group(); if (!isEngraved) group.add(waves);
  const ink = material(new THREE.MeshStandardMaterial({ color: isSilver ? "#59606A" : "#ECE8DF", metalness: .22, roughness: .46 }));
  for (let i = 0; i < 4; i++) {
    const waveRadius = .065 + i * .042;
    const points = Array.from({ length: 25 }, (_, j) => {
      const angle = -.69 + j / 24 * 1.38;
      return new THREE.Vector3(-.92 + waveRadius * Math.cos(angle), -.005 + waveRadius * Math.sin(angle), .022);
    });
    const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 32, .005, 6, false);
    waves.add(new THREE.Mesh(geometry(tube), ink));
    const cap = geometry(new THREE.SphereGeometry(.005, 8, 6));
    for (const point of [points[0], points.at(-1)!]) {
      const end = new THREE.Mesh(cap, ink); end.position.copy(point); waves.add(end);
    }
  }

  // Preserve the supplied logo exactly; only its placement and material are set here.
  const logoGeo = geometry(new THREE.ShapeGeometry(logoShapes, 24));
  const scale = .807 / 775;
  logoGeo.scale(scale, -scale, 1);
  // SVG has a downward Y axis; restore winding after mirroring it so the
  // printed logo is lit from the front, just like the card surface.
  const logoIndex = logoGeo.getIndex()!;
  for (let i = 0; i < logoIndex.count; i += 3) {
    const second = logoIndex.getX(i + 1);
    logoIndex.setX(i + 1, logoIndex.getX(i + 2)); logoIndex.setX(i + 2, second);
  }
  logoGeo.translate(-CARD_WIDTH / 2 + .1715, CARD_HEIGHT / 2 - .158, .024);
  const logo = new THREE.Mesh(logoGeo, material(new THREE.MeshStandardMaterial({
    color: isSilver ? "#404751" : "#FAF7F0", metalness: isSilver ? .35 : .12, roughness: .52, side: THREE.DoubleSide,
  })));
  if (!isEngraved) group.add(logo);

  // Printed details share the model transform, so they stay on the surface at any tilt.
  if (printFace) {
    const print = new THREE.Mesh(geometry(new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT)), material(new THREE.MeshBasicMaterial({
      map: texture(printFace, true), transparent: true, depthWrite: false, toneMapped: false,
    })));
    print.position.z = .027;
    group.add(print);
  }

  const setChipLift = (lift: number) => {
    chipLift = lift;
    chip.position.y = -.005 + lift;
    if (customChip) customChip.group.position.y = -.005 + lift;
    waves.position.y = lift;
  };
  return { group, setChip, setChipDetail, setChipLift, environment: environment.texture, dispose() {
    customChip?.dispose();
    environment.dispose(); geometries.forEach(g => g.dispose());
    materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose());
  } };
}
