import type { MetadataRoute } from "next";

import { industries } from "@/content/industries";
import { tasks } from "@/content/tasks";
import { uk } from "@/content/uk";
import { pageUrl } from "@/lib/seo";

import { siteConfig } from "../../site.config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const { siteUrl } = siteConfig;
  const page = (path: string, priority: number) => ({
    url: pageUrl(siteUrl, path),
    changeFrequency: "monthly" as const,
    priority,
  });
  return [
    page("/", 1),
    page("/poslugy/", 0.9),
    ...uk.solutions.items.map((item) => page(`/poslugy/${item.slug}/`, 0.8)),
    ...tasks.map((task) => page(`/poslugy/${task.slug}/`, 0.8)),
    page("/galuzi/", 0.7),
    ...industries.map((item) => page(`/galuzi/${item.slug}/`, 0.7)),
    { url: pageUrl(siteUrl, "/privacy/"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
