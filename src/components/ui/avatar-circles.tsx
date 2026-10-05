import Image from "next/image";
import { cn } from "@/lib/utils";

export type AvatarCircleItem = {
  name: string;
  href: string;
  /** Optional image. If omitted, the initials of `name` are rendered instead. */
  src?: string;
};

/**
 * Overlapping circle avatars that link out (e.g. LinkedIn). Inspired by
 * Magic UI's AvatarCircles. Each avatar has a background-colored ring so the
 * overlap stays legible on any surface. Hover lifts the avatar + brings it to
 * the top of the stack.
 */
export function AvatarCircles({
  items,
  size = 40,
  className,
}: {
  items: readonly AvatarCircleItem[];
  size?: number;
  className?: string;
}) {
  return (
    <ul className={cn("flex -space-x-2 flex-wrap", className)}>
      {items.map((item) => {
        const initials = item.name
          .split(" ")
          .map((w) => w[0] ?? "")
          .slice(0, 2)
          .join("")
          .toUpperCase();
        return (
          <li key={item.name} style={{ width: size, height: size }}>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${item.name} on LinkedIn`}
              title={item.name}
              className="relative inline-flex size-full items-center justify-center overflow-hidden rounded-full bg-muted ring-2 ring-background transition-transform duration-200 ease-out-expo hover:z-10 hover:-translate-y-0.5"
            >
              {item.src ? (
                <Image
                  src={item.src}
                  alt={item.name}
                  width={size}
                  height={size}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium text-muted-foreground">
                  {initials}
                </span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
