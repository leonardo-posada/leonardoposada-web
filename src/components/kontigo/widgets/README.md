Kontigo app widgets for the portfolio.

TatiOrb, its CSS and satin shader come from kontigo-demo/components/animations (native Kontigo Orb). The fallback snapshots are copied from kontigo-demo/public/ai.

The showcase adapts the original @kontigo/tokens Navbar morph geometry (dockCollapse and smoothDockRange), its .82-second linear timing and KontigoAiSheet composer, without importing the full app or changing its source.

## Inversiones y Premios
Los modelos KOIN v1 y Trophy y el carrusel InvestmentsCoinCarousel provienen de kontigo-demo. Conservan geometría, materiales, marcas y animación originales. El renderer de la pareja pausa fuera de pantalla y respeta movimiento reducido. La bienvenida se presenta como contenido nativo del Phone Front, sin modificar su geometría oficial.

La bienvenida usa la interfaz real capturada en kontigo-demo a 2376×5148, ocultando únicamente el carrusel. El carrusel 3D original se superpone con las dimensiones medidas en welcome-layout.json. scripts/capture-investments-welcome.mjs permite regenerarla. No se recrean el header, la tipografía ni el navbar.
