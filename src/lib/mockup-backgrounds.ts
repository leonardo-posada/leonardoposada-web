export type MockupBackground = "studio" | "kontigo";

const KONTIGO_SCENES = new Set([
  "phone-studio-front",
  "phone-studio-right",
  "phone-studio-top",
  "phone-studio-top-low",
  "desktop-studio-left-silhouette-soft-light",
  "desktop-studio-right-mirrored",
  "desktop-studio-front",
  "desktop-studio-matte-vector",
  "desktop-studio-right-tilted",
]);

export function mockupSceneSource(src: string, background: MockupBackground = "studio") {
  const name = src.split("/").pop()?.split(".svg")[0];
  return background === "kontigo" && name && KONTIGO_SCENES.has(name)
    ? `/mockups/${name}-kontigo-dark.svg?${src.includes("?") ? `${src.split("?")[1]}&` : ""}bg=dark-v3`
    : src;
}
