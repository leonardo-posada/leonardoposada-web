import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { createCryptoCircuitPattern } from "./crypto-circuit-pattern";

/** Satin silver, deep orange intaglio, and a separate engraved circuit back. */
export function createKoinV3(renderer: THREE.WebGLRenderer, svg: string, options: { environment?: THREE.Texture; fitLogo?: boolean; bothSides?: boolean } = {}) {
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  const geometry = <T extends THREE.BufferGeometry>(value: T) => { geometries.push(value); return value; };
  const material = <T extends THREE.Material>(value: T) => { materials.push(value); return value; };
  const texture = (canvas: HTMLCanvasElement) => {
    const result = new THREE.CanvasTexture(canvas);
    result.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    textures.push(result);
    return result;
  };

  const buildEnvironment = () => {
  // Neutral studio cards produce the reference's silver → graphite → white
  // changes. No warm light from the gold proposals is used in this scene.
  const studio = new THREE.Scene();
  studio.background = new THREE.Color("#333840");
  const panelGeometry = geometry(new THREE.PlaneGeometry(1, 1));
  const soft = document.createElement("canvas");
  soft.width = soft.height = 128;
  const light = soft.getContext("2d")!;
  const gradient = light.createLinearGradient(0, 0, 128, 0);
  gradient.addColorStop(0, "#000"); gradient.addColorStop(0.14, "#fff");
  gradient.addColorStop(0.86, "#fff"); gradient.addColorStop(1, "#000");
  light.fillStyle = gradient; light.fillRect(0, 0, 128, 128);
  const softbox = texture(soft);
  const panel = (x: number, y: number, z: number, w: number, h: number, intensity: number, roll = 0) => {
    const mesh = new THREE.Mesh(panelGeometry, material(new THREE.MeshBasicMaterial({
      map: softbox, color: new THREE.Color().setScalar(intensity), side: THREE.DoubleSide,
    })));
    mesh.position.set(x, y, z); mesh.lookAt(0, 0, 0); mesh.rotateZ(roll); mesh.scale.set(w, h, 1);
    studio.add(mesh);
  };
  panel(-3, 3, 5, 6, 7, 3.1, -0.2);
  panel(4.5, 0, 2, 1.6, 7, 4.0);
  panel(0, -4, 3, 7, 2, 2.6, 0.1);
  panel(-3, 2, -4, 3.8, 6, 3.6, 0.2);
  panel(3, -2, -4, 4.5, 2, 2.4, -0.4);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(studio, 0.025, 0.1, 30, { size: 256 });
  pmrem.dispose();
  return environment;

  };
  const ownedEnvironment = options.environment ? undefined : buildEnvironment();
  const environmentTexture = options.environment ?? ownedEnvironment!.texture;

  // Very fine metal grain, without the lettering of the original coin.
  let seed = 30817;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const grain = document.createElement("canvas");
  grain.width = grain.height = 512;
  const grainContext = grain.getContext("2d")!;
  const grainPixels = grainContext.createImageData(512, 512);
  for (let y = 0; y < 512; y++) {
    const brush = (random() - 0.5) * 6;
    for (let x = 0; x < 512; x++) {
      const value = 128 + brush + (random() - 0.5) * 22;
      grainPixels.data.set([value, value, value, 255], (y * 512 + x) * 4);
    }
  }
  grainContext.putImageData(grainPixels, 0, 0);
  const grainTexture = texture(grain);
  const silver = material(new THREE.MeshStandardMaterial({
    color: "#C5CAD1", metalness: 1, roughness: 0.31, bumpMap: grainTexture, bumpScale: 0.0012,
  }));
  const polished = material(new THREE.MeshStandardMaterial({ color: "#E3E7ED", metalness: 1, roughness: 0.16 }));
  const graphite = material(new THREE.MeshStandardMaterial({ color: "#31383F", metalness: 1, roughness: 0.29 }));
  const orange = material(new THREE.MeshStandardMaterial({ color: "#FF6400", metalness: 0.08, roughness: 0.42, envMapIntensity: 0.35 }));
  const orangeWall = material(new THREE.MeshStandardMaterial({ color: "#321608", metalness: 0.25, roughness: 0.38, side: THREE.DoubleSide }));

  const group = new THREE.Group();
  // Wider face rims extend inward only. Outer radius, edge milling and
  // the ±0.120 body thickness remain unchanged on both sides.
  const faceRadius = 0.869;
  const rimSeamRadius = 0.875;
  // Solid backing is below the orange floor, never behind the hole opening.
  const profile = [
    [0, options.bothSides ? 0.004 : -0.102], [options.bothSides ? 0.860 : 0.867, options.bothSides ? 0.004 : -0.102], [0.879, -0.113], [0.888, -0.120], [0.974, -0.120],
    [0.994, -0.109], [1.001, -0.089], [1.001, 0.089], [0.994, 0.109],
    [0.974, 0.120], [0.888, 0.120], [0.875, 0.109], [0.860, -0.004], [0, -0.004],
  ].map(([r, z]) => new THREE.Vector2(r, z));
  const body = new THREE.Mesh(geometry(new THREE.LatheGeometry(profile, 256)), polished);
  body.rotation.x = Math.PI / 2;
  body.castShadow = true;
  group.add(body);

  // Broad, crisply cut side grooves, matching the silver reference.
  const vertices: number[] = [];
  const indices: number[] = [];
  const segments = 112 * 8;
  for (let i = 0; i <= segments; i++) {
    const angle = i / segments * Math.PI * 2;
    const tooth = i % 8;
    const r = 1.002 + (tooth >= 2 && tooth <= 5 ? 0.010 : 0);
    for (const z of [-0.085, 0.085]) vertices.push(Math.cos(angle) * r, Math.sin(angle) * r, z);
    if (i < segments) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 2, a + 3, a + 1);
    }
  }
  const edge = geometry(new THREE.BufferGeometry());
  edge.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  edge.setIndex(indices); edge.computeVertexNormals();
  group.add(new THREE.Mesh(edge, polished));

  const source = new SVGLoader().parse(svg);
  const sourceShapes = source.paths.flatMap(path => SVGLoader.createShapes(path));
  const points = sourceShapes.flatMap(shape => shape.getPoints(24));
  const bounds = new THREE.Box2().setFromPoints(points);
  const center = options.fitLogo ? bounds.getCenter(new THREE.Vector2()) : new THREE.Vector2(85, 84);
  const scale = options.fitLogo ? 1.26 / Math.max(bounds.max.x-bounds.min.x, bounds.max.y-bounds.min.y) : 1.26/162;
  const transform = (path: THREE.Path) => path.getPoints(24).map(point => new THREE.Vector2((point.x-center.x)*scale,(center.y-point.y)*scale));
  const marks = sourceShapes.map(shape => {
    const mark = new THREE.Shape(transform(shape));
    mark.holes = shape.holes.map(hole => new THREE.Path(transform(hole)));
    return mark;
  });
  if (!marks.length) throw new Error("Empty KOIN V3 logomark");
  const frontShape = new THREE.Shape();
  frontShape.absarc(0, 0, faceRadius, 0, Math.PI * 2, false);
  frontShape.holes = marks.map(shape => new THREE.Path(shape.getPoints()));
  const frontGeometry = geometry(new THREE.ExtrudeGeometry([frontShape, ...marks.flatMap(mark => mark.holes.map(hole => new THREE.Shape(hole.getPoints())))], {
    depth: 0.096, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.005,
    bevelSegments: 3, curveSegments: 128, steps: 1,
  }));
  const position = frontGeometry.getAttribute("position");
  const uv = frontGeometry.getAttribute("uv");
  for (let i = 0; i < position.count; i++) uv.setXY(i, (position.getX(i) + 1) / 2, (position.getY(i) + 1) / 2);
  // Assign silver to the small bevel at the opening, darker orange to the
  // deep vertical cut. The floor is a separate receiver for real shadows.
  const groups = [...frontGeometry.groups];
  frontGeometry.clearGroups();
  for (const part of groups) {
    if (part.materialIndex === 0) { frontGeometry.addGroup(part.start, part.count, 0); continue; }
    let runStart = part.start;
    let lastMaterial = -1;
    for (let i = part.start; i < part.start + part.count; i += 3) {
      const x = (position.getX(i) + position.getX(i + 1) + position.getX(i + 2)) / 3;
      const y = (position.getY(i) + position.getY(i + 1) + position.getY(i + 2)) / 3;
      const z = (position.getZ(i) + position.getZ(i + 1) + position.getZ(i + 2)) / 3;
      const nextMaterial = Math.hypot(x, y) > 0.85 || z >= 0.096 ? 1 : 2;
      if (lastMaterial !== nextMaterial) {
        if (lastMaterial !== -1) frontGeometry.addGroup(runStart, i - runStart, lastMaterial);
        runStart = i; lastMaterial = nextMaterial;
      }
    }
    frontGeometry.addGroup(runStart, part.start + part.count - runStart, lastMaterial);
  }
  // Keep this at three draw calls, rather than a material switch at every
  // bevel segment. This is especially important for the mobile shadow pass.
  const batches = Array.from({ length: 3 }, () => ({ positions: [] as number[], normals: [] as number[], uvs: [] as number[] }));
  const normal = frontGeometry.getAttribute("normal");
  frontGeometry.groups.forEach(part => {
    const batch = batches[part.materialIndex ?? 0];
    for (let i = part.start; i < part.start + part.count; i++) {
      batch.positions.push(position.getX(i), position.getY(i), position.getZ(i));
      batch.normals.push(normal.getX(i), normal.getY(i), normal.getZ(i));
      batch.uvs.push(uv.getX(i), uv.getY(i));
    }
  });
  frontGeometry.setAttribute("position", new THREE.Float32BufferAttribute(batches.flatMap(batch => batch.positions), 3));
  frontGeometry.setAttribute("normal", new THREE.Float32BufferAttribute(batches.flatMap(batch => batch.normals), 3));
  frontGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(batches.flatMap(batch => batch.uvs), 2));
  frontGeometry.clearGroups();
  let start = 0;
  batches.forEach((batch, index) => { const count = batch.positions.length / 3; frontGeometry.addGroup(start, count, index); start += count; });
  const front = new THREE.Mesh(frontGeometry, [silver, polished, orangeWall]);
  front.position.z = 0.012;
  front.castShadow = true;
  group.add(front);
  // Baked contact occlusion complements the moving cast shadow. It follows
  // the exact SVG cavity, so even narrow strokes read as deep inset metal.
  const cavityCanvas = document.createElement("canvas");
  const mapSize = 512;
  cavityCanvas.width = cavityCanvas.height = mapSize;
  const cavity = cavityCanvas.getContext("2d")!;
  cavity.fillStyle = "#000"; cavity.fillRect(0, 0, mapSize, mapSize);
  cavity.fillStyle = "#fff";
  for (const shape of marks) {
    cavity.beginPath();
    shape.getPoints().forEach((point, i) => {
      const x = (point.x + 1) * mapSize / 2, y = (1 - point.y) * mapSize / 2;
      if (i === 0) cavity.moveTo(x, y); else cavity.lineTo(x, y);
    });
    cavity.closePath();
    for (const hole of shape.holes) {
      hole.getPoints().forEach((point, i) => {
        const x=(point.x+1)*mapSize/2,y=(1-point.y)*mapSize/2;
        if(i===0)cavity.moveTo(x,y);else cavity.lineTo(x,y);
      });
      cavity.closePath();
    }
    cavity.fill("evenodd");
  }
  const mask = cavity.getImageData(0, 0, mapSize, mapSize);
  const distances = new Float32Array(mapSize * mapSize);
  for (let i = 0; i < distances.length; i++) distances[i] = mask.data[i * 4] > 128 ? 999 : 0;
  for (let y = 1; y < mapSize - 1; y++) for (let x = 1; x < mapSize - 1; x++) {
    const i = y * mapSize + x;
    distances[i] = Math.min(distances[i], distances[i - 1] + 1, distances[i - mapSize] + 1, distances[i - mapSize - 1] + 1.414, distances[i - mapSize + 1] + 1.414);
  }
  for (let y = mapSize - 2; y > 0; y--) for (let x = mapSize - 2; x > 0; x--) {
    const i = y * mapSize + x;
    distances[i] = Math.min(distances[i], distances[i + 1] + 1, distances[i + mapSize] + 1, distances[i + mapSize + 1] + 1.414, distances[i + mapSize - 1] + 1.414);
  }
  for (let i = 0; i < distances.length; i++) {
    const distance = Math.min(1, distances[i] / 10);
    const shade = Math.round(255 * (0.35 + 0.65 * distance * distance * (3 - 2 * distance)));
    mask.data.set([shade, shade, shade, 255], i * 4);
  }
  cavity.putImageData(mask, 0, 0);
  const cavityMap = texture(cavityCanvas);
  cavityMap.colorSpace = THREE.SRGBColorSpace;
  orange.map = cavityMap;
  const floorGeometry = geometry(new THREE.ShapeGeometry(marks, 32));
  const floorPosition = floorGeometry.getAttribute("position"), floorUv = floorGeometry.getAttribute("uv");
  for (let i = 0; i < floorPosition.count; i++) floorUv.setXY(i, (floorPosition.getX(i) + 1) / 2, (floorPosition.getY(i) + 1) / 2);
  const floor = new THREE.Mesh(floorGeometry, orange);
  floor.position.z = 0.008;
  floor.receiveShadow = true;
  group.add(floor);

  const fineRing = geometry(new THREE.TorusGeometry(rimSeamRadius, 0.0045, 8, 256));
  const frontRing = new THREE.Mesh(fineRing, graphite);
  frontRing.position.z = 0.116;
  group.add(frontRing);

  if (options.bothSides) {
    const reverse = new THREE.Group();
    reverse.rotation.y = Math.PI;
    reverse.add(front.clone(), floor.clone(), frontRing.clone());
    group.add(reverse);
  } else {
  // Connected crypto-circuit engraving, with the previous pattern preserved
  // in archive/koin-v3-model-before-crypto.ts.txt for an exact rollback.
  const circuitCanvas = createCryptoCircuitPattern();
  const circuitry = texture(circuitCanvas);
  const circuitColor = texture(circuitCanvas);
  circuitColor.colorSpace = THREE.SRGBColorSpace;
  const backMaterial = material(new THREE.MeshStandardMaterial({
    color: "#E7E9ED", metalness: 0.72, roughness: 0.31, envMapIntensity: 1.15,
    map: circuitColor, bumpMap: circuitry, bumpScale: 0.006,
  }));
  const back = new THREE.Group();
  back.rotation.y = Math.PI;
  const board = new THREE.Mesh(geometry(new THREE.CircleGeometry(faceRadius - 0.002, 192)), backMaterial);
  board.position.z = 0.110;
  back.add(board);
  const backRing = new THREE.Mesh(fineRing, graphite);
  backRing.position.z = 0.116;
  back.add(backRing);
  group.add(back);

  }

  return {
    group, environment: environmentTexture,
    dispose: () => {
      ownedEnvironment?.dispose();
      geometries.forEach(value => value.dispose());
      materials.forEach(value => value.dispose());
      textures.forEach(value => value.dispose());
    },
  };
}
