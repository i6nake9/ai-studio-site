import type { MetadataRoute } from "next";

import { uk } from "@/content/uk";
import { pageUrl } from "@/lib/seo";

import { siteConfig } from "../../site.config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const { siteUrl } = siteConfig;
  return [
    { url: pageUrl(siteUrl, "/"), changeFrequency: "monthly", priority: 1 },
    ...uk.solutions.items.map((item) => ({
      url: pageUrl(siteUrl, `/poslugy/${item.slug}/`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: pageUrl(siteUrl, "/privacy/"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
