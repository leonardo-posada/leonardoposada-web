import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";
import { PROJECTS } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/shots`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...PROJECTS.map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
