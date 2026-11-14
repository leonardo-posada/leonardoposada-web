"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { KontigoMockupBackground, KontigoPerspectiveOutline } from "./kontigo-mockup-background";
import { mockupSceneSource, type MockupBackground } from "@/lib/mockup-backgrounds";
import { PHONE_VARIANTS } from "@/lib/phone-mockup-geometry";
import { MockupCaption } from "./mockup-caption";
import { isVideoMask, type Mask } from "@/lib/site";

// Static presentation crop; independent of the complete SVG and hover animation.
const PHONE_FRAMING = {
  front: { scale: 1, origin: "50% 0%" },
  left: { scale: 2.1, origin: "50% 0%" },
  right: { scale: 2.1, origin: "50% 0%" },
  top: { scale: 1.75, origin: "35% 0%" },
  "top-low": { scale: 1.65, origin: "80% 0%" },
} as const;

/** Standalone vector phone, matching the desktop image workflow. Screen content is a separate 396×858 (9:19.5) layer.
 * All geometry is relative to the same 1448×960 artboard, including hover. */
export function PhoneMockup({ hideCaption = false, screenContent, screen, name, variant = "front", background = "studio", framingScale, outlineBackground = false, perspectiveOutline = false }: { hideCaption?: boolean; screenContent?: ReactNode; perspectiveOutline?: boolean; outlineBackground?: boolean; framingScale?: number; screen?: Mask; name: string; background?: MockupBackground; variant?: keyof typeof PHONE_VARIANTS }) {
  const id = `studio-01.phone.${variant}` as const;
  const scene = PHONE_VARIANTS[variant];
  const framing = PHONE_FRAMING[variant];
  const frame = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!frame.current || !(screen || screenContent)) return;
    const element = frame.current;
    const resize = () => { if (media.current) media.current.style.transform = `scale(${element.clientWidth / 1448})`; };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [screen, screenContent]);
  return (
    <figure data-mockup-id={id} data-device-variant={`phone-${variant}`} aria-label={`${name} — phone mockup — ${variant}`}>
      <div ref={frame} className="group/phone relative isolate overflow-hidden rounded-lg bg-[#dadbde]" style={{ backgroundColor: background === "kontigo" ? "#171717" : undefined, aspectRatio: "1448 / 960", containerType: "inline-size" }}>
        {perspectiveOutline && <KontigoPerspectiveOutline transform={scene.transform} />}
        {outlineBackground && <KontigoMockupBackground />}
        <div data-phone-framing={variant} className="absolute inset-0" style={{ transform: `scale(${framingScale ?? framing.scale})`, transformOrigin: framing.origin }}>
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover/phone:scale-105 motion-reduce:transition-none motion-reduce:group-hover/phone:scale-100">
          <Image src={(outlineBackground || perspectiveOutline) ? `/mockups/phone-studio-${variant}-transparent.svg` : mockupSceneSource(scene.src, background)} alt={screen ? "" : `${name} — celular mate, ${variant}, pantalla vacía`} fill unoptimized sizes="(min-width: 1280px) 1200px, 100vw" className="object-contain" />
          {(screen || screenContent) && <div ref={media} className="pointer-events-none absolute left-0 top-0 origin-top-left" style={{ width: 1448, height: 960, transform: "scale(0)" }}>
          <div className="absolute inset-0" style={{ transform: scene.transform, transformOrigin: "0 0" }}>
          {(screen || screenContent) && (
            <div className="pointer-events-auto absolute overflow-hidden bg-[#fafafa]" style={{ left: `${526 / 1448 * 100}%`, top: `${51 / 960 * 100}%`, width: `${396 / 1448 * 100}%`, height: `${858 / 960 * 100}%`, borderRadius: "11.616162% / 5.361305%" }}>
              {screenContent ?? (screen && (isVideoMask(screen) ? (
                <video key={screen.src} src={screen.src} poster={screen.poster} controls loop muted playsInline preload="metadata" aria-label={`${name} — video móvil`} className="h-full w-full object-contain" />
              ) : (
                <Image src={screen.src} alt={screen.alt ?? `${name} — interfaz móvil`} fill sizes="(min-width: 1280px) 900px, 85vw" className="object-contain" />
              )))}
            </div>
          )}
          </div>
          </div>}
        </div>
        </div>
      </div>
      {!hideCaption && <MockupCaption id={id} caption={screen?.caption} />}
    </figure>
  );
}
