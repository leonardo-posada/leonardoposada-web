import * as THREE from "three";
import { CARD_HEIGHT, CARD_WIDTH, type createStudioCard } from "./studio-card-model";

type CardModel = ReturnType<typeof createStudioCard>;
type CardVariant = Parameters<typeof createStudioCard>[2];

// The shared card model supplies the printed face. This presentation adds a
// solid laminate behind it, so grazing views show an actual machined edge.
function roundedCardBody(width: number, height: number, radius: number) {
  const shape = new THREE.Shape(), x = -width / 2, y = -height / 2;
  shape.moveTo(x + radius, y); shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius); shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

/** Welcome-specific metallic finish for the shared catalog card faces.
 * A factory shares its two geometries across a multi-card composition. */
export function createWelcomeCardBody() {
  const materials: THREE.Material[] = [];
  const edgeRadius = CARD_WIDTH * .045 - .010;
  // Upper bevel ends at z=.015, just beneath the original face at z=.0155.
  // The small XY overhang catches light without outlining the printed face.
  // PORTFOLIO OVERRIDE: thinner body than kontigo-demo
  // (ships body=.062, core=.014; portfolio uses body=.040, core=.009).
  const bodyGeometry = new THREE.ExtrudeGeometry(roundedCardBody(CARD_WIDTH - .026, CARD_HEIGHT - .026, edgeRadius), {
    depth: .040, steps: 1, bevelEnabled: true,
    // Bumped bevelSegments (5→12) and curveSegments (32→64) to keep the
    // bevel smooth after the thinning: smaller bevel + same step count
    // was producing visible facets, especially on the Black card.
    bevelSize: .0045, bevelThickness: .0045, bevelSegments: 12, curveSegments: 64,
  });
  bodyGeometry.translate(0, 0, -.035);
  const coreGeometry = new THREE.ExtrudeGeometry(roundedCardBody(CARD_WIDTH - .0116, CARD_HEIGHT - .0116, edgeRadius + .0072), {
    depth: .009, steps: 1, bevelEnabled: false, curveSegments: 64,
  });
  coreGeometry.translate(0, 0, -.025);
  return {
    attach(model: CardModel, variant: CardVariant) {
      const gold = variant === "v3", orange = variant === "v2" || variant === "v5";
      const warmMetal = gold || orange;
      const edge = new THREE.MeshPhysicalMaterial({
        // Gold / copper tint belongs to the metal itself, including its
        // reflections. A restrained clear coat avoids a milky beige rim.
        color: gold ? "#eeb735" : orange ? "#db6d2a" : "#c2c9d0",
        metalness: warmMetal ? 1 : .96,
        roughness: warmMetal ? .14 : .22,
        clearcoat: warmMetal ? .12 : .65, clearcoatRoughness: warmMetal ? .12 : .18,
        envMap: model.environment, envMapIntensity: gold ? 1.8 : orange ? 1.6 : 1.55,
      });
      // Turn the reflection cards towards the visible sidewall, leaving the
      // printed face's studio lighting intact. The rounded bevel catches
      // narrow highlights while the flat wall retains deep amber reflections.
      if (warmMetal) edge.envMapRotation.set(.18, -.58, gold ? -.22 : -.12);
      const back = new THREE.MeshStandardMaterial({
        color: gold ? "#735322" : orange ? "#b65222" : "#252a30",
        metalness: .78, roughness: .42, envMap: model.environment,
      });
      const core = new THREE.MeshStandardMaterial({
        color: gold ? "#ba821e" : orange ? "#ad481c" : "#555e68",
        metalness: warmMetal ? .96 : .72, roughness: warmMetal ? .24 : .38,
        envMap: model.environment, envMapIntensity: warmMetal ? 1.3 : .85,
      });
      if (warmMetal) core.envMapRotation.copy(edge.envMapRotation);
      materials.push(edge, back, core);
      model.group.add(new THREE.Mesh(bodyGeometry, [back, edge]));
      // A thin inset-looking darker laminate interrupts the reflective sidewall.
      model.group.add(new THREE.Mesh(coreGeometry, core));
    },
    dispose() {
      materials.forEach(material => material.dispose());
      bodyGeometry.dispose(); coreGeometry.dispose();
    },
  };
}

