import Image from "next/image";
import { Image as ImageIcon } from "@phosphor-icons/react/dist/ssr";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

/**
 * Media block for a project row.
 *
 * Layout — always the same:
 *   ┌────────────────────────────┐
 *   │           Hero  16:10      │
 *   └────────────────────────────┘
 *   ┌──────────┐   ┌──────────┐
 *   │ Detail 1 │   │ Detail 2 │   8:7 each
 *   └──────────┘   └──────────┘
 *
 * Pass `hero`, `detail1`, `detail2` as absolute paths under `/public`
 * (e.g. `/work/yuno/hero.jpg`). Missing images render a placeholder mask.
 */
export function ProjectMedia({
  hero,
  detail1,
  detail2,
  slot,
}: {
  hero?: string;
  detail1?: string;
  detail2?: string;
  /** Alt-prefix + label suffix, e.g. "Yuno". */
  slot: string;
}) {
  return (
    <div className="col-span-2 grid grid-cols-subgrid gap-4 md:col-span-4 md:gap-8">
      <div className="col-span-2 md:col-span-4">
        <MediaFrame ratio={16 / 10} src={hero} alt={`${slot} hero`} label={`${slot} — 01`} />
      </div>
      <div className="col-span-2 md:col-span-2">
        <MediaFrame ratio={8 / 7} src={detail1} alt={`${slot} detail 1`} label={`${slot} — 02`} />
      </div>
      <div className="col-span-2 md:col-span-2">
        <MediaFrame ratio={8 / 7} src={detail2} alt={`${slot} detail 2`} label={`${slot} — 03`} />
      </div>
    </div>
  );
}

function MediaFrame({
  ratio,
  src,
  alt,
  label,
}: {
  ratio: number;
  src?: string;
  alt: string;
  label: string;
}) {
  return (
    <AspectRatio
      ratio={ratio}
      className={cn(
        "overflow-hidden rounded-lg border border-border/70 bg-muted",
        // Hover effect only for real images so the placeholder stays static.
        src && "group",
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 100vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
          <ImageIcon weight="light" className="size-8 opacity-40" />
          <span className="text-xs font-light uppercase tracking-widest opacity-60">
            {label}
          </span>
        </div>
      )}
    </AspectRatio>
  );
}
