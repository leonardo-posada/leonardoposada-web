import * as THREE from "three";

export type KoinFinishOptions = { studioBackground?: string; coolStudio?: boolean; blueReflectionStrength?: number };

/** Shared official V1 studio and metals; each caller owns its resources. */
export function createKoinV1Finish(renderer: THREE.WebGLRenderer, options: KoinFinishOptions = {}) {
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

  // Colored studio cards are reflected by the actual metal. Nothing is
  // painted blue or animated as a gloss overlay on top of the coin.
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(options.studioBackground ?? "#151B29");
  const soft = document.createElement("canvas");
  soft.width = 256; soft.height = 128;
  const context = soft.getContext("2d")!;
  const pixels = context.createImageData(256, 128);
  for (let y = 0; y < 128; y++) for (let x = 0; x < 256; x++) {
    const edge = Math.min(x / 26, (255 - x) / 26, y / 24, (127 - y) / 24, 1);
    const value = Math.round(255 * edge * edge * (3 - 2 * edge));
    pixels.data.set([value, value, value, 255], (y * 256 + x) * 4);
  }
  context.putImageData(pixels, 0, 0);
  const softbox = texture(soft);
  const panelGeometry = geometry(new THREE.PlaneGeometry(1, 1));
  const panel = (x: number, y: number, z: number, width: number, height: number, tint: string, strength: number, roll = 0) => {
    const mesh = new THREE.Mesh(panelGeometry, material(new THREE.MeshBasicMaterial({
      map: softbox, color: new THREE.Color(options.coolStudio && ["#FFE6AD", "#FFF6E6", "#FFE2A1"].includes(tint) ? "#FFF8ED" : tint).multiplyScalar(strength * (["#2463FF", "#65A5FF", "#2B62FF", "#629DFF"].includes(tint) ? options.blueReflectionStrength ?? 1 : 1)), side: THREE.DoubleSide,
    })));
    mesh.position.set(x, y, z); mesh.lookAt(0, 0, 0); mesh.rotateZ(roll);
    mesh.scale.set(width, height, 1); studio.add(mesh);
  };
  panel(-2.4, 3.6, 5, 5.0, 3.2, "#FFE6AD", 3.2, -0.2);
  panel(3.8, 1.5, 3.2, 2.1, 6.5, "#FFF6E6", 3.4, -0.25);
  panel(-1.5, 1.6, 4.5, 7.0, 1.8, "#2463FF", 8.0, -0.10);
  panel(-1.0, -3.6, 4, 7.5, 2.0, "#65A5FF", 6.2, -0.12);
  panel(-4.0, -1.4, 1.7, 1.3, 5.8, "#2B62FF", 5.0, -0.3);
  panel(1.0, -4.5, 0, 6.8, 0.65, "#D6F3FF", 7.0);
  panel(-3, 3, -4, 5.5, 3.4, "#FFE2A1", 4.0, 0.25);
  panel(1.5, -1.6, -4.5, 7.0, 1.8, "#2463FF", 8.0, 0.10);
  panel(2.8, -2.2, -4, 5.0, 2.4, "#629DFF", 5.5, 0.3);
  panel(4.5, 0.5, -2, 1.4, 6, "#F1F6FF", 3.4);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(studio, 0.014, 0.1, 30, { size: 256 });
  pmrem.dispose();

  let seed = 42073;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const grain = document.createElement("canvas");
  grain.width = grain.height = 512;
  const grainContext = grain.getContext("2d")!;
  const grainPixels = grainContext.createImageData(512, 512);
  for (let i = 0; i < 512 * 512; i++) {
    const value = 128 + (random() - 0.5) * 24;
    grainPixels.data.set([value, value, value, 255], i * 4);
  }
  grainContext.putImageData(grainPixels, 0, 0);
  const grainMap = texture(grain);
  const champagne = material(new THREE.MeshStandardMaterial({
    color: "#B69B6C", metalness: 1, roughness: 0.23, envMapIntensity: 0.95,
    bumpMap: grainMap, bumpScale: 0.0007,
  }));
  const silver = material(new THREE.MeshStandardMaterial({
    color: "#DCE5F0", metalness: 1, roughness: 0.15, envMapIntensity: 1.15,
  }));
  const rimGold = material(new THREE.MeshStandardMaterial({ color: "#E4C587", metalness: 1, roughness: 0.15 }));
  const seamMetal = material(new THREE.MeshStandardMaterial({ color: "#354153", metalness: 1, roughness: 0.23 }));
  const markTop = material(new THREE.MeshStandardMaterial({ color: "#F1D9A8", metalness: 1, roughness: 0.19 }));
  const markEdge = material(new THREE.MeshStandardMaterial({ color: "#C7C6BF", metalness: 1, roughness: 0.145 }));

  return { geometries, materials, textures, geometry, material, texture, environment, champagne, silver, rimGold, seamMetal, markTop, markEdge };
}
