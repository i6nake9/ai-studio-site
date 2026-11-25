import { ctaPrimary, ctaSecondary } from "@/components/cta";
import { LeadButton } from "@/components/lead/lead-button";
import { uk } from "@/content/uk";

import { PipelineDiagram } from "./pipeline-diagram";

export function Hero() {
  const t = uk.hero;
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="grid-paper pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-56 right-[-15%] size-[52rem] bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--signal)_13%,transparent),transparent)]"
      />

      <div className="shell relative grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-14 lg:py-28">
        <div>
          <p className="label-mono inline-flex max-w-full animate-settle items-center gap-2.5 border border-border bg-card/60 px-3 py-2 leading-relaxed text-muted-foreground">
            <span aria-hidden="true" className="size-1.5 shrink-0 bg-signal" />
            {t.badge}
          </p>

          <h1 className="mt-7 animate-settle font-display text-[1.75rem] leading-[1.12] font-medium tracking-tight sm:text-[2.6rem] lg:text-[3.1rem]">
            {t.title}
          </h1>

          <p className="mt-6 max-w-xl animate-settle text-base text-muted-foreground sm:text-lg">
            {t.subtitle}
          </p>

          <div className="mt-9 flex animate-rise flex-col gap-3 [animation-delay:120ms] sm:flex-row">
            <LeadButton className={ctaPrimary}>{t.ctaPrimary}</LeadButton>
            <a href="#calculator" className={ctaSecondary}>
              {t.ctaSecondary}
            </a>
          </div>
        </div>

        <div className="animate-rise [animation-delay:220ms]">
          <PipelineDiagram />
        </div>
      </div>
    </section>
  );
}
