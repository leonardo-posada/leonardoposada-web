import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../public/mockups/', import.meta.url);
const scenes = ['phone-studio-front', 'phone-studio-right', 'phone-studio-top', 'phone-studio-top-low', 'desktop-studio-left-silhouette-soft-light', 'desktop-studio-right-mirrored', 'desktop-studio-front', 'desktop-studio-right-tilted', 'desktop-studio-matte-vector'];
for (const name of scenes) {
  const source = await readFile(new URL(`${name}.svg`, root), 'utf8');
  // Only the flat backdrop: never recolor the chassis, screen or silhouette.
  let dark = source.replace(/(<rect width="1448" height="960" fill=")#dadbde("\/>|"\s*\/>)/, '$1#171717$2')
    .replace('<path fill="#dadbde" d="M0 0h1448v1086H0z"/>', '<path fill="#171717" d="M0 0h1448v1086H0z"/>');
  if (dark === source) throw new Error(`Background not found: ${name}`);
  if (name.startsWith('desktop-')) {
    dark = dark.replace('fill="#fafafa"', 'fill="#0a0a0a"');
  }
  const target = new URL(`${name}-kontigo-dark.svg`, root);
  await writeFile(target, dark);
  if (['phone-studio-front', 'phone-studio-top', 'phone-studio-right', 'phone-studio-top-low'].includes(name)) {
    const transparent = dark.replace(/<rect width="1448" height="960" fill="#171717"\s*\/>/, '');
    if (transparent === dark) throw new Error('Front backdrop not found');
    await writeFile(new URL(`${name}-transparent.svg`, root), transparent);
  }
  if (name.startsWith('desktop-')) {
    const transparent = dark.replace('<path fill="#171717" d="M0 0h1448v1086H0z"/>', '');
    if (transparent === dark) throw new Error(`Desktop backdrop not found: ${name}`);
    await writeFile(new URL(`${name}-transparent.svg`, root), transparent);
  }
  console.log(fileURLToPath(target));
}
