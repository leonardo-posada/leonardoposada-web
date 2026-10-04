"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/design-system", label: "Overview" },
  { href: "/design-system/colors", label: "Colors" },
  { href: "/design-system/typography", label: "Typography" },
  { href: "/design-system/spacing", label: "Spacing" },
  { href: "/design-system/iconography", label: "Iconography" },
  { href: "/design-system/corner-radius", label: "Corner radius" },
  { href: "/design-system/shadows", label: "Shadows" },
  { href: "/design-system/layout", label: "Layout" },
  { href: "/design-system/components", label: "Components" },
];

export function DsNav() {
  const pathname = usePathname();

  return (
    <nav className="col-span-2 md:col-span-4">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 border-b border-border pb-3">
        {LINKS.map((link) => {
          const active =
            link.href === "/design-system"
              ? pathname === "/design-system"
              : pathname.startsWith(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-sm transition-colors",
                  active
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
