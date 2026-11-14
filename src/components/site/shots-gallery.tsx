"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { EASE, DURATION } from "@/lib/motion";
import { LuxuryMedia } from "./luxury-motion";
import { SHOTS, type Shot } from "@/lib/shots";

export function ShotsGallery() {
  const [open, setOpen] = useState<Shot | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {SHOTS.map((shot, i) => (
          <motion.button
            key={shot.id}
            type="button"
            onClick={() => setOpen(shot)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: DURATION.base,
              ease: EASE.out,
              delay: 0.2 + i * 0.1,
            }}
            data-shot-id={shot.id}
            className="group overflow-hidden rounded-xl border border-border/70 bg-card text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <LuxuryMedia>
            <AspectRatio ratio={shot.ratio}>
              <Image src={shot.src} alt={`${shot.project} — visual reference ${shot.title}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
            </AspectRatio>
            </LuxuryMedia>
            <div className="flex items-center justify-between gap-2 px-4 py-3">
              <span className="text-sm font-medium text-foreground">
                {shot.title}
              </span>
              <Badge variant="muted">{shot.project}</Badge>
            </div>
          </motion.button>
        ))}
      </div>

      <Dialog open={open !== null} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="overflow-y-auto p-0">
          {open && (
            <>
              <div className="relative shrink-0" style={{ aspectRatio: open.ratio }}>
                <Image src={open.src} alt={`${open.project} — visual reference ${open.title}`} fill sizes="(min-width: 768px) 768px, 100vw" className="object-contain" />
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border/70 px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <DialogTitle>{open.title}</DialogTitle>
                  <DialogDescription>Previously used as a reference for {open.project}.</DialogDescription>
                </div>
                <Badge variant="muted">Reference</Badge>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
