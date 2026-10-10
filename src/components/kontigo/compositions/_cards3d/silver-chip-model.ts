import * as THREE from "three";
import type { ChipVariant } from "./chip-designs";
import { createSilverChipSurface } from "./silver-chip-surface";

/** Contact channels have real depth and rounded shoulders. The silver surface
 * has different roughness per contact; highlights come from the 3D lights. */
export function createSilverChip(variant: ChipVariant, anisotropy: number, gold = false, inset = false, softReflections = false) {
  const surface = createSilverChipSurface(variant);
  const textures: THREE.Texture[] = [], geometries: THREE.BufferGeometry[] = [], materials: THREE.Material[] = [];
  const texture = (canvas: HTMLCanvasElement, color = false) => {
    const map = new THREE.CanvasTexture(canvas); map.anisotropy = anisotropy;
    if (color) map.colorSpace = THREE.SRGBColorSpace;
    textures.push(map); return map;
  };
  const geometry = <T extends THREE.BufferGeometry>(g: T) => { geometries.push(g); return g; };
  const material = <T extends THREE.Material>(m: T) => { materials.push(m); return m; };
  const rounded = (w: number, h: number, r: number) => {
    const shape = new THREE.Shape(), x = -w / 2, y = -h / 2;
    shape.moveTo(x + r, y); shape.lineTo(x + w - r, y); shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r); shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h); shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y);
    return shape;
  };
  const group = new THREE.Group(), w = .453, h = .324, r = .041;
  if (inset) {
    // A visible machined pocket: sloping metal shoulder, then a narrow dark
    // contact seam. The contacts themselves retain their approved gold finish.
    const outer = rounded(w + .022, h + .022, r + .011).getPoints(32);
    const inner = rounded(w + .006, h + .006, r + .003).getPoints(32);
    const verts: number[] = [], triangles: number[] = [];
    for (let i = 0; i < outer.length; i++) {
      verts.push(outer[i].x, outer[i].y, .0032, inner[i].x, inner[i].y, .002);
      if (i < outer.length - 1) {
        const a = i * 2;
        triangles.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    }
    const shoulder = geometry(new THREE.BufferGeometry());
    shoulder.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    shoulder.setIndex(triangles); shoulder.computeVertexNormals();
    group.add(new THREE.Mesh(shoulder, material(new THREE.MeshPhysicalMaterial({
      color: "#c4a374", metalness: .95, roughness: .26, envMapIntensity: .9, side: THREE.DoubleSide,
    }))));
    const seam = rounded(w + .006, h + .006, r + .003);
    seam.holes.push(rounded(w - .001, h - .001, r - .0005));
    const seamMesh = new THREE.Mesh(geometry(new THREE.ShapeGeometry(seam, 32)), material(new THREE.MeshStandardMaterial({
      color: "#a18a65", metalness: .55, roughness: .55, side: THREE.DoubleSide,
    })));
    seamMesh.position.z = .002; group.add(seamMesh);
  }
  const backing = geometry(new THREE.ExtrudeGeometry(rounded(w, h, r), {
    depth: .0007, bevelSize: .0004, bevelThickness: .0004, bevelSegments: 3, curveSegments: 32,
  }));
  group.add(new THREE.Mesh(backing, material(new THREE.MeshStandardMaterial({ color: gold ? "#59431e" : "#353b43", metalness: .7, roughness: .42 }))));

  // A polished retaining lip around the machined silver insert.
  const rimShape = rounded(w, h, r); rimShape.holes.push(rounded(w - .004, h - .004, r - .002));
  const rim = geometry(new THREE.ExtrudeGeometry(rimShape, { depth: inset ? .0012 : .0034, bevelSize: inset ? .0006 : .00025, bevelThickness: .0003, bevelSegments: 3, curveSegments: 32 }));
  group.add(new THREE.Mesh(rim, material(new THREE.MeshStandardMaterial({ color: gold ? (inset ? "#b79855" : "#f1cf85") : "#bfc7d2", metalness: 1, roughness: .2, envMapIntensity: .85 }))));

  const positions: number[] = [], uvs: number[] = [], indices: number[] = [];
  const fw = w - .003, fh = h - .003, fr = r - .0015, nx = 280, ny = 202;
  for (let iy = 0; iy <= ny; iy++) {
    const y = -fh / 2 + fh * iy / ny;
    const dy = Math.max(0, Math.abs(y) - (fh / 2 - fr));
    const extent = fw / 2 - fr + Math.sqrt(Math.max(0, fr * fr - dy * dy));
    for (let ix = 0; ix <= nx; ix++) {
      const x = -extent + extent * 2 * ix / nx, u = x / w + .5, v = y / h + .5;
      const depth = surface.heightAt(u, 1 - v);
      positions.push(x, y, .0014 + depth * (inset ? .003 : .0025)); uvs.push(u, v);
      if (ix < nx && iy < ny) { const a = iy * (nx + 1) + ix, b = a + nx + 1; indices.push(a, a + 1, b, a + 1, b + 1, b); }
    }
  }
  const face = geometry(new THREE.BufferGeometry());
  face.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  face.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2)); face.setIndex(indices); face.computeVertexNormals();
  const contactColor = texture(surface.color, true);
  // Opt-in catalog trial: a restrained contact-colored light floor prevents
  // broad metal pads reflecting black. The same map keeps channels dark.
  const silver = material(new THREE.MeshPhysicalMaterial({
    color: gold ? "#efc675" : "#ffffff",
    map: contactColor,
    emissive: softReflections ? (gold ? "#efc675" : "#ffffff") : "#000000",
    emissiveMap: softReflections ? contactColor : null, emissiveIntensity: softReflections ? .25 : 0,
    bumpMap: texture(surface.bump), bumpScale: .00006,
    roughnessMap: texture(surface.roughness), roughness: softReflections ? .44 : .34, metalness: 1,
    anisotropy: softReflections ? .35 : .75, anisotropyMap: texture(surface.direction), envMapIntensity: .82, clearcoat: .08, clearcoatRoughness: .3,
  }));
  group.add(new THREE.Mesh(face, silver));
  // Lower the real contact assembly almost flush with the card surface.
  // Keep the channel floor above the face to avoid clipping through the metal.
  group.position.set(-1.20, -.005, inset ? .0167 : .0225);
  return { group, dispose() { geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); } };
}
