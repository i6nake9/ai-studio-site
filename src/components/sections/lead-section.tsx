import Link from "next/link";

import { ctaSecondary } from "@/components/cta";
import { LeadForm } from "@/components/lead/lead-form";
import { uk } from "@/content/uk";
import { telegramUrl } from "@/lib/contacts";

export function LeadSection() {
  const t = uk.lead;
  return (
    <section id="lead" className="relative overflow-hidden border-t border-border py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-72 left-[-15%] size-[50rem] bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--signal)_12%,transparent),transparent)]"
      />
      <div className="shell relative grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
        <div>
          <p className="label-mono flex items-center gap-3 text-signal">
            <span aria-hidden="true">08</span>
            <span aria-hidden="true" className="h-px w-8 bg-signal/50" />
            {t.eyebrow}
          </p>
          <h2 className="mt-5 font-display text-[1.6rem] leading-[1.15] font-medium sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">{t.text}</p>

          {telegramUrl ? (
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${ctaSecondary} mt-8`}
            >
              {t.telegramDirect}
            </a>
          ) : null}
        </div>

        <div className="relative border border-input bg-card/80 p-6 sm:p-8">
          <span aria-hidden="true" className="absolute -top-px -left-px size-3 border-t-2 border-l-2 border-signal" />
          <span aria-hidden="true" className="absolute -right-px -bottom-px size-3 border-r-2 border-b-2 border-signal" />
          <LeadForm />
          <p className="mt-5 text-sm text-muted-foreground">
            {t.privacyNote}{" "}
            <Link href="/privacy/" className="underline underline-offset-4 hover:text-foreground">
              {t.privacyLink}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
