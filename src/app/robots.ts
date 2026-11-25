import type { MetadataRoute } from "next";

import { siteConfig } from "../../site.config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (siteConfig.noindex) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
