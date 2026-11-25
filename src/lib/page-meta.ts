import type { Metadata } from "next";

import { siteConfig } from "../../site.config";
import { pageUrl } from "./seo";

/**
 * Title, description, canonical address and link-preview texts of one page.
 *
 * A page's own `openGraph` and `twitter` blocks replace the ones from the
 * root layout instead of adding to them, so the picture, the site name and
 * the card type are repeated here.
 */
export function pageMeta(path: string, title: string, description: string): Metadata {
  const url = pageUrl(siteConfig.siteUrl, path);
  const image = `${siteConfig.siteUrl}/og.png`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "uk_UA",
      siteName: siteConfig.brand,
      title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
