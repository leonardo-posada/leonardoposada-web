# Design System · leonardoposada-web

Guía de estilos del portafolio. Fuente de verdad para tokens, componentes y convenciones. Si vas a cambiar algo visual, pasá por acá primero.

Para ver cada token y componente **renderizado**, abrí `/design-system` en el site (living reference).

---

## /design-system · living reference (dogfooding)

La ruta `/design-system` es **documentación viva** del DS, y está construida **con los mismos componentes y tokens que documenta** (dogfooding). Esta es una regla dura:

- Toda página dentro de `src/app/design-system/*` usa `<Section>`, `<Card>`, `<Button>`, `<Badge>`, etc. del propio DS.
- Nunca HTML custom con clases hardcoded para "resolver" un ejemplo. Si para mostrar algo necesitás saltarte el DS, es señal de que al DS le falta esa pieza · agregala al DS primero.
- Beneficio: `/design-system` funciona como **test visual continuo**. Si cambiás `--primary` en `globals.css` o rompés `<Button>`, se nota de inmediato.

**Al agregar un token/componente nuevo**, actualizar en este orden:
1. `globals.css` (si es token) o `src/components/ui/<nombre>.tsx` (si es componente).
2. `DESIGN.md` (esta guía).
3. La página correspondiente en `/design-system/*`.

---

## Principios

1. **Monocromo primero.** La paleta base es neutra B/N (foreground sobre background). El color es acento, no estructura.
2. **Dark mode no es opcional.** Todo token tiene su contraparte en `:root.dark`. Nunca escribir hex hardcoded · siempre `var(--token)` o la clase Tailwind equivalente.
3. **Un sistema, no excepciones.** Si no existe un token/variante que resuelve lo que necesitás, se extiende el sistema · no se parchea con valores sueltos.
4. **Reducción de movimiento respetada.** `@media (prefers-reduced-motion: reduce)` apaga animaciones. No bypassear.

---

## Tokens

**Fuente:** `src/app/globals.css`. Expuestos a Tailwind vía `@theme` como `bg-background`, `text-foreground`, `rounded-md`, `shadow-sm`, etc.

### Colores · superficie y texto
| Token | Light | Dark | Uso |
|---|---|---|---|
| `--background` | `#ffffff` | `#0a0a0a` | Fondo global del body |
| `--foreground` | `#282a30` | `#fafafa` | Texto por defecto |
| `--card` | `#ffffff` | `#171717` | Fondo de cards |
| `--card-foreground` | `#0a0a0a` | `#fafafa` | Texto en cards |
| `--muted` | `#f5f5f5` | `#262626` | Fondo tenue (chips, placeholders) |
| `--muted-foreground` | `#737373` | `#a3a3a3` | Texto secundario |
| `--accent` | `#f5f5f5` | `#404040` | Hover de ghost/outline |
| `--accent-foreground` | `#171717` | `#fafafa` | Texto sobre accent |
| `--border` | `#e5e5e5` | `rgb(255 255 255 / 10%)` | Bordes |
| `--input` | `#e5e5e5` | `rgb(255 255 255 / 15%)` | Borde de inputs |
| `--input-fill` | `#ffffff` | `rgb(255 255 255 / 4.5%)` | Fondo de inputs |
| `--ring` | `#737373` | `#a3a3a3` | Focus ring |
| `--surface` | `#fafafa` | `#0a0a0a` | Secciones elevadas sobre background |

### Colores · acción
| Token | Light | Dark | Uso |
|---|---|---|---|
| `--primary` | `#0a0a0a` | `#fafafa` | CTA principal (NO es color de marca, es neutro invertido) |
| `--primary-foreground` | `#ffffff` | `#0a0a0a` | Texto sobre primary |
| `--primary-text` | `#0a0a0a` | `#fafafa` | Links, text buttons |
| `--secondary` | `#f5f5f5` | `#262626` | Acción secundaria |
| `--secondary-foreground` | `#171717` | `#fafafa` | Texto sobre secondary |
| `--popover` | `#ffffff` | `#262626` | Fondo de popovers/dropdowns |

### Colores · semánticos
| Token | Light | Dark |
|---|---|---|
| `--destructive` | `#dc2626` | `#f87171` |
| `--destructive-foreground` | `#ffffff` | `#0a0a0a` |
| `--success` | `#15803d` | `#4ade80` |
| `--warning` | `#ca8a04` | `#facc15` |

