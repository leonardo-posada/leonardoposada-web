import { MOCKUP_CATALOG, type MockupId } from "@/lib/mockup-catalog";

/** Review names appear locally; production only displays editorial captions. */
export function MockupCaption({ id, caption }: { id: MockupId; caption?: string }) {
  const review = process.env.NODE_ENV === "development";
  if (!review && !caption) return null;
  return (
    <figcaption className="mt-3 flex flex-col gap-2 text-muted-foreground">
      {review && <span data-mockup-label={id} className="text-xs tracking-wide">{MOCKUP_CATALOG[id].label}</span>}
      {caption && <span className="text-sm font-light">{caption}</span>}
    </figcaption>
  );
}
