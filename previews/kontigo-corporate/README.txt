Dashboard Kontigo para el portafolio.

Esta carpeta conserva la vista de revisión y una copia de los cuatro archivos de código que la generan. Los originales editables siguen en scripts/.

Para continuar: editar los archivos de scripts/ y ejecutar PREVIEW_ONLY=1 node scripts/capture-kontigo-corporate.mjs desde la raíz del proyecto.
La vista actual se sirve en http://127.0.0.1:3203/.
Para abrir esta copia: python3 -m http.server 3203 --bind 127.0.0.1 --directory previews/kontigo-corporate

Para generar la imagen 6400 x 3600: node scripts/capture-kontigo-corporate.mjs. Se requiere kontigo-corporate local en localhost:3202.

index.html contiene las imágenes y la tipografía incorporadas: puede abrirse como copia visual sin Corporate activo.
archive/ guarda capturas intermedias y el experimento descartado fuera del código y de los assets de producción.
Los originales editables activos están en scripts/. Las copias de esta carpeta conservan el estado antes de la limpieza.