### Corner radius
```
--radius-xs: 2px
--radius-sm: 6px
--radius-md: 8px     ← default de buttons/badges/inputs
--radius-lg: 10px
--radius-xl: 14px    ← cards
--radius-2xl: 16px
--radius-3xl: 24px
--radius-4xl: 32px
```

### Shadows
```
--shadow-2xs ← subtle lift
--shadow-xs  ← buttons default
--shadow-sm
--shadow-md
--shadow-lg
--shadow-xl
--shadow-2xl
```

> **Regla:** inputs/selects/dropdown triggers **nunca** llevan drop shadow · flat borders.

### Tipografía
- Fuente: **Geist Sans** (via `next/font/google`, variable `--font-geist-sans`).
- Expuesta como `font-sans` en Tailwind.
- Body siempre con `-webkit-font-smoothing: antialiased` + `-moz-osx-font-smoothing: grayscale` (ya aplicado en `globals.css`).
- Escala: usar los defaults de Tailwind (`text-xs`, `text-sm`, `text-base`, `text-lg`, ...). No inventar sizes custom.

**Weights en uso:**
| Weight | Uso |
|---|---|
| `font-light` (300) | Hero + footer links, mobile menu rows (prominent TextLink), hero title |
| `font-normal` (400) | Nav links (nav TextLink), body |
| `font-medium` (500) | Buttons, badges, nav links en estado activo |
| `font-semibold` (600) | Headings (`<h1>`-`<h4>`) |
| `font-bold` (700) | Site title (navbar logo) |

### Animaciones
```
--animate-fade-in: 0.6s ease-out
--animate-fade-up: 0.7s cubic-bezier(0.22, 1, 0.36, 1)
```
Usar como `animate-fade-in` / `animate-fade-up`. Para animaciones más complejas, Framer Motion ya está en el bundle.

### Spacing
- **Unidad base: 4px** (Tailwind default scale, `1 = 0.25rem`).
- Usar siempre pasos de la escala · nada de valores arbitrarios tipo `p-[13px]`.
- Pasos usados en el site: `0, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 10, 14, 16, 24, 32` (ver `/design-system/spacing` para px exactos y uso).
- **Recipes canónicas:**
  - Container x-padding: `px-4 md:px-6 lg:px-14` (16 → 24 → 56 px)
  - Grid gap: `gap-4 md:gap-8` (16 → 32 px)
  - Card padding: `p-6` (24 px)
  - Rhythm entre secciones del DS: `mt-10` (40 px)
  - TextLink icon gap: nav `gap-1` (4 px), prominent `gap-2` (8 px) · simétrico leading/trailing

