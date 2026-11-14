"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePageCurtain } from "./page-curtain-provider";

type CurtainLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & {
  href: string;
};

/** Route links share the same cover / reveal as the portfolio entrance. */
export function CurtainLink({ href, ...props }: CurtainLinkProps) {
  const { navigate } = usePageCurtain();

  return (
    <Link
      {...props}
      href={href}
      onNavigate={(event) => {
        event.preventDefault();
        navigate(href);
      }}
    />
  );
}
