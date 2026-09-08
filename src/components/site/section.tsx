import * as React from "react";
import { cn } from "@/lib/utils";

export const SITE_CONTAINER =
  "mx-auto w-full max-w-[1800px] px-4 md:px-6 lg:px-14";

export const SITE_GRID =
  "grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "header" | "footer" | "div";
}

export function Section({
  as: Tag = "section",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag className={cn(SITE_CONTAINER, className)} {...props}>
      <div className={SITE_GRID}>{children}</div>
    </Tag>
  );
}
