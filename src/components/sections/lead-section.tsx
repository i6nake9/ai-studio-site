import Link from "next/link";

import { LeadForm } from "@/components/lead/lead-form";
import { uk } from "@/content/uk";
import { telegramNick, telegramUrl } from "@/lib/contacts";

/** The closing block of every page: what happens next, and the form. */
export function LeadSection() {
  const t = uk.lead;
  return (
    <section id="lead" className="on-dark py-14 sm:py-[5.5rem]">
      <div className="shell grid items-start gap-x-16 gap-y-9 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="mt-5 text-[1.75rem] leading-[1.1] font-bold tracking-[-0.025em] sm:text-[2.6rem]">
            {t.title}
          </h2>
          <p className="mt-5 text-muted-foreground">{t.text}</p>
          <ol className="mt-7 space-y-3.5">
            {t.steps.map((step, i) => (
              <li key={step} className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className="grid size-[1.875rem] shrink-0 place-items-center rounded-full border border-signal font-display text-xs font-semibold text-signal"
                >
                  {i + 1}
                </span>
                <span className="pt-0.5 text-base leading-normal">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="w-full max-w-[32.5rem] rounded-[0.875rem] border border-border bg-card p-5 sm:p-8 lg:justify-self-end">
          <noscript>
            <p className="mb-5 rounded-lg border border-amber/60 p-4 text-[0.9375rem] leading-normal">
              {t.noScript}
            </p>
          </noscript>
          <LeadForm />
          {telegramUrl ? (
            <p className="mt-4 text-[0.9375rem] leading-normal">
              {t.telegramDirect}:{" "}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-signal underline underline-offset-4 hover:text-foreground"
              >
                @{telegramNick}
              </a>
            </p>
          ) : null}
          <p className="mt-4 text-sm leading-normal text-muted-foreground">
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
