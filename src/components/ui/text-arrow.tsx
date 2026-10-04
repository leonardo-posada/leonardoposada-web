import { cn } from "@/lib/utils";

type TextArrowProps = {
  className?: string;
};

export function TextArrow({ className }: TextArrowProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-[1em] translate-y-[0.18em]", className)}
      aria-hidden
    >
      <path d="M1 12h18" />
      <path d="M15.5 9l3.5 3-3.5 3" />
    </svg>
  );
}
