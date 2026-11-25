import { SectionHead } from "@/components/section-head";
import { uk } from "@/content/uk";

export function Solutions() {
  const t = uk.solutions;
  return (
    <section id="solutions" className="border-t border-border py-20 sm:py-28">
      <div className="shell">
        <SectionHead index="02" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

        <ol className="mt-12 border-t border-border">
          {t.items.map((item, i) => (
            <li
              key={item.title}
              className="grid gap-6 border-b border-border py-9 lg:grid-cols-[1.05fr_1.1fr_0.85fr] lg:gap-10 lg:py-11"
            >
              <div>
                <p className="label-mono text-signal" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")} / 04
                </p>
                <h3 className="mt-4 font-display text-xl leading-tight font-medium sm:text-[1.4rem]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.95rem] text-muted-foreground">{item.summary}</p>
              </div>

              <div>
                <p className="label-mono text-muted-foreground">{t.includesLabel}</p>
                <ul className="mt-4 space-y-2.5 text-[0.95rem]">
                  {item.includes.map((line) => (
                    <li key={line} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.55rem] size-1.5 shrink-0 bg-signal" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="label-mono text-muted-foreground">{t.integratesLabel}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {item.integrations.map((name) => (
                    <li
                      key={name}
                      className="border border-border px-2 py-1 font-mono text-xs text-muted-foreground"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
                <p className="label-mono mt-7 text-muted-foreground">{t.outcomeLabel}</p>
                <p className="mt-3 border-l-2 border-signal pl-4 text-[0.95rem]">
                  {item.outcome}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
