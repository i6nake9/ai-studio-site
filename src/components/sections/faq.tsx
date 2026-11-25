import { SectionHead } from "@/components/section-head";
import { uk } from "@/content/uk";

export function Faq() {
  const t = uk.faq;
  return (
    <section id="faq" className="border-t border-border py-20 sm:py-28">
      <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHead index="07" eyebrow={t.eyebrow} title={t.title} className="lg:sticky lg:top-28 lg:self-start" />

        <div className="border-t border-border">
          {t.items.map((item) => (
            // Native disclosure: works without JavaScript; `name` keeps one open.
            <details key={item.question} name="faq" className="group border-b border-border">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-lg leading-snug font-semibold marker:hidden hover:text-signal [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className="mt-1 font-mono text-xl leading-none font-normal text-signal transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="space-y-3 pr-10 pb-7 text-muted-foreground">
                {item.answer.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {item.list ? (
                  <ul className="space-y-2 pt-1 text-foreground">
                    {item.list.map((line) => (
                      <li key={line} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.6rem] size-1.5 shrink-0 bg-signal" />
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
