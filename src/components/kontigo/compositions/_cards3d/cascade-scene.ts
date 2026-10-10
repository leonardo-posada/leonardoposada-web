import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { createStudioCard, CARD_HEIGHT, CARD_WIDTH } from "./studio-card-model";
import { createWelcomeCardBody } from "./welcome-card-body";

// Back to front: a descending diagonal, with a distinct perspective per card.
const CARDS = [
  { variant: "v6", x: -1.35, y: 2.55, z: -.75, rx: -.13, ry: .88, rz: .075 },
  { variant: "v3", x: -.50, y: 1.22, z: -.25, rx: -.17, ry: .92, rz: .065 },
  { variant: "v4", x: .40, y: -.12, z: .3, rx: -.12, ry: .86, rz: -.08 },
  { variant: "v1", x: 1.10, y: -1.60, z: .85, rx: -.18, ry: .74, rz: -.27 },
] as const;

// Soft occlusion from the neighboring card also attenuates environment
// reflections: the usual directional shadow map only shades direct lighting.
// Project onto the actual receiving face, rather than floating a dark plane
// through cards that have different rotations. Shared inverse transforms are
// refreshed during the entrance, so the contact follows both moving cards.
function addCardContactShadow(material: THREE.MeshPhysicalMaterial, occluder: { value: THREE.Matrix4 }) {
  material.onBeforeCompile = shader => {
    shader.uniforms.clubOccluderInverse = occluder;
    shader.vertexShader = shader.vertexShader.replace('#include <common>', `#include <common>
      varying vec3 vClubShadowWorld;
    `).replace('#include <project_vertex>', `#include <project_vertex>
      vClubShadowWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
    `);
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 vClubShadowWorld;
      uniform mat4 clubOccluderInverse;
      float clubContactShadow() {
        vec3 origin = (clubOccluderInverse * vec4(vClubShadowWorld, 1.0)).xyz;
        // Broad reflected studio light from the lower-right softbox.
        vec3 direction = normalize((clubOccluderInverse * vec4(0.4, -0.5, 1.0, 0.0)).xyz);
        if (direction.z <= 0.01) return 0.0;
        float distanceToCard = (-0.03 - origin.z) / direction.z;
        if (distanceToCard <= 0.0) return 0.0;
        vec2 projected = origin.xy + direction.xy * distanceToCard;
        vec2 q = abs(projected) - vec2(${(CARD_WIDTH / 2 - .15).toFixed(4)}, ${(CARD_HEIGHT / 2 - .15).toFixed(4)});
        float silhouette = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 0.15;
        // Small gaps yield a tighter contact; distance widens the penumbra.
        float softness = 0.075 + min(distanceToCard * 0.16, 0.23);
        float coverage = 1.0 - smoothstep(-softness, softness * 2.0, silhouette);
        return coverage * 0.46 * exp(-distanceToCard * 0.28);
      }
    `).replace('#include <opaque_fragment>', `
      outgoingLight *= 1.0 - clubContactShadow();
      #include <opaque_fragment>
    `);
  };
  material.customProgramCacheKey = () => 'club-cascade-contact-shadow-v1';
}

const ease = (value: number) => {
  const t = THREE.MathUtils.clamp(value, 0, 1);
  return t * t * t * (10 + t * (6 * t - 15));
};
const loadImage = async (src: string) => { const image = new Image(); image.src = src; await image.decode(); return image; };

/** One renderer for the four existing procedural cards; no pointer interaction. */
export async function createClubCardCascade(canvas: HTMLCanvasElement, reducedMotion: boolean, isCancelled: () => boolean, poseVariant: "v1" | "v2" = "v1") {
  // Both versions share the approved order and poses; V1 softens rear chips.
  const cards = CARDS;
  const [wordmark, mastercard, visa] = await Promise.all([
    fetch("/splash/kontigo-wordmark-white.svg").then(r => { if (!r.ok) throw new Error("Card logo unavailable"); return r.text(); }),
    loadImage("/cards/mastercard.svg"), loadImage("/cards/visa-signature.svg"),
  ]);
  if (isCancelled()) return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
  renderer.setClearColor(0, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 40);
  camera.position.set(0, 0, 14.5); camera.lookAt(0, 0, 0);
  const models: ReturnType<typeof createStudioCard>[] = [];
  const shadowMaterials: THREE.MeshBasicMaterial[] = [];
  const inverseCardTransforms = cards.map(() => ({ value: new THREE.Matrix4() }));
  const bodies = createWelcomeCardBody();
  const faceFinishes: THREE.MeshPhysicalMaterial[] = [];
  const shadowGeometry = new THREE.PlaneGeometry(CARD_WIDTH + .6, CARD_HEIGHT + .6);
  const shadowCanvas = document.createElement("canvas"); shadowCanvas.width = 384; shadowCanvas.height = 256;
  const context = shadowCanvas.getContext("2d")!;
  context.shadowColor = "rgba(0,0,0,.8)"; context.shadowBlur = 22;
  context.fillStyle = "rgba(0,0,0,.8)";
  context.beginPath(); context.roundRect(30, 30, 324, 196, 17); context.fill();
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  const key = new THREE.DirectionalLight("#f3f5ff", 1.25);
  key.position.set(-4, 6, 8); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: .5, far: 25 });
  key.shadow.bias = -.00015; key.shadow.normalBias = .025;
  scene.add(key, new THREE.AmbientLight("#ffffff", .38));
  const fill = new THREE.DirectionalLight("#ffe6cf", .3); fill.position.set(4, -1, 5); scene.add(fill);

  // Photographic strip lights produce reflections in the actual materials,
  // including the chip and bevels, rather than a white overlay on the artwork.
  RectAreaLightUniformsLib.init();
  const movingStrip = new THREE.RectAreaLight("#f7f9ff", 7, .9, 7);
  movingStrip.position.set(7, 2, -.5); movingStrip.lookAt(0, .4, 0);
  const warmBounce = new THREE.RectAreaLight("#ffe2bd", 3, 4.5, 1.1);
  warmBounce.position.set(3, -4, 4); warmBounce.lookAt(0, 0, 0);
  scene.add(movingStrip, warmBounce);

  const print = (signature: boolean) => {
    const image = signature ? visa : mastercard;
    const surface = document.createElement("canvas"); surface.width = 1372; surface.height = 792;
    const ctx = surface.getContext("2d")!;
    const h = surface.height * (signature ? .14 : .16), w = h * image.width / image.height;
    ctx.drawImage(image, surface.width * .95 - w, surface.height * .92 - h, w, h);
    return surface;
  };
  let disposed = false, active = false, reduced = reducedMotion, elapsed = 0, last = 0, frame = 0;
  const observers: ResizeObserver[] = [];
  const dispose = () => {
    if (disposed) return; disposed = true;
    cancelAnimationFrame(frame); observers.forEach(observer => observer.disconnect());
    models.forEach(model => model.dispose()); shadowMaterials.forEach(material => material.dispose());
    bodies.dispose();
    movingStrip.dispose(); warmBounce.dispose();
    shadowTexture.dispose(); shadowGeometry.dispose(); key.shadow.map?.dispose(); renderer.dispose();
  };
  // Yield a browser frame between expensive preparation stages.
  const yieldPreparation = () => new Promise<void>(resolve => setTimeout(resolve, 16));
  try {
    await yieldPreparation();
    if (isCancelled()) { dispose(); return; }
    const prints = [print(true), print(false)];
    for (const [i, pose] of cards.entries()) {
      await yieldPreparation();
      if (isCancelled()) { dispose(); return; }
      const model = createStudioCard(renderer, wordmark, pose.variant, undefined, prints[pose.variant === "v3" || pose.variant === "v4" ? 0 : 1], undefined, false, poseVariant === "v1" && i < 3);
      models.push(model);
      const face = model.group.children[0];
      const finish = face instanceof THREE.Mesh && face.material instanceof THREE.MeshPhysicalMaterial
        ? face.material : undefined;
      if (finish) {
        faceFinishes.push(finish);
        if (i < CARDS.length - 1) addCardContactShadow(finish, inverseCardTransforms[i + 1]);
      }
      bodies.attach(model, pose.variant);
      model.group.traverse(object => {
        if (!(object instanceof THREE.Mesh)) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        object.castShadow = materials.every(material => !material.transparent);
        object.receiveShadow = true;
        // Faces and chips need their own studio in this multi-card scene.
        // Preserve the shared body's dedicated metallic edge environment.
        materials.forEach(material => {
          if (material instanceof THREE.MeshStandardMaterial && !material.envMap) material.envMap = model.environment;
        });
      });
      const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, opacity: .18, depthWrite: false, toneMapped: false });
      shadowMaterials.push(shadowMaterial);
      const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
      shadow.position.set(.12, -.1, -.13); model.group.add(shadow);
      scene.add(model.group);
    }
  } catch (error) { dispose(); throw error; }

  const updatePose = (time: number) => {
    const lightProgress = ease((time - .2) / 2.65);
    movingStrip.position.set(7 - lightProgress * 1.7, 2.5 - lightProgress * 3.8, -.5 + lightProgress * 3);
    movingStrip.lookAt(0, .4, 0);
    // The studio reflection sweeps once and settles; no idle render loop.
    faceFinishes.forEach((finish, i) => finish.envMapRotation.set(-.06, -.20 + lightProgress * .34, -.04 + i * .012));
    for (const [i, pose] of cards.entries()) {
      const t = ease((time - .12 - i * .08) / 1.65);
      const model = models[i].group;
      // Start slightly closer together; unfold into the reference's diagonal.
      model.position.set(pose.x * (.86 + .14 * t), pose.y * (.84 + .16 * t) - .10 * (1 - t), pose.z);
      model.rotation.set(pose.rx + .025 * (1 - t), pose.ry - .075 * (1 - t), pose.rz + .025 * (1 - t));
      model.scale.setScalar(1.35);
    }
    scene.updateMatrixWorld(true);
    models.forEach((model, i) => inverseCardTransforms[i].value.copy(model.group.matrixWorld).invert());
  };
  const draw = (now: number) => {
    frame = 0;
    if (disposed || !active) return;
    elapsed += last ? Math.min((now - last) / 1000, .05) : 0; last = now;
    updatePose(reduced ? 4 : elapsed);
    renderer.render(scene, camera);
    // Static after arrival: no permanent render loop behind the welcome screen.
    if (!reduced && elapsed < 3.1) frame = requestAnimationFrame(draw);
  };
  const requestDraw = () => { if (active && !disposed && !frame) frame = requestAnimationFrame(draw); };
  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); requestDraw();
  };
  // Compile materials and upload textures while the canvas is still hidden.
  // The entrance clock starts only after the first complete frame is ready.
  try {
    resize(); updatePose(reduced ? 4 : 0);
    await yieldPreparation();
    if (isCancelled()) { dispose(); return; }
    await renderer.compileAsync(scene, camera);
    if (isCancelled()) { dispose(); return; }
    await yieldPreparation();
    if (isCancelled()) { dispose(); return; }
    renderer.render(scene, camera);
    await yieldPreparation();
    if (isCancelled()) { dispose(); return; }
  } catch (error) { dispose(); throw error; }
  const observer = new ResizeObserver(resize); observers.push(observer); observer.observe(canvas); resize();
  return {
    setActive(value: boolean) { active = value; last = 0; if (value) requestDraw(); else { cancelAnimationFrame(frame); frame = 0; } },
    replay() {
      // Reuse the loaded scene; repeated taps never interrupt an entrance.
      if (disposed || !active || reduced || elapsed < 3.1) return;
      elapsed = 0; last = 0; requestDraw();
    },
    setReducedMotion(value: boolean) { reduced = value; requestDraw(); },
    dispose,
  };
}
