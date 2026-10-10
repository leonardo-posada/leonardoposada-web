"use client";

import { useEffect, useRef } from "react";
import { createClubCardCascade } from "./_cards3d/cascade-scene";

/**
 * Composition wrapper around the Kontigo card cascade WebGL scene,
 * ported verbatim from kontigo-demo's `kontigoclub-card-cascade-scene`.
 * Mounts a canvas, hands it to the scene factory, drives active state
 * on mount/unmount, and disposes cleanly.
 */
/**
 * `aspectRatio` controls the OUTER container (the visible dark frame).
 * `canvasAspect` controls the inner WebGL canvas and stays at the ratio
 * the kontigo-demo scene was designed for, so the cards render at the
 * exact same pixel size regardless of outer container height. Any extra
 * height in the container becomes empty padding above/below the cards.
 */
export function Cards3D({
  aspectRatio = "4 / 3",
  canvasAspect = "4 / 3",
}: {
  aspectRatio?: string;
  canvasAspect?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let controller: Awaited<ReturnType<typeof createClubCardCascade>> | undefined;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    (async () => {
      try {
        controller = await createClubCardCascade(
          canvas,
          prefersReduced,
          () => cancelled,
          "v2",
        );
        if (cancelled || !controller) return;
        controller.setActive(true);
      } catch (err) {
        console.error("Cards3D scene failed to initialise", err);
      }
    })();

    return () => {
      cancelled = true;
      controller?.dispose();
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        background: "#171717",
        overflow: "hidden",
        borderRadius: "var(--radius-xl, 14px)",
      }}
    >
      {/* WebGL canvas stays at its native aspect, centered. The outer
          container's extra height spills into empty padding above/below. */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          aspectRatio: canvasAspect,
          maxHeight: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
