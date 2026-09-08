"use client";

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

type Shot = {
  id: string;
  title: string;
  project: "Yuno" | "Rappi" | "Kontigo" | "Personal";
  ratio: number;
  tone: string;
};

const SHOTS: Shot[] = [
  { id: "s1", title: "Payments overview", project: "Yuno", ratio: 4 / 3, tone: "from-indigo-500/20 to-indigo-500/5" },
  { id: "s2", title: "Card carousel", project: "Kontigo", ratio: 3 / 4, tone: "from-emerald-500/20 to-emerald-500/5" },
  { id: "s3", title: "Order tracking", project: "Rappi", ratio: 4 / 3, tone: "from-orange-500/20 to-orange-500/5" },
  { id: "s4", title: "Design tokens", project: "Yuno", ratio: 16 / 10, tone: "from-blue-500/20 to-blue-500/5" },
  { id: "s5", title: "Onboarding step", project: "Kontigo", ratio: 3 / 4, tone: "from-purple-500/20 to-purple-500/5" },
  { id: "s6", title: "Restaurant card", project: "Rappi", ratio: 4 / 3, tone: "from-rose-500/20 to-rose-500/5" },
  { id: "s7", title: "Dashboard chart", project: "Yuno", ratio: 16 / 10, tone: "from-cyan-500/20 to-cyan-500/5" },
  { id: "s8", title: "Wallet screen", project: "Kontigo", ratio: 3 / 4, tone: "from-teal-500/20 to-teal-500/5" },
  { id: "s9", title: "Type experiment", project: "Personal", ratio: 4 / 3, tone: "from-amber-500/20 to-amber-500/5" },
];

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
            className="group overflow-hidden rounded-xl border border-border/70 bg-card text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <AspectRatio ratio={shot.ratio}>
              <div
                className={`h-full w-full bg-gradient-to-br ${shot.tone} transition-transform duration-700 ease-out group-hover:scale-105`}
              />
            </AspectRatio>
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
        <DialogContent className="p-0">
          {open && (
            <>
              <AspectRatio ratio={16 / 10}>
                <div
                  className={`h-full w-full bg-gradient-to-br ${open.tone}`}
                />
              </AspectRatio>
              <div className="flex items-center justify-between gap-3 border-t border-border/70 px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <DialogTitle>{open.title}</DialogTitle>
                  <DialogDescription>{open.project}</DialogDescription>
                </div>
                <Badge variant="muted">Placeholder</Badge>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
