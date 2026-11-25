import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { catalogText } from "@/content/catalog";
import { industries } from "@/content/industries";
import { uk } from "@/content/uk";
import { telegramNick, telegramUrl } from "@/lib/contacts";
import { navHref } from "@/lib/nav";

import { siteConfig } from "../../site.config";

const linkClass =
  "inline-flex min-h-9 items-center text-muted-foreground hover:text-foreground";

export function SiteFooter() {
  const t = uk.footer;
  const email = siteConfig.email.trim();
  return (
    // Bottom padding on phones leaves room for the bar fixed to the screen edge.
    <footer className="on-dark mt-auto border-t border-border pt-10 pb-28 text-[0.9375rem] leading-normal md:pb-8">
      <div className="shell">
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_1.2fr_1fr_1fr]">
          <div>
            <BrandMark />
            <p className="mt-3 max-w-xs text-muted-foreground">{t.tagline}</p>
          </div>

          <nav aria-label={t.servicesTitle}>
            <p className="label !text-foreground">{t.servicesTitle}</p>
            <ul className="mt-2">
              {uk.solutions.items.map((item) => (
                <li key={item.slug}>
                  <Link href={`/poslugy/${item.slug}/`} className={linkClass}>
                    {item.short}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/poslugy/" className={`${linkClass} font-semibold !text-signal`}>
                  {catalogText.footer.allServices} →
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label={catalogText.footer.industriesTitle}>
            <p className="label !text-foreground">{catalogText.footer.industriesTitle}</p>
            <ul className="mt-2">
              {industries.map((item) => (
                <li key={item.slug}>
                  <Link href={`/galuzi/${item.slug}/`} className={linkClass}>
                    {item.short}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.studioTitle}>
            <p className="label !text-foreground">{t.studioTitle}</p>
            <ul className="mt-2">
              {t.studioLinks.map((item) => (
                <li key={item.href}>
                  <Link href={navHref(item.href, false)} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacy/" className={linkClass}>
                  {t.privacy}
                </Link>
              </li>
            </ul>
          </nav>

          {telegramUrl || email ? (
            <div>
              <p className="label !text-foreground">{t.contactsTitle}</p>
              <ul className="mt-2">
                {telegramUrl ? (
                  <li>
                    <a
                      href={telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center font-semibold text-signal hover:text-foreground"
                    >
                      {t.telegram} @{telegramNick}
                    </a>
                  </li>
                ) : null}
                {email ? (
                  <li>
                    <a href={`mailto:${email}`} className={linkClass}>
                      {email}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>

        <p className="mt-8 border-t border-border pt-5 text-sm text-muted-foreground">
          © 2026 {siteConfig.brand}
        </p>
      </div>
    </footer>
  );
}
