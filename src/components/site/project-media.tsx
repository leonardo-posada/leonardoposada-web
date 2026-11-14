import Image from "next/image";
import { LuxuryMedia } from "./luxury-motion";
import type { Project } from "@/lib/site";
import { DesktopMockup } from "./desktop-mockup";
import { PhoneMockup } from "./phone-mockup";
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
 * (e.g. `/work/yuno/hero.jpg`). Empty slots display Studio 01 devices, ready for project screens.
 */
export function ProjectMedia({
  hero,
  detail1,
  detail2,
  bottomImage,
  slot,
  desktopMockup,
  deviceMix = "mixed",
}: {
  deviceMix?: "phone" | "desktop" | "mixed";
  desktopMockup?: Project["desktopMockup"];
  hero?: string;
  detail1?: string;
  detail2?: string;
  bottomImage?: string;
  /** Alt-prefix + label suffix, e.g. "Yuno". */
  slot: string;
}) {
  return (
    <div data-home-media={slot} className="col-span-2 grid grid-cols-subgrid gap-4 md:col-span-4 md:gap-8 [&_figcaption]:hidden">
      <div data-home-slot="hero" className="col-span-2 md:col-span-4">
        <LuxuryMedia>
        {hero ? <MediaFrame ratio={16 / 10} src={hero} alt={`${slot} hero`} label={`${slot} — 01`} /> : deviceMix === "mixed" ? <PhoneMockup background={desktopMockup?.background} name={slot} outlineBackground={slot === "Kontigo"} framingScale={slot === "Kontigo" ? 1.12 : undefined} variant={slot === "Kontigo" ? "front" : "top"} screen={slot === "Kontigo" ? desktopMockup?.phoneRightScreen : desktopMockup?.phoneTopScreen} /> : deviceMix === "phone" ? <PhoneMockup background={desktopMockup?.background} name={slot} variant="front" screen={desktopMockup?.phoneScreen} /> : <DesktopMockup background={desktopMockup?.background} name={slot} variant="left" screen={desktopMockup?.screen} />}
        </LuxuryMedia>
      </div>
      <div data-home-slot="detail-1" className="col-span-2 md:col-span-2">
        <LuxuryMedia>
        {detail1 ? <MediaFrame ratio={8 / 7} src={detail1} alt={`${slot} detail 1`} label={`${slot} — 02`} /> : deviceMix === "mixed" ? <DesktopMockup closeUp={slot === "Kontigo"} outlineBackground={slot === "Kontigo"} background={desktopMockup?.background} name={slot} variant="left-silhouette-soft-light" screen={desktopMockup?.leftSilhouetteSoftLightScreen} /> : deviceMix === "phone" ? <DesktopMockup background={desktopMockup?.background} name={slot} variant="left" screen={desktopMockup?.screen} /> : deviceMix === "desktop" ? <DesktopMockup background={desktopMockup?.background} name={slot} variant="front" screen={desktopMockup?.frontScreen} /> : <PhoneMockup background={desktopMockup?.background} name={slot} variant="right" screen={desktopMockup?.phoneRightScreen} />}
        </LuxuryMedia>
      </div>
      <div data-home-slot="detail-2" className="col-span-2 md:col-span-2">
        <LuxuryMedia>
        {slot === "Kontigo" && bottomImage ? <MediaFrame ratio={1448 / 960} src={bottomImage} alt="Kontigo — Card System · paleta de colores" label="Kontigo — 03" fit="contain" /> : detail2 ? <MediaFrame ratio={8 / 7} src={detail2} alt={`${slot} detail 2`} label={`${slot} — 03`} /> : deviceMix === "desktop" ? <PhoneMockup background={desktopMockup?.background} name={slot} variant="right" screen={desktopMockup?.phoneRightScreen} /> : <PhoneMockup background={desktopMockup?.background} name={slot} perspectiveOutline={slot === "Kontigo"} variant={slot === "Kontigo" ? "top" : "top-low"} screen={slot === "Kontigo" ? desktopMockup?.phoneTopScreen : desktopMockup?.phoneTopLowScreen} />}
        </LuxuryMedia>
      </div>
      {bottomImage && <div data-home-slot="bottom" className="col-span-2 md:col-span-4">
        <LuxuryMedia>
          {slot === "Kontigo" ? <PhoneMockup background={desktopMockup?.background} name={slot} perspectiveOutline variant="top" screen={desktopMockup?.phoneTopScreen} /> : <MediaFrame ratio={4 / 3} src={bottomImage} alt={`${slot} — Card system · paleta de colores`} label={`${slot} — 04`} />}
        </LuxuryMedia>
      </div>}
    </div>
  );
}

function MediaFrame({
  ratio,
  src,
  alt,
  label,
  fit = "cover",
}: {
  ratio: number;
  src?: string;
  alt: string;
  label: string;
  fit?: "cover" | "contain";
}) {
  return (
    <AspectRatio
      ratio={ratio}
      className={cn(
        "overflow-hidden rounded-lg bg-muted",
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
          className={cn("transition-transform duration-700 ease-out group-hover:scale-105", fit === "contain" ? "object-contain bg-[#171717]" : "object-cover")}
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
