import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { ctaCompact, ctaPrimary } from "@/components/cta";
import { HeaderCta } from "@/components/lead/header-cta";
import { uk } from "@/content/uk";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  /** "home" shows section links; "plain" is for secondary pages. */
  variant?: "home" | "plain";
}

export function SiteHeader({ variant = "home" }: SiteHeaderProps) {
  const t = uk.header;
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between gap-4">
        {variant === "home" ? (
          <a href="#top" aria-label={t.homeLabel}>
            <BrandMark />
          </a>
        ) : (
          <Link href="/" aria-label={uk.privacy.back}>
            <BrandMark />
          </Link>
        )}

        {variant === "home" ? (
          <>
            <nav aria-label="Розділи сторінки" className="hidden lg:block">
              <ul className="flex items-center gap-7 text-sm text-muted-foreground">
                {t.nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <HeaderCta className={cn(ctaPrimary, ctaCompact)}>{t.cta}</HeaderCta>
          </>
        ) : (
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← {uk.privacy.back}
          </Link>
        )}
      </div>
    </header>
  );
}
