import { readFileSync, writeFileSync } from 'node:fs';
const directory = new URL('../public/mockups/', import.meta.url);
const original = readFileSync(new URL('desktop-studio-matte-vector.svg', directory), 'utf8');
// Mirror the entire approved scene, including gradients, support and platform.
const mirrored = original
  .replace(/(<svg[^>]*>)/, '$1\n<g transform="translate(1448 0) scale(-1 1)">')
  .replace('Matte desktop monitor — original perspective', 'Studio 01 · Desktop · Right')
  .replace('</svg>', '</g>\n</svg>');
writeFileSync(new URL('desktop-studio-right-mirrored.svg', directory), mirrored);
