import * as THREE from "three";
import { createKoinV1Finish } from "./koin-v1-finish";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

/** Champagne faces, a silver milled edge and a raised K in a blue-lit studio. */
export function createKoinV1(renderer: THREE.WebGLRenderer, svg: string, options: { studioBackground?: string; coolStudio?: boolean; blueReflectionStrength?: number } = {}) {
  const { geometries, materials, textures, geometry, material, texture, environment, champagne, silver, rimGold, seamMetal, markTop, markEdge } = createKoinV1Finish(renderer, options);

  const group = new THREE.Group();
  const profile = [
    [0, -0.078], [0.917, -0.078], [0.934, -0.098], [0.952, -0.106],
    [0.978, -0.106], [0.995, -0.095], [1.000, -0.080],
    [1.000, 0.080], [0.995, 0.095], [0.978, 0.106],
    [0.952, 0.106], [0.934, 0.098], [0.917, 0.078], [0, 0.078],
  ].map(([r, z]) => new THREE.Vector2(r, z));
  const body = new THREE.Mesh(geometry(new THREE.LatheGeometry(profile, 256)), silver);
  body.rotation.x = Math.PI / 2;
  group.add(body);

  // Fine, close-spaced milling catches the icy rim light in silhouette.
  const vertices: number[] = [], indices: number[] = [];
  const divisions = 168 * 8;
  for (let i = 0; i <= divisions; i++) {
    const angle = i / divisions * Math.PI * 2;
    const ridge = (1 + Math.cos(angle * 168)) / 2;
    for (const [z, weight] of [[-0.080, 0.3], [-0.070, 1], [0.070, 1], [0.080, 0.3]]) {
      const radius = 1.000 + ridge * 0.007 * weight;
      vertices.push(Math.cos(angle) * radius, Math.sin(angle) * radius, z);
    }
    if (i < divisions) for (let j = 0; j < 3; j++) {
      const a = i * 4 + j;
      indices.push(a, a + 4, a + 1, a + 4, a + 5, a + 1);
    }
  }
  const edgeGeometry = geometry(new THREE.BufferGeometry());
  edgeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  edgeGeometry.setIndex(indices); edgeGeometry.computeVertexNormals();
  group.add(new THREE.Mesh(edgeGeometry, silver));

  const marks = new SVGLoader().parse(svg).paths.flatMap(path => SVGLoader.createShapes(path)).map(shape =>
    new THREE.Shape(shape.getPoints(24).map(point =>
      new THREE.Vector2((point.x - 85) * 1.23 / 162, (84 - point.y) * 1.23 / 162)
    ))
  );
  if (!marks.length) throw new Error("Empty KOIN V1 logomark");
  const radius = 0.928;
  const crownHeight = 0.035;
  const crown = (x: number, y: number) => crownHeight * (1 - (x * x + y * y) / (radius * radius));
  // A shallow crown makes the broad blue/gold reflections travel naturally
  // over the face; the K is built on that same surface, never floats above it.
  const facePositions: number[] = [], faceNormals: number[] = [], faceUvs: number[] = [], faceIndices: number[] = [];
  const radialSteps = 24, angularSteps = 192;
  const normal = new THREE.Vector3();
  for (let ring = 0; ring <= radialSteps; ring++) for (let i = 0; i <= angularSteps; i++) {
    const r = radius * ring / radialSteps, angle = i / angularSteps * Math.PI * 2;
    const x = r * Math.cos(angle), y = r * Math.sin(angle);
    facePositions.push(x, y, 0.082 + crown(x, y));
    normal.set(2 * crownHeight * x / (radius * radius), 2 * crownHeight * y / (radius * radius), 1).normalize();
    faceNormals.push(normal.x, normal.y, normal.z); faceUvs.push((x + 1) / 2, (y + 1) / 2);
    if (ring < radialSteps && i < angularSteps) {
      const a = ring * (angularSteps + 1) + i, b = a + angularSteps + 1;
      faceIndices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const faceGeometry = geometry(new THREE.BufferGeometry());
  faceGeometry.setAttribute("position", new THREE.Float32BufferAttribute(facePositions, 3));
  faceGeometry.setAttribute("normal", new THREE.Float32BufferAttribute(faceNormals, 3));
  faceGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(faceUvs, 2));
  faceGeometry.setIndex(faceIndices);
  const markGeometry = geometry(new THREE.ExtrudeGeometry(marks, {
    depth: 0.043, bevelEnabled: true, bevelSize: 0.007, bevelThickness: 0.007,
    bevelSegments: 4, curveSegments: 32, steps: 1,
  }));
  const markPosition = markGeometry.getAttribute("position"), markNormal = markGeometry.getAttribute("normal");
  for (let i = 0; i < markPosition.count; i++) {
    const x = markPosition.getX(i), y = markPosition.getY(i), nz = markNormal.getZ(i);
    markPosition.setZ(i, markPosition.getZ(i) + 0.086 + crown(x, y));
    normal.set(markNormal.getX(i) + 2 * crownHeight * x / (radius * radius) * nz,
      markNormal.getY(i) + 2 * crownHeight * y / (radius * radius) * nz, nz).normalize();
    markNormal.setXYZ(i, normal.x, normal.y, normal.z);
  }
  // Soft contact shadow remains visible even while a face turns away from
  // the key light; the directional shadow above it changes with the rotation.
  const contactCanvas = document.createElement("canvas");
  contactCanvas.width = contactCanvas.height = 512;
  const contact = contactCanvas.getContext("2d")!;
  contact.fillStyle = "white"; contact.fillRect(0, 0, 512, 512);
  contact.shadowColor = "#171F31"; contact.shadowBlur = 5;
  contact.shadowOffsetX = 1; contact.shadowOffsetY = 2;
  contact.fillStyle = "#333";
  for (const shape of marks) {
    contact.beginPath();
    shape.getPoints().forEach((point, index) => {
      if (index === 0) contact.moveTo((point.x + 1) * 256, (1 - point.y) * 256);
      else contact.lineTo((point.x + 1) * 256, (1 - point.y) * 256);
    });
    contact.closePath(); contact.fill();
  }
  const contactMap = texture(contactCanvas);
  contactMap.colorSpace = THREE.SRGBColorSpace;
  champagne.map = contactMap;
  const seamGeometry = geometry(new THREE.TorusGeometry(0.932, 0.007, 12, 256));
  const lipGeometry = geometry(new THREE.TorusGeometry(0.966, 0.011, 12, 256));
  for (const back of [false, true]) {
    const side = new THREE.Group();
    if (back) side.rotation.y = Math.PI;
    const face = new THREE.Mesh(faceGeometry, champagne);
    face.receiveShadow = true;
    const mark = new THREE.Mesh(markGeometry, [markTop, markEdge]);
    mark.name = "koin-relief-mark";
    mark.castShadow = true;
    const seam = new THREE.Mesh(seamGeometry, seamMetal); seam.position.z = 0.100;
    const lip = new THREE.Mesh(lipGeometry, rimGold); lip.position.z = 0.106;
    side.add(face, mark, seam, lip); group.add(side);
  }
  return {
    group, environment: environment.texture,
    dispose: () => {
      environment.dispose();
      geometries.forEach(value => value.dispose());
      materials.forEach(value => value.dispose());
      textures.forEach(value => value.dispose());
    },
  };
}
