// Approved screen anchors: (121,145), (1325,64), (1325,762), (121,752).
// Keep these fixed when adjusting the housing or support.
export const SCREEN_TRANSFORM = "matrix3d(0.64453527937,-0.05583989971,0,-0.000081482808,0,0.67444444444,0,0,0,0,1,0,121,145,0,1)";

// Mirror the scene and reverse the source screen coordinates so media stays readable.
const RIGHT_MIRROR_TRANSFORM = `translateX(1448px) scaleX(-1) ${SCREEN_TRANSFORM} translateX(1600px) scaleX(-1)`;

export const DESKTOP_VARIANTS = {
  "left-silhouette-soft-light": { id: "studio-01.desktop.left-silhouette-soft-light", src: "/mockups/desktop-studio-left-silhouette-soft-light.svg?v=raised-155", transform: SCREEN_TRANSFORM, label: "vista hacia la izquierda con silueta ligeramente desenfocada" },
  "left-silhouette": { id: "studio-01.desktop.left-silhouette", src: "/mockups/desktop-studio-left-silhouette-v2.svg?v=raised-85", transform: SCREEN_TRANSFORM, label: "vista hacia la izquierda con silueta" },
  right: { id: "studio-01.desktop.right", src: "/mockups/desktop-studio-right-mirrored.svg", transform: RIGHT_MIRROR_TRANSFORM, label: "vista hacia la derecha, espejo de Left" },
  left: { id: "studio-01.desktop.left", src: "/mockups/desktop-studio-matte-vector.svg", transform: SCREEN_TRANSFORM, label: "vista hacia la izquierda" },
  front: { id: "studio-01.desktop.front", src: "/mockups/desktop-studio-front.svg", transform: "matrix3d(0.7875,-6.9388939039072e-18,0,0,0,0.8,0,0,0,0,1,0,94,70,0,1)", label: "vista frontal" },
  "right-tilted": { id: "studio-01.desktop.right-tilted", src: "/mockups/desktop-studio-right-tilted.svg", transform: "matrix3d(0.77917663795604,0.033082357604625,0,7.6935715359592e-05,0.049379036059153,0.80877085393844,0,-2.5524855182314e-05,0,0,1,0,89.23615522225,65.85627315354,0,1)", label: "vista hacia la derecha" },
} as const;
