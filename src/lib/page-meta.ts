import type { Metadata } from "next";

import { siteConfig } from "../../site.config";
import { pageUrl } from "./seo";

/** Title, description, canonical address and link-preview texts of one page. */
export function pageMeta(path: string, title: string, description: string): Metadata {
  const url = pageUrl(siteConfig.siteUrl, path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    twitter: { title, description },
  };
}
