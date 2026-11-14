import { readFileSync, writeFileSync } from 'node:fs';
const directory = new URL('../public/mockups/', import.meta.url);
const original = readFileSync(new URL('desktop-studio-matte-vector.svg', directory), 'utf8');
const silhouette = readFileSync(new URL('studio-01-leonardo-silhouette-v2.png', directory)).toString('base64');
// Shift only the person 90 artboard pixels left (6.2% of scene width).
const silhouetteX = -90;
// Raise the sharp version 85px, retaining a clear margin above the hair.
const sharpLayer = `<defs><image id="sharp-person" width="1448" height="1086" preserveAspectRatio="none" href="data:image/png;base64,${silhouette}"/></defs><use href="#sharp-person" x="${silhouetteX}" y="-85"/><svg x="${silhouetteX}" y="1000" width="1448" height="86" viewBox="0 1085 1448 1" preserveAspectRatio="none"><use href="#sharp-person"/></svg>`;
// A self-contained scene for opening separately; the media overlay stays editable.
const scene = original.replace('Matte desktop monitor — original perspective', 'Studio 01 · Desktop · Left Silhouette')
  .replace('</svg>', `${sharpLayer}</svg>`);
writeFileSync(new URL('desktop-studio-left-silhouette-v2.svg', directory), scene);

// Optical defocus only on the foreground person; keep the approved sharp asset.
// Raise the person 155px. Extend only the bottom-most torso pixels below the
// source crop so moving the cutout never exposes a horizontal gap at its foot.
const lightLayer = `<defs><filter id="silhouette-defocus" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="2"/></filter><image id="silhouette-person" width="1448" height="1086" preserveAspectRatio="none" href="data:image/png;base64,${silhouette}"/></defs><g filter="url(#silhouette-defocus)"><use href="#silhouette-person" x="${silhouetteX}" y="-155"/><svg x="${silhouetteX}" y="930" width="1448" height="156" viewBox="0 1085 1448 1" preserveAspectRatio="none"><use href="#silhouette-person"/></svg></g>`;
writeFileSync(new URL("studio-01-leonardo-silhouette-shifted.svg", directory), `<svg xmlns="http://www.w3.org/2000/svg" width="1448" height="1086" viewBox="0 0 1448 1086">${sharpLayer}</svg>`);

const lightScene = original.replace('Matte desktop monitor — original perspective', 'Studio 01 · Desktop · Left Silhouette Soft Light')
  .replace('</svg>', `${lightLayer}</svg>`);
writeFileSync(new URL('desktop-studio-left-silhouette-soft-light.svg', directory), lightScene);
writeFileSync(new URL('studio-01-leonardo-silhouette-soft-light.svg', directory), `<svg xmlns="http://www.w3.org/2000/svg" width="1448" height="1086" viewBox="0 0 1448 1086">${lightLayer}</svg>`);
