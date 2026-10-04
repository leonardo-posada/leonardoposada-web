# leonardoposada-web

Personal portfolio of Leonardo Posada · Product Designer. Built with Next.js 16, React 19, Tailwind 4.

## Stack

- Next.js 16 (App Router) · React 19
- Tailwind CSS 4 with `@theme` tokens
- Phosphor Icons · weight="light" for every icon, weight="fill" only for active states
- Radix primitives (Dialog, Separator, AspectRatio, Slot)
- Framer Motion for reveal animations
- Geist Sans via `next/font/google`

## Design system

Living docs at `/design-system` (route) · source of truth in `DESIGN.md`. The DS dogfoods itself: every page under `src/app/design-system/*` uses the same primitives it documents (`src/components/ui/*`).

## Development

```bash
npm install
npm run dev   # → http://localhost:3000
```

## Scripts

- `npm run dev` · dev server
- `npm run build` · production build
- `npm run start` · serve production build
- `npm run lint` · ESLint

## Repo layout

```
src/
  app/             · routes (home, /shots, /work/[slug], /design-system)
  components/
    ui/            · design-system primitives (Button, Badge, Card, TextLink, Dialog, …)
    site/          · site-specific composition (NavBar, Hero, Footer, …)
  hooks/           · reusable React hooks
  lib/             · site data, tokens, utils (cn, motion, glass, …)
public/
  work/            · per-project media
DESIGN.md          · design-system reference (read first)
```
