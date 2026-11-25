import Link from "next/link";

import { linkAccent } from "@/components/cta";
import { uk } from "@/content/uk";
import { cn } from "@/lib/utils";

/** The five steps of a project, as a numbered list. */
export function ProcessSteps() {
  return (
    <ol className="grid gap-x-7 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
      {uk.process.steps.map((step, i) => (
        <li key={step.title}>
          <p aria-hidden="true" className="font-display text-[0.9375rem] font-semibold text-signal">
            {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 leading-snug font-bold">{step.title}</h3>
          <p className="mt-2 text-[0.90625rem] leading-normal text-muted-foreground">
            {step.text}
          </p>
        </li>
      ))}
    </ol>
  );
}

/** Four price cards; the recommended first step is the dark one. */
export function PriceCards() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {uk.prices.items.map((item) => (
        <li
          key={item.title}
          className={cn(
            "rounded-xl border p-[1.375rem]",
            item.badge ? "on-dark border-background" : "border-border bg-background",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="leading-snug font-bold">{item.title}</h3>
            {item.badge ? (
              <span className="rounded-md bg-primary px-2 py-0.5 text-[0.78125rem] font-semibold text-primary-foreground">
                {item.badge}
              </span>
            ) : null}
          </div>
          <p
            className={cn(
              "mt-2 font-display text-[1.6875rem] leading-tight font-semibold tracking-[-0.02em]",
              item.badge && "text-signal",
            )}
          >
            {item.price}
          </p>
          <p className="mt-2 text-[0.90625rem] leading-normal text-muted-foreground">
            {item.text}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function Process() {
  const t = uk.process;
  return (
    <section id="prices" className="band border-y border-border bg-card">
      <div className="shell">
        <div className="max-w-[47.5rem]">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mt-2.5">{t.title}</h2>
        </div>
        <div className="mt-9">
          <ProcessSteps />
        </div>
        <h3 className="sr-only">{uk.prices.title}</h3>
        <div className="mt-9">
          <PriceCards />
        </div>
        <Link href="/ciny/" className={`${linkAccent} mt-4`}>
          {uk.servicePage.pricesMore} →
        </Link>
      </div>
    </section>
  );
}
