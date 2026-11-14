/** Stable IDs: collection.device.view. Left/Right describe where the device
 * faces. Framing, tilt and hover are settings, not separate model identities.
 * New art directions get studio-02, studio-03, etc. Keep existing IDs stable. */
export const MOCKUP_COLLECTIONS = {
  "studio-01": { name: "Studio 01", finish: "Matte", description: "Fondo gris liso, dispositivos mate y marcos finos." },
} as const;

export const MOCKUP_CATALOG = {
  "studio-01.desktop.left-silhouette-soft-light": { collection: "studio-01", device: "Desktop", view: "Left Silhouette Soft Light", label: "Studio 01 · Desktop · Left Silhouette Soft Light" },
  "studio-01.desktop.left-silhouette": { collection: "studio-01", device: "Desktop", view: "Left Silhouette", label: "Studio 01 · Desktop · Left Silhouette" },
  "studio-01.desktop.right": { collection: "studio-01", device: "Desktop", view: "Right", label: "Studio 01 · Desktop · Right" },
  "studio-01.desktop.left": { collection: "studio-01", device: "Desktop", view: "Left", label: "Studio 01 · Desktop · Left" },
  "studio-01.desktop.front": { collection: "studio-01", device: "Desktop", view: "Front", label: "Studio 01 · Desktop · Front" },
  "studio-01.desktop.right-tilted": { collection: "studio-01", device: "Desktop", view: "Right Tilted", label: "Studio 01 · Desktop · Right Tilted" },
  "studio-01.phone.top-low": { collection: "studio-01", device: "Phone", view: "Top Low", label: "Studio 01 · Phone · Top Low" },
  "studio-01.phone.top": { collection: "studio-01", device: "Phone", view: "Top", label: "Studio 01 · Phone · Top" },
  "studio-01.phone.left": { collection: "studio-01", device: "Phone", view: "Left", label: "Studio 01 · Phone · Left" },
  "studio-01.phone.right": { collection: "studio-01", device: "Phone", view: "Right", label: "Studio 01 · Phone · Right" },
  "studio-01.phone.front": { collection: "studio-01", device: "Phone", view: "Front", label: "Studio 01 · Phone · Front" },
} as const;

export type MockupId = keyof typeof MOCKUP_CATALOG;
