"use client";

import { useState } from "react";
import Image from "next/image";
import { DesktopMockup } from "./desktop-mockup";
import { PhoneMockup } from "./phone-mockup";
import { DESKTOP_VARIANTS } from "@/lib/desktop-mockup-geometry";
import { PHONE_VARIANTS } from "@/lib/phone-mockup-geometry";
import { MOCKUP_CATALOG } from "@/lib/mockup-catalog";

const desktops = ["left", "front", "right", "right-tilted", "left-silhouette", "left-silhouette-soft-light"] as const satisfies readonly (keyof typeof DESKTOP_VARIANTS)[];
const phones = ["front", "left", "right", "top", "top-low"] as const satisfies readonly (keyof typeof PHONE_VARIANTS)[];

export function MockupLibrary() {
  const [full, setFull] = useState(false);
  const groups = [
    { title: "Desktop", entries: desktops.map(variant => ({
      id: DESKTOP_VARIANTS[variant].id,
      src: DESKTOP_VARIANTS[variant].src,
      preview: <DesktopMockup name="Studio 01" variant={variant} />,
    })) },
    { title: "Phone", entries: phones.map(variant => ({
      id: `studio-01.phone.${variant}` as const,
      src: PHONE_VARIANTS[variant].src,
      preview: <PhoneMockup name="Studio 01" variant={variant} />,
    })) },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Mockup preview framing">
        {[{ label: "Project crop", value: false }, { label: "Full image", value: true }].map(option => (
          <button key={option.label} type="button" aria-pressed={full === option.value} onClick={() => setFull(option.value)} className={`rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${full === option.value ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {option.label}
          </button>
        ))}
      </div>
      {groups.map(group => (
        <div key={group.title}>
          <h3 className="mb-5 text-xl font-medium tracking-tight">{group.title} <span className="ml-2 text-sm font-normal text-muted-foreground">{group.entries.length} variants</span></h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
            {group.entries.map(entry => (
              <article key={entry.id} data-library-mockup={entry.id} className="min-w-0">
                <div className="[&_[data-mockup-label]]:hidden [&_figcaption]:hidden">
                  {full ? (
                    <div className="relative overflow-hidden rounded-lg bg-[#dadbde]" style={{ aspectRatio: group.title === "Desktop" ? "1448 / 1086" : "1448 / 960" }}>
                      <Image src={entry.src} alt={MOCKUP_CATALOG[entry.id].label} fill unoptimized sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
                    </div>
                  ) : entry.preview}
                </div>
                <div className="mt-3 flex flex-wrap items-start justify-between gap-2">
                  <h4 className="text-sm font-medium">{MOCKUP_CATALOG[entry.id].label}</h4>
                  <a href={entry.src} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground" aria-label={`Open ${MOCKUP_CATALOG[entry.id].label} full image`}>Open full image ↗</a>
                </div>
                {entry.id === "studio-01.desktop.left-silhouette" && <p className="mt-1 text-xs text-muted-foreground">Saved alternative · sharp silhouette</p>}
              </article>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
