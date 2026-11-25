import type { MetadataRoute } from "next";

import { siteConfig } from "../../site.config";

export const dynamic = "force-static";

/**
 * Crawling is always allowed. While the site is hidden from search, that is
 * done by the `noindex` tag on every page: a crawler has to be able to read
 * the page to see the tag.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(siteConfig.noindex
      ? {}
      : { sitemap: `${siteConfig.siteUrl}/sitemap.xml` }),
  };
}
