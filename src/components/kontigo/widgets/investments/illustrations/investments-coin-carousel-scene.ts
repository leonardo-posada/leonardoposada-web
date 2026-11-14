import * as THREE from "three";
import { createInvestmentsReferenceStudio } from "./investments-reference-studio";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { createKoinV3 } from "../koin-lab/koin-v3-model";
import { createKoinV1 } from "../koin-lab/koin-v1-model";

export const INVESTMENT_COINS = ["AAPL", "BTC", "NVDA", "ETH", "TSLA", "SOL", "AMZN", "USDC", "NFLX", "COIN"] as const;
type Options = { finish?: "gold" | "silver" | "reference"; reducedMotion: boolean; onReady: () => void; onError: () => void };

/** One renderer, one KOIN studio and shared coin geometry for the entire wheel. */
export function createInvestmentCoinCarousel(canvas: HTMLCanvasElement, mark: string, logos: string[], options: Options) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1.2, .1, 40);
  const isReference = options.finish === "reference";
  camera.position.set(0, 0, 8.0);
  const isSilver = options.finish === "silver";
  const silverModels: ReturnType<typeof createKoinV3>[] = [];
  const template = isSilver
    ? createKoinV3(renderer, logos[0], { fitLogo: true, bothSides: true })
    : createKoinV1(renderer, mark);
  const referenceStudio = isReference ? createInvestmentsReferenceStudio(renderer) : undefined;
  scene.environment = referenceStudio?.texture ?? template.environment;
  scene.add(new THREE.AmbientLight(0xffffff, .45));
  const key = new THREE.DirectionalLight(isSilver ? 0xffffff : 0xfff4df, 2.2); key.position.set(-3, 4, 5);
  const fill = new THREE.DirectionalLight(isSilver ? 0xffffff : 0xe3ebff, .9); fill.position.set(4, -1, -4);
  scene.add(key, fill);
  if (isReference) { key.color.set(0xffffff); fill.color.set(0xffffff); key.intensity=1.4; fill.intensity=.5; }
  const wheel = new THREE.Group();
  // Horizontal wheel with a slight elevated view to reveal both depth arcs.
  // Each logo stays upright while the coins turn around the shared Y axis.
  wheel.rotation.set(.14, 0, 0);
  scene.add(wheel);
  const ownedGeometry: THREE.BufferGeometry[] = [];
  const ownedMaterials: THREE.Material[] = [];
  const faceMaterials = new Map<THREE.Material, THREE.Material>();
  const top = new THREE.MeshStandardMaterial({color: isReference ? "#7B8086" : "#F1D9A8", metalness: 1, roughness: isReference ? .28 : .19});
  const edge = new THREE.MeshStandardMaterial({color: isReference ? "#BAC0C5" : "#C7C6BF", metalness: 1, roughness: .145});
  ownedMaterials.push(top, edge);
  const loader = new SVGLoader();
  const coins = logos.map((svg, index) => {
    if (isSilver) {
      const model = index === 0 ? template : createKoinV3(renderer, svg, { fitLogo: true, bothSides: true, environment: template.environment });
      if (index !== 0) silverModels.push(model);
      model.group.name = INVESTMENT_COINS[index];
      model.group.scale.setScalar(.86);
      wheel.add(model.group);
      return model.group;
    }
    const coin = template.group.clone(true);
    const marks: THREE.Mesh[] = [];
    coin.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      if (object.name === "koin-relief-mark") { marks.push(object); return; }
      const material = object.material as THREE.MeshStandardMaterial;
      // Preserve the official KOIN materials, grain and studio for V3.
      // Remove its K-shaped contact map before substituting the company logos.
      const tint = material.color.getHexString();
      if (material.map || isReference) {
        if (!faceMaterials.has(material)) {
          const clean = material.clone(); clean.map = null;
          if (isReference) {
            const face = tint === "b69b6c";
            clean.color.set(face ? "#A3A7AB" : tint === "354153" ? "#292D31" : "#C6CBCF");
            clean.roughness = face ? .29 : .18;
            clean.envMapIntensity = 1;
          }
          faceMaterials.set(material, clean); ownedMaterials.push(clean);
        }
        object.material = faceMaterials.get(material)!;
      }
    });
    const shapes = loader.parse(svg).paths.flatMap(path => SVGLoader.createShapes(path));
    const geometry = new THREE.ExtrudeGeometry(shapes, {depth: 2.4, bevelEnabled: true, bevelThickness: .5, bevelSize: .45, bevelSegments: 2, curveSegments: 3, steps: 1});
    geometry.computeBoundingBox();
    const bounds = geometry.boundingBox!;
    const size = Math.max(bounds.max.x-bounds.min.x,bounds.max.y-bounds.min.y);
    const centerX=(bounds.max.x+bounds.min.x)/2, centerY=(bounds.max.y+bounds.min.y)/2;
    const positions=geometry.getAttribute("position");
    for(let i=0;i<positions.count;i++){
      const x=(positions.getX(i)-centerX)*1.20/size;
      const y=(centerY-positions.getY(i))*1.20/size;
      const crown=.035*(1-(x*x+y*y)/(.928*.928));
      positions.setXYZ(i,x,y,.086+crown+positions.getZ(i)*(isReference ? .45 : 1.20)/size);
    }
    // Y inversion changes winding. Flip each triangle to retain outward faces.
    const attrs=Object.values(geometry.attributes);
    for(let i=0;i<positions.count;i+=3)for(const attr of attrs){
      if (!(attr instanceof THREE.BufferAttribute)) continue;
      for(let c=0;c<attr.itemSize;c++){
        const a=(i+1)*attr.itemSize+c,b=(i+2)*attr.itemSize+c;
        const temp=attr.array[a];attr.array[a]=attr.array[b];attr.array[b]=temp;
      }
    }
    geometry.computeVertexNormals();
    if (isReference) {
      // Match the smooth crown on the logo caps instead of revealing SVG
      // triangulation as unwanted triangular reflections in the metal.
      const normals = geometry.getAttribute("normal");
      const normal = new THREE.Vector3();
      for (const part of geometry.groups) {
        if (part.materialIndex !== 0) continue;
        for (let i=part.start; i<part.start+part.count; i++) {
          const sign = normals.getZ(i) >= 0 ? 1 : -1;
          normal.set(.07*positions.getX(i)/(.928*.928), .07*positions.getY(i)/(.928*.928), 1).normalize().multiplyScalar(sign);
          normals.setXYZ(i, normal.x, normal.y, normal.z);
        }
      }
    }
    geometry.computeBoundingSphere(); ownedGeometry.push(geometry);
    marks.forEach(old => {
      const relief = new THREE.Mesh(geometry,[top,edge]);
      old.parent!.add(relief); old.removeFromParent();
    });
    coin.name = INVESTMENT_COINS[index];
    coin.scale.setScalar(.86);
    wheel.add(coin);
    return coin;
  });
  let frame=0, last=0, active=false, disposed=false, lost=false, reduced=options.reducedMotion, ready=false;
  const entranceDuration = .8;
  const entranceEnd = entranceDuration;
  let entranceTime = options.reducedMotion ? entranceEnd : 0;
  const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);
  let rotation=.22, velocity=0, idle=2;
  let gesture: { id: number; x: number; y: number; previousX: number; time: number; dragging: boolean } | null=null;
  const autoSpeed=Math.PI*2/12;
  const render = (now: number) => {
    frame=0;
    if (!active || disposed || lost) return;
    const dt=last ? Math.min((now-last)/1000,.05) : 0; last=now;
    // Advance only while visible; a hidden tab cannot skip the entrance.
    entranceTime = reduced ? entranceEnd : Math.min(entranceEnd, entranceTime + dt);
    if(!gesture?.dragging && !reduced){
      idle+=dt;
      // Let the fling settle, then blend into the motor speed without snapping.
      const target=idle>1.4 ? autoSpeed * easeOut(Math.min(1, entranceTime / entranceDuration)) : 0;
      velocity+=(target-velocity)*(1-Math.exp(-dt*(idle>1.4 ? 1.4 : 3.2)));
      rotation+=velocity*dt;
    }
    coins.forEach((coin,index)=>{
      const angle=index*Math.PI*2/coins.length+rotation;
      const progress = THREE.MathUtils.clamp(entranceTime / entranceDuration, 0, 1);
      const arrival = easeOut(progress);
      const radius = 1.50 * (.95 + .05 * arrival);
      coin.scale.setScalar(.86 * (.96 + .04 * arrival));
      coin.position.set(radius*Math.cos(angle), -.04 * (1-arrival), radius*Math.sin(angle));
      // Tangent-facing discs reveal their face at the sides and their milled
      // edge across the center. Constant angular speed makes a seamless loop.
      coin.rotation.set(0, -angle, 0);
    });
    renderer.render(scene,camera);
    if(!ready){ready=true;options.onReady();}
    if(!reduced)frame=requestAnimationFrame(render);
  };
  const request=()=>{if(active&&!disposed&&!lost&&!frame)frame=requestAnimationFrame(render);};
  const resize=()=>{
    const {width,height}=canvas.getBoundingClientRect();if(!width||!height)return;
    renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();request();
  };
  const pointerDown=(event: PointerEvent)=>{
    if(event.button!==0 || gesture)return;
    gesture={id:event.pointerId,x:event.clientX,y:event.clientY,previousX:event.clientX,time:event.timeStamp,dragging:false};
    velocity=0;idle=0;
  };
  const pointerMove=(event: PointerEvent)=>{
    if(!gesture || event.pointerId!==gesture.id)return;
    const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
    if(!gesture.dragging){
      if(Math.abs(dy)>8 && Math.abs(dy)>Math.abs(dx)){gesture=null;return;}
      if(Math.abs(dx)<5)return;
      gesture.dragging=true;canvas.setPointerCapture(event.pointerId);canvas.style.cursor="grabbing";
    }
    const movement=event.clientX-gesture.previousX;
    const delta=movement/Math.max(canvas.clientWidth,1)*Math.PI*2;
    rotation+=delta;
    const dt=Math.max((event.timeStamp-gesture.time)/1000,.008);
    velocity=THREE.MathUtils.clamp(delta/dt,-3.5,3.5);
    gesture.previousX=event.clientX;gesture.time=event.timeStamp;idle=0;request();
  };
  const pointerEnd=(event: PointerEvent)=>{
    if(!gesture || event.pointerId!==gesture.id)return;
    if(event.type!=="pointerup" || event.timeStamp-gesture.time>100)velocity=0;
    gesture=null;idle=0;canvas.style.cursor="grab";
    if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);
    request();
  };
  const keyDown=(event: KeyboardEvent)=>{
    if(event.key!=="ArrowLeft" && event.key!=="ArrowRight")return;
    event.preventDefault();rotation+=(event.key==="ArrowRight"?1:-1)*Math.PI/4;velocity=0;idle=0;request();
  };
  canvas.addEventListener("pointerdown",pointerDown);
  canvas.addEventListener("pointermove",pointerMove);
  canvas.addEventListener("pointerup",pointerEnd);
  canvas.addEventListener("pointercancel",pointerEnd);
  canvas.addEventListener("lostpointercapture",pointerEnd);
  canvas.addEventListener("keydown",keyDown);
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
  const contextLost=(event: Event)=>{event.preventDefault();lost=true;cancelAnimationFrame(frame);frame=0;options.onError();};
  canvas.addEventListener("webglcontextlost",contextLost);
  return {
    setActive(value: boolean){active=value;last=0;if(!value){cancelAnimationFrame(frame);frame=0;}else request();},
    setReducedMotion(value: boolean){reduced=value;last=0;request();},
    dispose(){disposed=true;cancelAnimationFrame(frame);observer.disconnect();
      canvas.removeEventListener("pointerdown",pointerDown);canvas.removeEventListener("pointermove",pointerMove);
      canvas.removeEventListener("pointerup",pointerEnd);canvas.removeEventListener("pointercancel",pointerEnd);
      canvas.removeEventListener("lostpointercapture",pointerEnd);canvas.removeEventListener("keydown",keyDown);
      canvas.removeEventListener("webglcontextlost",contextLost);ownedGeometry.forEach(g=>g.dispose());ownedMaterials.forEach(m=>m.dispose());silverModels.forEach(model=>model.dispose());template.dispose();referenceStudio?.dispose();renderer.dispose();},
  };
}
