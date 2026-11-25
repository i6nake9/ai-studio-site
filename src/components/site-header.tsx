import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { ctaCompact, ctaPrimary } from "@/components/cta";
import { LeadButton } from "@/components/lead/lead-button";
import { MobileMenu } from "@/components/mobile-menu";
import { uk } from "@/content/uk";
import { telegramNick, telegramUrl } from "@/lib/contacts";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  /** On the home page the menu scrolls; on other pages it leads back to the home page. */
  home?: boolean;
}

export function SiteHeader({ home = false }: SiteHeaderProps) {
  const t = uk.header;
  const links = t.nav.map((item) => ({
    label: item.label,
    href: home ? item.href : `/${item.href}`,
  }));

  return (
    <header className="z-40 border-b border-border bg-background lg:sticky lg:top-0">
      <div className="shell relative flex min-h-[4.25rem] items-center justify-between gap-4 lg:min-h-[4.75rem]">
        {home ? (
          <a href="#top" className="inline-flex min-h-11 items-center">
            <BrandMark />
          </a>
        ) : (
          <Link href="/" className="inline-flex min-h-11 items-center">
            <BrandMark />
          </Link>
        )}

        <nav aria-label={t.navLabel} className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.9375rem] font-medium text-muted-foreground">
            {links.map((item) => (
              <li key={item.href}>
                {home ? (
                  <a href={item.href} className="transition-colors hover:text-foreground">
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} className="transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-5">
          {telegramUrl ? (
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-11 items-center text-[0.9375rem] font-semibold text-signal hover:text-foreground sm:inline-flex"
            >
              {t.telegram}: @{telegramNick}
            </a>
          ) : null}
          {/* On phones the same action lives in the bar fixed to the bottom. */}
          <LeadButton className={cn(ctaPrimary, ctaCompact, "max-md:hidden")}>
            {t.cta}
          </LeadButton>

          <MobileMenu label={t.menu} navLabel={t.navLabel} links={links} home={home} />
        </div>
      </div>
    </header>
  );
}
