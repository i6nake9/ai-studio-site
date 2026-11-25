import { expect, test } from "vitest";

import { siteConfig } from "../../site.config";
import { pageMeta } from "./page-meta";

const meta = pageMeta("/blog/a/", "Заголовок", "Опис сторінки.");

test("pageMeta sets the canonical address of the page", () => {
  expect(meta.alternates?.canonical).toBe(`${siteConfig.siteUrl}/blog/a/`);
});

// A page's own openGraph block replaces the site-wide one, so the picture and
// the site name have to be repeated on every page or link previews lose them.
test("pageMeta keeps the preview picture and the site name on every page", () => {
  expect(meta.openGraph).toMatchObject({
    type: "website",
    locale: "uk_UA",
    siteName: siteConfig.brand,
    title: "Заголовок",
    description: "Опис сторінки.",
    url: `${siteConfig.siteUrl}/blog/a/`,
    images: [{ url: `${siteConfig.siteUrl}/og.png`, width: 1200, height: 630, alt: "Заголовок" }],
  });
  expect(meta.twitter).toMatchObject({
    card: "summary_large_image",
    title: "Заголовок",
    images: [`${siteConfig.siteUrl}/og.png`],
  });
});
