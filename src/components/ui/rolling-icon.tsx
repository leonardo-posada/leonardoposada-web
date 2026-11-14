import type { ReactNode } from "react";

/** Both visual copies share their parent's accessible label and icon state. */
export function RollingIcon({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden="true" className={`icon-roll-mask ${className}`}>
      <span className="icon-roll-track">
        <span className="icon-roll-face">{children}</span>
        <span className="icon-roll-face icon-roll-copy">{children}</span>
      </span>
    </span>
  );
}
