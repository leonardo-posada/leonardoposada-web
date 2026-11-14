import type { CSSProperties } from "react";

/** Accessible label stays intact; only the visual words roll inside fixed masks. */
export function RollingText({ children }: { children: string }) {
  let wordIndex = 0;
  return <span className="text-roll">
    <span className="text-roll-accessible">{children}</span>
    <span aria-hidden="true">{children.split(/(\s+)/).map((part, index) => {
      if (/^\s+$/.test(part)) return part;
      const style = { "--roll-index": wordIndex++ } as CSSProperties;
      return <span key={index} className="text-roll-mask"><span className="text-roll-word" style={style}>{part}<span className="text-roll-copy">{part}</span></span></span>;
    })}</span>
  </span>;
}
