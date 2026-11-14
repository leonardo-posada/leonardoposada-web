/** Gate expensive scene setup as well as playback. IntersectionObserver tracks
 * sheet entrance transforms and scrolling; visibilitychange handles background
 * tabs. No polling or animation-frame loop is needed for visibility itself. */
export function observeSceneVisibility(element: HTMLElement, onChange: (visible: boolean) => void) {
  let intersects = false;
  let current: boolean | undefined;
  const sync = () => {
    const visible = intersects && !document.hidden;
    if (visible === current) return;
    current = visible;
    element.dataset.sceneActive = String(visible);
    onChange(visible);
  };
  const observer = new IntersectionObserver(([entry]) => {
    intersects = entry.isIntersecting;
    sync();
  }, { threshold: 0 });
  observer.observe(element);
  document.addEventListener("visibilitychange", sync);
  sync();
  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", sync);
    element.dataset.sceneActive = "false";
  };
}
