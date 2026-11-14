import * as THREE from "three";

/** Neutral strip lighting: dark silver fields, moving white bands and crisp rims. */
export function createInvestmentsReferenceStudio(renderer: THREE.WebGLRenderer) {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color("#353739");
  const shape = new THREE.PlaneGeometry(1, 1);
  const materials: THREE.Material[] = [];
  const soft = document.createElement("canvas");
  soft.width = 128; soft.height = 128;
  const ctx = soft.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 0, 128, 0);
  gradient.addColorStop(0, "#000"); gradient.addColorStop(.22, "#fff");
  gradient.addColorStop(.78, "#fff"); gradient.addColorStop(1, "#000");
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(soft);
  const panel = (x: number, y: number, z: number, width: number, height: number, strength: number) => {
    const material = new THREE.MeshBasicMaterial({ map: texture, color: new THREE.Color().setScalar(strength), side: THREE.DoubleSide });
    materials.push(material);
    const mesh = new THREE.Mesh(shape, material);
    mesh.position.set(x, y, z); mesh.lookAt(0, 0, 0); mesh.scale.set(width, height, 1);
    studio.add(mesh);
  };
  panel(-4, 2, 4, 2.2, 7, 3.0);
  panel(4, 1, 3, .85, 7, 4.2);
  panel(0, 5, 1, 6, 2.6, 2.6);
  panel(-3, 1, -4, 2.1, 7, 3.0);
  panel(4, -1, -3, .85, 6, 3.8);
  panel(0, -4, -1, 6, 1.4, 1.8);
  const generator = new THREE.PMREMGenerator(renderer);
  const environment = generator.fromScene(studio, .025, .1, 30, { size: 256 });
  generator.dispose(); shape.dispose(); texture.dispose(); materials.forEach(material => material.dispose());
  return environment;
}
