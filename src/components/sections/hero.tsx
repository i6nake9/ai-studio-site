import { ctaPrimary, linkAccent } from "@/components/cta";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { LeadButton } from "@/components/lead/lead-button";
import { uk } from "@/content/uk";

export function Hero() {
  const t = uk.hero;
  const list = t.checklist;
  return (
    <section className="pt-10 pb-9 sm:pt-14 sm:pb-12 lg:pt-[4.25rem]">
      <div className="shell grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-5 text-[2rem] leading-[1.06] font-bold tracking-[-0.03em] sm:text-[2.75rem] lg:text-[3.25rem]">
            {t.title}
          </h1>
          <p className="mt-5 max-w-[36rem] text-[1.0625rem] text-muted-foreground sm:text-[1.1875rem]">
            {t.subtitle}
          </p>
          <div className="mt-7 flex flex-col gap-x-6 gap-y-2 sm:flex-row sm:items-center">
            <LeadButton className={ctaPrimary}>
              {t.ctaPrimary}
              <ArrowIcon className="size-[1.125rem]" />
            </LeadButton>
            <a href="#calculator" className={`${linkAccent} justify-center`}>
              {t.ctaSecondary}
            </a>
          </div>
        </div>

        {/* The offer as a picture: a team to-do list with the routine ticked off. */}
        <div className="w-full max-w-[32.5rem] animate-rise rounded-[0.875rem] border border-border bg-card px-5 pt-5 pb-4 shadow-[0_24px_48px_-32px_rgb(15_26_21/0.35)] sm:px-[1.625rem] sm:pt-6 sm:pb-5 lg:justify-self-end">
          <div className="flex items-center justify-between gap-3 pb-3.5">
            <p className="font-bold">{list.title}</p>
            <p className="font-mono text-xs text-subtle">{list.tag}</p>
          </div>
          <ul>
            {list.items.map((item, i) => (
              <li
                key={item.task}
                className="flex items-center gap-3.5 border-t border-border/70 py-3"
              >
                <span
                  aria-hidden="true"
                  style={{ animationDelay: `${300 + i * 140}ms` }}
                  className="grid size-[1.375rem] shrink-0 animate-tick place-items-center rounded-md bg-primary text-primary-foreground"
                >
                  <CheckIcon className="size-3.5" />
                </span>
                <span className="min-w-0 flex-1 text-base leading-snug text-subtle line-through decoration-signal">
                  {item.task}
                </span>
                <span className="shrink-0 rounded-md bg-signal-soft px-2 py-1 font-mono text-[0.6875rem] text-signal">
                  {item.by}
                </span>
              </li>
            ))}
            <li className="flex items-center gap-3.5 border-t border-border/70 py-3">
              <span
                aria-hidden="true"
                className="size-[1.375rem] shrink-0 rounded-md border-2 border-foreground"
              />
              <span className="min-w-0 flex-1 text-base leading-snug font-semibold">
                {list.human.task}
              </span>
              <span className="shrink-0 rounded-md border border-foreground px-2 py-[0.1875rem] font-mono text-[0.6875rem]">
                {list.human.by}
              </span>
            </li>
          </ul>
          <p className="border-t border-border/70 pt-3.5 text-sm leading-snug text-subtle">
            {list.note}
          </p>
        </div>
      </div>
    </section>
  );
}
