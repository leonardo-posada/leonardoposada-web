import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { createKoinV1Finish } from '../koin-lab/koin-v1-finish';

/** Hollow turned cup, continuous handles and silver foot, using the official KOIN finish. */
export function createTrophy(renderer: THREE.WebGLRenderer, svg: string) {
  const f = createKoinV1Finish(renderer);
  const group = new THREE.Group();
  function turned(points: number[][], material: THREE.Material) {
    const mesh = new THREE.Mesh(f.geometry(new THREE.LatheGeometry(points.map(([r,y]) => new THREE.Vector2(r,y)),128)), material);
    mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh); return mesh;
  }
  turned([[0,-.13],[.14,-.13],[.22,-.06],[.32,.03],[.44,.17],[.53,.34],[.58,.55],[.60,.72],[.59,.75],[.55,.75],[.55,.70],[.53,.53],[.48,.34],[.39,.18],[.28,.07],[.16,.01],[0,.01]],f.champagne);
  const rim=new THREE.Mesh(f.geometry(new THREE.TorusGeometry(.574,.029,16,128)),f.rimGold);rim.rotation.x=Math.PI/2;rim.position.y=.735;group.add(rim);
  turned([[0,-.66],[.23,-.66],[.24,-.62],[.19,-.57],[.10,-.49],[.08,-.36],[.08,-.22],[.14,-.15],[.15,-.10],[0,-.10]],f.rimGold);
  turned([[0,-.88],[.40,-.88],[.43,-.85],[.43,-.76],[.40,-.72],[.28,-.72],[.24,-.66],[0,-.66]],f.silver);
  turned([[0,-.77],[.42,-.77],[.43,-.75],[.41,-.73],[0,-.73]],f.rimGold);
  for(const sign of [-1,1]) {
    const curve = new THREE.CubicBezierCurve3(new THREE.Vector3(sign*.57,.62,0),new THREE.Vector3(sign*1.15,.85,0),new THREE.Vector3(sign*.99,-.04,0),new THREE.Vector3(sign*.29,.05,0));
    group.add(new THREE.Mesh(f.geometry(new THREE.TubeGeometry(curve,64,.047,16,false)),f.rimGold));
  }
  // Official vector mark follows the cup wall, with a shallow polished relief.
  const shapes = new SVGLoader().parse(svg).paths.flatMap(path => SVGLoader.createShapes(path)).map(shape =>
    new THREE.Shape(shape.getPoints(32).map(p => new THREE.Vector2((p.x-85)*.34/162, .43+(84-p.y)*.34/162)))
  );
  const relief = f.geometry(new THREE.ExtrudeGeometry(shapes, {depth:.012,bevelEnabled:true,bevelSize:.003,bevelThickness:.003,bevelSegments:3,curveSegments:32}));
  const position = relief.getAttribute('position');
  const wall = [[.17,.44],[.34,.53],[.55,.58],[.72,.60]];
  for(let i=0;i<position.count;i++) {
    const x=position.getX(i),y=position.getY(i);
    let r=.58;
    for(let j=0;j<wall.length-1;j++) if(y>=wall[j][0]&&y<=wall[j+1][0]) {
      const t=(y-wall[j][0])/(wall[j+1][0]-wall[j][0]);r=wall[j][1]+t*(wall[j+1][1]-wall[j][1]);break;
    }
    position.setZ(i,position.getZ(i)+Math.sqrt(Math.max(0,r*r-x*x))+.001);
  }
  relief.computeVertexNormals();
  for (const back of [false, true]) {
    const mark = new THREE.Mesh(relief, [f.markTop, f.markEdge]);
    mark.name = back ? 'kontigo-trophy-relief-back' : 'kontigo-trophy-relief-front';
    if (back) mark.rotation.y = Math.PI;
    group.add(mark);
  }
  return { group, environment:f.environment.texture, dispose(){f.environment.dispose();f.geometries.forEach(x=>x.dispose());f.materials.forEach(x=>x.dispose());f.textures.forEach(x=>x.dispose())} };
}
