import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { uk } from "@/content/uk";
import { telegramUrl } from "@/lib/contacts";

import { siteConfig } from "../../site.config";

export function SiteFooter() {
  const t = uk.footer;
  return (
    <footer className="mt-auto border-t border-border">
      <div className="shell flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <BrandMark />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{t.tagline}</p>
        </div>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {telegramUrl ? (
            <li>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center hover:text-foreground"
              >
                {t.telegram}
              </a>
            </li>
          ) : null}
          <li>
            <Link
              href="/privacy/"
              className="inline-flex min-h-11 items-center hover:text-foreground"
            >
              {t.privacy}
            </Link>
          </li>
          <li className="label-mono text-muted-foreground/80">
            © 2026 {siteConfig.brand}
          </li>
        </ul>
      </div>
    </footer>
  );
}
