"use client";

import { useEffect, useRef } from "react";
import type { VideoMask } from "@/lib/site";

/**
 * Full-width inline video slot. Starts playback from frame 0 when the
 * video enters the viewport, pauses when it leaves — so a short loop
 * with a long freeze tail never surprises the visitor mid-freeze.
 *
 * `preload="auto"` is intentional so playback is seamless when visibility
 * fires; the file is small enough that eager fetch is a fair trade.
 */
export function VideoSlot({ mask }: { mask: VideoMask }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.currentTime = 0;
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className="flex flex-col gap-4">
      <video
        ref={videoRef}
        src={mask.src}
        poster={mask.poster}
        loop
        muted
        playsInline
        preload="auto"
        className="h-auto w-full rounded-xl bg-[#171717]"
      />
      {mask.caption && (
        <figcaption className="max-w-xl text-sm font-light text-muted-foreground leading-[1.5]">
          {mask.caption}
        </figcaption>
      )}
    </figure>
  );
}
