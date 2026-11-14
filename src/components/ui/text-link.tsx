import * as React from "react";
import Link from "next/link";
import { RollingIcon } from "./rolling-icon";
import { RollingText } from "./rolling-text";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textLinkVariants = cva(
  "group inline-flex w-fit items-baseline text-muted-foreground transition-colors hover:text-foreground active:opacity-70",
  {
    variants: {
      variant: {
        nav: "items-center gap-1 text-base font-normal duration-150",
        prominent: "gap-2 text-lg font-light duration-300 md:text-xl",
      },
    },
    defaultVariants: {
      variant: "prominent",
    },
  },
);

const INNER_UNDERLINE_BASE =
  "relative after:pointer-events-none after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-current after:transition-transform after:duration-500 after:ease-out-expo";

const INNER_UNDERLINE_IDLE = "after:scale-x-0 group-hover:after:scale-x-100";
const INNER_UNDERLINE_FORCED = "after:scale-x-100";

type BaseProps = VariantProps<typeof textLinkVariants> & {
  href: string;
  external?: boolean;
  roll?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** Force a visual state for showcase purposes (used in /design-system). */
  pseudo?: "hover" | "active";
  className?: string;
  children: React.ReactNode;
};

export type TextLinkProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>;

export function TextLink({
  href,
  variant = "prominent",
  external,
  roll = false,
  leadingIcon,
  trailingIcon,
  pseudo,
  className,
  children,
  ...rest
}: TextLinkProps) {
  const classes = cn(
    textLinkVariants({ variant }),
    roll && "roll-hover",
    pseudo === "hover" && "text-foreground",
    pseudo === "active" && "opacity-70",
    className,
  );

  const innerClasses =
    variant === "prominent"
      ? cn(
          INNER_UNDERLINE_BASE,
          pseudo === "hover" ? INNER_UNDERLINE_FORCED : INNER_UNDERLINE_IDLE,
        )
      : undefined;

  const content = (
    <>
      {leadingIcon && (roll ? <RollingIcon>{leadingIcon}</RollingIcon> : (
        <span aria-hidden className="inline-flex items-center">{leadingIcon}</span>
      ))}
      <span className={innerClasses}>{roll && typeof children === "string" ? <RollingText>{children}</RollingText> : children}</span>
      {trailingIcon && (roll ? <RollingIcon>{trailingIcon}</RollingIcon> : trailingIcon)}
    </>
  );

  if (external) {
    const isHttp = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        target={isHttp ? "_blank" : undefined}
        rel={isHttp ? "noreferrer" : undefined}
        className={classes}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
