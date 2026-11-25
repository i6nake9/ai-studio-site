import type { ReactNode } from "react";

import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";
import { ctaPrimary, linkAccent } from "@/components/cta";
import { ArrowIcon } from "@/components/icons";
import { LeadButton } from "@/components/lead/lead-button";
import { uk } from "@/content/uk";

interface PageHeroProps {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  intro: string;
  /** Card to the right of the heading; without it the text takes the full width. */
  aside?: ReactNode;
  /** Shows the link to the prices block of the same page. */
  pricesLink?: boolean;
}

/** First screen of every page except the home page. */
export function PageHero({ crumbs, eyebrow, title, intro, aside, pricesLink = false }: PageHeroProps) {
  const t = uk.servicePage;
  return (
    <section className="pt-6 pb-12 sm:pt-8 sm:pb-16">
      <div className="shell">
        <Breadcrumbs crumbs={crumbs} />
        <div
          className={
            aside
              ? "mt-5 grid items-start gap-x-16 gap-y-9 lg:mt-8 lg:grid-cols-[1.15fr_0.85fr]"
              : "mt-5 max-w-[50rem] lg:mt-8"
          }
        >
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-4 text-[1.875rem] leading-[1.08] font-bold tracking-[-0.03em] sm:text-[2.5rem] lg:text-[2.875rem]">
              {title}
            </h1>
            <p className="mt-5 max-w-[38rem] text-[1.0625rem] text-muted-foreground sm:text-[1.1875rem]">
              {intro}
            </p>
            <div className="mt-7 flex flex-col gap-x-6 gap-y-2 sm:flex-row sm:items-center">
              <LeadButton className={ctaPrimary}>
                {t.cta}
                <ArrowIcon className="size-[1.125rem]" />
              </LeadButton>
              {pricesLink ? (
                <a href="#prices" className={`${linkAccent} justify-center`}>
                  {t.pricesLink}
                </a>
              ) : null}
            </div>
          </div>
          {aside ? (
            <div className="rounded-[0.875rem] border border-border bg-card p-6 lg:mt-9">{aside}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** "Result" and "works with" card used by the service and task pages. */
export function OutcomeCard({ outcome, integrations }: { outcome: string; integrations: string[] }) {
  const labels = uk.solutions;
  return (
    <>
      <p className="label">{labels.outcomeLabel}</p>
      <p className="mt-2 text-[1.0625rem] leading-normal font-medium">{outcome}</p>
      <p className="label mt-5 border-t border-border pt-5">{labels.integratesLabel}</p>
      <ul className="mt-2.5 flex flex-wrap gap-1.5">
        {integrations.map((name) => (
          <li key={name} className="rounded-md bg-signal-soft px-2.5 py-1 text-sm font-medium text-signal">
            {name}
          </li>
        ))}
      </ul>
    </>
  );
}