### Iconography
- **Librería: Phosphor Icons** · [phosphoricons.com](https://github.com/phosphor-icons/homepage). Importar desde `@phosphor-icons/react/dist/ssr` (SSR, cero client JS).
- **Weights permitidos: SOLO `light` y `fill`.** Nunca thin / regular / bold / duotone.
  - `light` · default. Todo el site.
  - `fill` · solo estados activos / selected (visual emphasis).
- **Sizes (clases Tailwind):**
  | Clase | px | Uso |
  |---|---|---|
  | `size-3` | 12 | Íconos en badges |
  | `size-4` | 16 | Default · nav, button, inline |
  | `size-5` | 20 | Dialog close, utility toggles |
  | `size-6` | 24 | Íconos standalone / prominentes |
- Decorativos → `aria-hidden`. Standalone buttons → `aria-label`.
- **No usar emojis como íconos** · chocan con el stroke style de Phosphor.
- **No usar flechas Unicode (`→`, `←`, etc.)** · el glifo cambia por fuente / SO.

**Única excepción custom · `<TextArrow />` (`src/components/ui/text-arrow.tsx`):**
SVG hecho a mano que replica el glifo nativo `→` tal como se ve en macOS. Se usa inline con texto (hero, mobile menu, footer, "Let's talk"). Escala al tamaño de fuente actual (`size-[1em]`) y hereda el color via `currentColor`. Es consistente en Mac/Windows/iOS/Android. No crear más SVGs custom · si necesitás otro ícono, usá Phosphor.

---

## Layout

**Container y grid canónicos (`src/components/site/section.tsx`):**

```ts
SITE_CONTAINER = "mx-auto w-full max-w-[1800px] px-4 md:px-6 lg:px-14"
SITE_GRID      = "grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8"
```

Toda sección usa el componente `<Section>` · no reimplementar container/grid a mano.

**Breakpoints (Tailwind defaults):**
- `md: 768px` · grid pasa de 2 → 4 cols, gap 4 → 8
- `lg: 1024px` · padding horizontal crece a 14 (56px)

---

## Componentes UI (`src/components/ui/`)

Shadcn-style propios: Radix primitives + CVA + `cn()` (tailwind-merge). Si falta algo, se agrega acá · no se instala `shadcn add` ciegamente.

### Button
Variants: `default` · `secondary` · `outline` · `ghost` · `link`
Sizes: `default (h-9)` · `sm (h-8)` · `lg (h-10)` · `icon (size-9)`
Base: `rounded-md`, `text-sm font-medium`, focus ring con offset del background.

### Badge
Variants: `default` · `secondary` · `outline` · `muted`
Base: `rounded-md px-2 py-0.5 text-xs font-medium`, ícono `size-3`.

### Card
- `Card` → `rounded-xl border bg-card text-card-foreground`
- Composición: `CardHeader` · `CardTitle` · `CardDescription` · `CardContent` · `CardFooter`
- Padding interno: `p-6`

### TextLink
Links de texto del site (nav + hero/footer/mobile menu). **NO** son `<Button>` disfrazados · son text-only, sin bg, sin padding fijo, altura dictada por el texto.

Variants:
- `nav` · `text-base font-normal`, color muted → foreground on hover, sin underline. Usado en header desktop.
- `prominent` · `text-lg md:text-xl font-light`, color muted → foreground on hover, **underline 1px que crece de izquierda a derecha** (ease-out, 400ms). Usado en hero, footer y mobile menu.

Estados (ambas variants):
- `default` · muted-foreground
- `hover` · foreground (+ underline grow en prominent)
- `active` (pressed) · `opacity-70` para feedback táctil al click

Props: `href`, `variant`, `external` (http → target `_blank`; mailto/tel → sin target), `leadingIcon`, `trailingIcon`, `className`, `pseudo?: "hover" | "active"` (solo para forzar estados en el DS showcase). Render: Next `<Link>` por default, `<a>` nativo si `external`.

Regla: **cualquier link textual del site** usa `<TextLink>`. No reimplementar las clases a mano.

### Otros
- `Dialog` (Radix)
- `Separator` (Radix)
- `AspectRatio` (Radix)

---

## Convenciones de código

1. **Nunca hex hardcoded.** Usar tokens vía `var(--...)` o clases Tailwind (`bg-background`, `text-foreground`, etc.).
2. **Siempre `cn()`** de `@/lib/utils` para combinar clases · nunca template strings sueltos para condicionales de clase.
3. **CVA para variants.** Si un componente tiene >1 variante visual, se declara con `cva()`, no con props booleanas sueltas.
4. **No reinventar componentes UI.** Antes de crear un `<MyButton>`, revisá `src/components/ui/` · si existe algo parecido, extendé o agregá variante.
5. **No inventar sizes de texto fuera de la escala Tailwind.** Nada de `text-[13px]` o `fontSize: 15`.
6. **Inputs sin shadow.** Flat borders only.
7. **`asChild` pattern (Radix Slot)** para componer sin wrappers extra. Ya está en Button.

---

## Dark mode

- Toggle vía `theme-toggle.tsx` · agrega/quita clase `.dark` en `<html>`.
- Script de init (`themeInitScript`) corre antes de hydration para evitar flash.
- `@custom-variant dark (&:where(.dark, .dark *))` ya definida en `globals.css` · se puede usar la clase `dark:` normalmente.

---

## Qué NO hacer

- ❌ Hardcodear hex en componentes (`style={{ color: '#282a30' }}`, `bg-[#f5f5f5]`).
- ❌ Añadir shadows a inputs/selects.
- ❌ Crear variantes de Button/Badge/Card por fuera del archivo del componente.
- ❌ Introducir una segunda fuente sin discutirlo.
- ❌ Saltarse `cn()` para combinar clases condicionales.
- ❌ Em-dashes (—) en copy user-facing. Usar guiones normales o reescribir.
