import Link from "next/link";

import { CheckIcon } from "@/components/icons";
import { uk } from "@/content/uk";

export function Solutions() {
  const t = uk.solutions;
  return (
    <section id="services" className="band">
      <div className="shell">
        <div className="max-w-[47.5rem]">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mt-2.5">{t.title}</h2>
          <p className="mt-2.5 text-muted-foreground">{t.lead}</p>
        </div>

        <div className="mt-8 border-b border-border-strong">
          {t.items.map((item, i) => (
            <article
              key={item.slug}
              className="grid gap-x-10 gap-y-6 border-t border-border-strong py-7 lg:grid-cols-3"
            >
              <div>
                {i === 0 ? (
                  <p className="mb-3 inline-block rounded-md bg-signal-soft px-2.5 py-1 text-[0.8125rem] leading-snug font-semibold text-signal">
                    {t.showcaseBadge}
                  </p>
                ) : null}
                <h3 className="text-[1.4375rem] leading-tight font-bold tracking-[-0.015em]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.96875rem] leading-[1.55] text-muted-foreground">
                  {item.summary}
                </p>
                <Link
                  href={`/poslugy/${item.slug}/`}
                  className="mt-2 inline-flex min-h-11 items-center text-[0.96875rem] font-semibold text-signal underline underline-offset-4 hover:text-foreground"
                >
                  {item.more} →
                </Link>
              </div>

              <ul aria-label={t.includesLabel} className="space-y-2.5 text-[0.96875rem] leading-snug">
                {item.includes.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <CheckIcon className="mt-1 size-4 shrink-0 text-signal" />
                    {line}
                  </li>
                ))}
              </ul>

              <div>
                <div className="rounded-[0.625rem] border border-border bg-card px-[1.125rem] py-4">
                  <p className="label">{t.outcomeLabel}</p>
                  <p className="mt-1.5 text-[0.96875rem] leading-normal">{item.outcome}</p>
                </div>
                <p className="mt-3.5 text-sm leading-normal text-subtle">
                  {t.integratesLabel}: {item.integrations.join(", ")}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
