"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PILL_GLASS } from "@/lib/glass";
import { cn } from "@/lib/utils";
import { PROJECTS } from "@/lib/site";
import { useActiveProject } from "@/hooks/use-active-project";
import { TextLink } from "@/components/ui/text-link";
import { usePageCurtain } from "@/components/site/page-curtain-provider";
import { saveHomeScroll } from "@/lib/home-scroll";

/**
 * Floating "View project" pill at bottom-center of the viewport. Appears when
 * the user is scrolling through a project article (Yuno / Rappi / Kontigo) and
 * links to that project's detail page. Hidden when no project is in view.
 *
 * Uses the shared liquid-glass recipe + the nav-variant TextLink (same as the
 * Resume link in the navbar) for consistency.
 */
export function ActiveProjectPill() {
  const slug = useActiveProject();
  const reduced = useReducedMotion();
  const project = slug ? PROJECTS.find((p) => p.slug === slug) : null;
  const visible = !!project;
  const { navigate } = usePageCurtain();

  const href = project ? `/work/${project.slug}` : "#";

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-out-expo lg:bottom-14",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-0",
      )}
      aria-hidden={!visible}
    >
      <AnimatePresence mode="wait" initial={false}>
      {project && <motion.div
        key={project.slug}
        className={cn(PILL_GLASS, "relative overflow-hidden")}
        style={{ height: 44 }}
        initial={{ width: reduced ? 260 : 44, opacity: 0 }}
        animate={{ width: 260, opacity: 1 }}
        exit={{ width: reduced ? 260 : 44, opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1], opacity: { duration: reduced ? 0 : 0.25 } }}
      >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.2, delay: reduced ? 0 : 0.15 }} className="absolute left-1/2 top-0 -translate-x-1/2 w-[260px]">
      <TextLink
        roll
        variant="nav"
        href={href}
        tabIndex={visible ? undefined : -1}
        onClick={(e) => {
          if (!project || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          // Remember the home scroll position so BackToWork can restore it.
          saveHomeScroll(window.scrollY);
          navigate(href);
        }}
        trailingIcon={<ArrowUpRight weight="light" className="size-4" />}
        className="flex h-11 w-full justify-center whitespace-nowrap px-5 py-2.5"
      >
        {`View ${project?.name ?? "project"} case study`}
      </TextLink>
      </motion.div>
      </motion.div>}
      </AnimatePresence>
    </div>
  );
}
