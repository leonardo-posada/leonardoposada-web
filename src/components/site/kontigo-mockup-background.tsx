"use client";
import { useEffect, useRef } from "react";
import styles from "./kontigo-mockup-background.module.css";
export const K_PATH = "M24 3V67C24 74 29.5 77 35 71.2L59.4 45.8C63.1 41.9 67.1 40 72.5 40H96.8C99 40 99.8 41.8 98.1 43.6L62.8 80.5C58.6 84.9 58.6 88.4 62.8 92.9L106.8 140.5C108.6 142.4 107.7 144 105.5 144H82.8C77.8 144 74 142 70.5 138.2L35.2 100.2C29.8 94.4 24 103 24 113.1V141C24 142.66 22.66 144 21 144H3C1.34 144 0 142.66 0 141V116H-20C-21.1046 116 -22 115.105 -22 114V98C-22 96.895 -21.1046 96 -20 96H0V86H-20C-21.1046 86 -22 85.1046 -22 84V68C-22 66.8954 -21.1046 66 -20 66H0V3C0 1.34 1.34 0 3 0H21C22.66 0 24 1.34 24 3Z";

export function KontigoMockupBackground() {
  return <div className={`${styles.frame} ${styles.ink}`} aria-hidden="true">
    <svg className={styles.mark} viewBox="-22 16 130 144" fill="none" focusable="false">
      <path d={K_PATH} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  </div>;
}

/** Project geometry before drawing: keep the final SVG stroke crisp at every size. */
export function KontigoPerspectiveOutline({ transform }: { transform: string }) {
  const outline = useRef<SVGPathElement>(null);
  useEffect(() => {
    const source = document.createElementNS("http://www.w3.org/2000/svg", "path");
    source.setAttribute("d", K_PATH);
    const length = source.getTotalLength();
    const matrix = new DOMMatrix(transform);
    const steps = Math.ceil(length / .2);
    const segments: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const point = source.getPointAtLength(length * i / steps);
      const projected = matrix.transformPoint(new DOMPoint(
        (point.x + 22) / 130 * 1800 - 176,
        (point.y - 16) / 144 * 1994 - 517,
      ));
      segments.push(`${i ? "L" : "M"}${(projected.x / projected.w).toFixed(3)},${(projected.y / projected.w).toFixed(3)}`);
    }
    outline.current?.setAttribute("d", segments.join(" ") + " Z");
  }, [transform]);
  return <svg className={`pointer-events-none absolute inset-0 h-full w-full ${styles.ink}`} viewBox="0 0 1448 960" fill="none" aria-hidden="true" focusable="false">
    <path ref={outline} stroke="currentColor" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
  </svg>;
}
