import * as THREE from "three";
import { CARD_HEIGHT, CARD_WIDTH, type createStudioCard } from "./studio-card-model";

type CardModel = ReturnType<typeof createStudioCard>;
type CardVariant = NonNullable<Parameters<typeof createStudioCard>[2]>;

/** The approved V6 body wraps the face pigment around a polished edge.
 * Circular corners match every Studio Card's analytic silhouette exactly. */
function wrappedCardBodyGeometry() {
  const faceWidth = CARD_WIDTH - .018, faceHeight = CARD_HEIGHT - .018;
  const width = faceWidth - .024, height = faceHeight - .024;
  const radius = CARD_WIDTH * .045 - .006 - .012;
  const x = width / 2 - radius, y = height / 2 - radius;
  const shape = new THREE.Shape();
  shape.moveTo(-x, -height / 2);
  shape.lineTo(x, -height / 2);
  shape.absarc(x, -y, radius, -Math.PI / 2, 0, false);
  shape.lineTo(width / 2, y);
  shape.absarc(x, y, radius, 0, Math.PI / 2, false);
  shape.lineTo(-x, height / 2);
  shape.absarc(-x, y, radius, Math.PI / 2, Math.PI, false);
  shape.lineTo(-width / 2, -y);
  shape.absarc(-x, -y, radius, Math.PI, Math.PI * 1.5, false);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: .010, steps: 1, bevelEnabled: true,
    bevelSize: .002, bevelThickness: .002, bevelSegments: 8, curveSegments: 48,
  });
  // ~0.014 total depth: EXAGGERATED paper-thin profile (sanity test).
  geometry.translate(0, 0, -.010);
  const positions = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  for (let i = 0; i < positions.count; i++) {
    // Project the face texture through the full thickness, so its colors
    // and illustrations continue at exactly the same position on the edge.
    uv.setXY(i, positions.getX(i) / faceWidth + .5, positions.getY(i) / faceHeight + .5);
  }
  return geometry;
}

/** Sidewalls reflect behind the card, where the face's studio has no lights.
 * Light them with their own strip-box environment, without baking highlights
 * into the pigment or turning the edge into a self-illuminated plastic band. */
function cardEdgeStudio(renderer: THREE.WebGLRenderer, tint = "#fafcff") {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color("#777777");
  const geometry = new THREE.PlaneGeometry(1, 1);
  const materials: THREE.MeshBasicMaterial[] = [];
  const panel = (x: number, y: number, z: number, w: number, h: number, strength: number, roll = 0) => {
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(tint).multiplyScalar(strength), side: THREE.DoubleSide });
    materials.push(material);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z); mesh.lookAt(0, 0, 0); mesh.rotateZ(roll); mesh.scale.set(w, h, 1);
    studio.add(mesh);
  };
  panel(-2, 1, -5, 2.3, 8, 3.8, -.2);
  panel(2.8, 0, -4, .65, 7, 5.5, .15);
  panel(0, -4, -2.5, 9, 2.6, 5, .12);
  panel(0, 4, -1.5, 7, 2.8, 3.5);
  panel(-4, 0, 0, 1.2, 7, 3.5);
  panel(4, 1, 1, 1.6, 6, 3);
  const pmrem = new THREE.PMREMGenerator(renderer);
  try {
    return pmrem.fromScene(studio, .02, .1, 30, { size: 256 });
  } finally {
    pmrem.dispose(); geometry.dispose(); materials.forEach(material => material.dispose());
  }
}

// Match each face's material rather than giving all designs a silver rim.
// V6 retains its approved values, including the original roughness texture.
const LAB_EDGE_FINISH = {
  v1: { metalness: .92, roughness: .19, clearcoat: .35, envMapIntensity: 1.15, emissiveIntensity: .025 },
  v2: { metalness: .94, roughness: .2, clearcoat: .22, envMapIntensity: 1.15, emissiveIntensity: .025 },
  v3: { metalness: .98, roughness: .16, clearcoat: .18, envMapIntensity: 1.6, emissiveIntensity: .015 },
  v4: { metalness: .9, roughness: .2, clearcoat: .8, envMapIntensity: 1.25, emissiveIntensity: .018 },
  v5: { metalness: .52, roughness: .22, clearcoat: .8, envMapIntensity: 1, emissiveIntensity: .035 },
  v6: { metalness: .94, roughness: .19, clearcoat: .85, envMapIntensity: 1.05, emissiveIntensity: .025 },
  v7: { metalness: .98, roughness: .16, clearcoat: .18, envMapIntensity: 1.6, emissiveIntensity: .015 },
} satisfies Record<CardVariant, Partial<THREE.MeshPhysicalMaterialParameters>>;

/** Card Lab and Club Benefits share the approved thickness and edge lighting.
 * The welcome uses its own metallic edge finish on the same catalog faces.
 * Allocate once per visible presentation and release with its WebGL scene. */
export function createStudioCardBody(renderer: THREE.WebGLRenderer) {
  const materials: THREE.MeshPhysicalMaterial[] = [];
  let geometry: THREE.ExtrudeGeometry | undefined;
  const environments = new Map<string, THREE.WebGLRenderTarget>();
  return {
    attach(model: CardModel, variant: CardVariant = "v1") {
      const face = model.group.children[0];
      if (!(face instanceof THREE.Mesh) || !(face.material instanceof THREE.MeshPhysicalMaterial)) return;
      geometry ??= wrappedCardBodyGeometry();
      const tint = (variant === "v3" || variant === "v7") ? "#fff0c3" : variant === "v2" ? "#ffe0c2" : "#fafcff";
      let environment = environments.get(tint);
      if (!environment) { environment = cardEdgeStudio(renderer, tint); environments.set(tint, environment); }
      const edge = face.material.clone();
      edge.setValues(LAB_EDGE_FINISH[variant]);
      // Face-aligned brushing has no tangent direction on a wrapped sidewall.
      // A polished cut is isotropic; inheriting brushing can black out the edge.
      edge.anisotropy = 0;
      edge.bumpScale = .00012;
      edge.clearcoatRoughness = .08;
      // Printed UV varnish belongs to the front, not the machined sidewall.
      edge.clearcoatMap = null;
      edge.clearcoatRoughnessMap = null;
      edge.envMap = environment.texture;
      edge.toneMapped = true;
      edge.emissive.set("#ffffff");
      edge.emissiveMap = edge.map;
      materials.push(edge);
      const shell = new THREE.Mesh(geometry, edge);
      shell.name = `card-lab-body-${variant}`;
      model.group.add(shell);
    },
    dispose() {
      materials.forEach(material => material.dispose());
      geometry?.dispose(); environments.forEach(environment => environment.dispose());
    },
  };
}
