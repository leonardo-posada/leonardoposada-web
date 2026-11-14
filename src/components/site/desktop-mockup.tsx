"use client";

import Image from "next/image";
import { KontigoMockupBackground } from "./kontigo-mockup-background";
import { mockupSceneSource, type MockupBackground } from "@/lib/mockup-backgrounds";
import { MockupCaption } from "./mockup-caption";
import { useEffect, useRef } from "react";
import { isVideoMask, type Mask } from "@/lib/site";

import { DESKTOP_VARIANTS } from "@/lib/desktop-mockup-geometry";

export function DesktopMockup({ screen, name, variant = "left", background = "studio", closeUp = false, outlineBackground = false, fitFront = false, fullResolution = false }: { fullResolution?: boolean; fitFront?: boolean; outlineBackground?: boolean; closeUp?: boolean; screen?: Mask; name: string; background?: MockupBackground; variant?: keyof typeof DESKTOP_VARIANTS }) {
  const scene = DESKTOP_VARIANTS[variant];
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) element.play().catch(() => {});
      else element.pause();
    }, { threshold: .1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [screen]);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = frame.current;
    if (!element || !screen) return;
    const resize = () => {
      if (layer.current) layer.current.style.transform = `scale(${element.clientWidth / 1448})`;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [screen]);

  return (
    <figure data-mockup-id={scene.id} data-device-variant={variant} aria-label={`${name} — desktop mockup${variant === "left" ? "" : ` — ${scene.label}`}`}>
      <div ref={frame} className="group/mockup relative isolate overflow-hidden rounded-lg bg-[#d9dadd]" style={{ aspectRatio: "1448 / 960", backgroundColor: background === "kontigo" ? "#171717" : undefined }}>
        {outlineBackground && <KontigoMockupBackground />}
        {/* Permanent close-up framing, independent of the shared hover zoom.
            Transform device and media together; retain the original coordinates. */}
        <div className="absolute inset-0" style={{
          transform: fitFront && variant === "front" ? "translateY(1.5%) scale(1.04)" : closeUp ? "translateY(-2.65%) scale(1.16)" : variant === "front" ? "translateY(-2.8541666667%) scale(1.18)" : variant === "right-tilted" ? "scale(1.27)" : undefined,
          transformOrigin: closeUp ? "0% 0%" : variant === "right-tilted" ? "0% 0%" : "50% 0%",
        }}>
        <div className="absolute left-0 top-0 w-full origin-[50%_44.1989%] transition-transform duration-700 ease-out group-hover/mockup:scale-105 motion-reduce:transition-none motion-reduce:group-hover/mockup:scale-100" style={{ aspectRatio: "1448 / 1086" }}>
        <div className="absolute inset-0">
        <Image
          src={outlineBackground ? `/mockups/${scene.src.split("/").pop()?.split(".svg")[0]}-transparent.svg` : mockupSceneSource(scene.src, background)}
          alt={screen ? "" : `${name} — monitor mate, ${scene.label}, pantalla vacía`}
          fill
          unoptimized
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="object-contain"
        />
        {screen && (
          <div ref={layer} className="absolute left-0 top-0 origin-top-left" style={{ width: 1448, height: 1086, transform: "scale(0)" }}>
            <div className="absolute left-0 top-0 origin-top-left overflow-hidden bg-[#fafafa]" style={{ width: 1600, height: 900, transform: scene.transform, borderRadius: 3, backgroundColor: background === "kontigo" ? "#0a0a0a" : undefined, WebkitMaskImage: "linear-gradient(#fff, #fff)" }}>
              {isVideoMask(screen) ? (
                <video ref={video} key={screen.src} src={screen.src} poster={screen.poster} autoPlay loop muted disablePictureInPicture playsInline preload="metadata" aria-label={`${name} — video del proyecto`} className="h-full w-full object-contain" />
              ) : (
                <Image src={screen.src} unoptimized={fullResolution} alt={screen.alt ?? `${name} — interfaz del proyecto`} fill sizes="(min-width: 1280px) 1000px, 85vw" className="object-contain" />
              )}
            </div>
          </div>
        )}
        </div>
        {(variant === "left-silhouette" || variant === "left-silhouette-soft-light") && screen && (
          <Image src={variant === "left-silhouette-soft-light" ? "/mockups/studio-01-leonardo-silhouette-soft-light.svg?v=raised-155" : "/mockups/studio-01-leonardo-silhouette-shifted.svg?v=raised-85"} alt="" fill unoptimized sizes="(min-width: 1280px) 1200px, 100vw" className="pointer-events-none object-fill" />
        )}
        </div>
        </div>
      </div>
      <MockupCaption id={scene.id} caption={screen?.caption} />
    </figure>
  );
}
