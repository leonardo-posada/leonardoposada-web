# Kontigo compositions

React components that render static showcase assets for the Kontigo case
study. Each file here is one capturable composition; running the capture
script produces a WebP that lives in `public/work/kontigo/` and is
referenced from `src/lib/site.ts`.

## Why this exists

The Kontigo case-study grid uses images (not live components) so the
page stays fast and the layout is predictable. Building those images in
code — instead of in Figma — means they are editable, reproducible, and
versioned with the rest of the portfolio.

## Add a new composition

1. **Create** `<slug>.tsx` in this folder, exporting a named component.
   Keep styles inline so container queries work in isolation.
2. **Register** it in the compositions map at
   `src/app/work/kontigo/compositions/[name]/page.tsx`. The slug becomes
   the preview URL: `/work/kontigo/compositions/<slug>`.
3. **Iterate** in the browser. Preview routes are `noindex`, so Google
   won't crawl the raw compositions.
4. **Capture** to WebP:

   ```sh
   node scripts/capture-composition.mjs \
     --name <slug> \
     --out public/work/kontigo/<filename>.webp
   ```

   The script accepts `--viewport WxH`, `--dpr N`, `--quality 0-100`,
   and `--lossless`. See the script header for defaults.

5. **Reference** the generated WebP from `src/lib/site.ts`. If you need
   to bust browser / Next image caches during iteration, write to a
   suffixed filename (e.g. `card-system-v2.webp`) then rename back to the
   canonical name once approved.

## Keep in mind

- The capture script requires the dev server running (default
  `http://localhost:3001`; override with `--url`).
- Chromium runs headful so `backdrop-filter` renders through the GPU.
