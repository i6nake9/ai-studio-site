import { CheckIcon, PlusIcon } from "@/components/icons";
import { LeadButton } from "@/components/lead/lead-button";
import { uk } from "@/content/uk";

interface FaqListProps {
  /** Groups the questions so that only one is open at a time. */
  name: string;
  items: { question: string; answer: string[]; list?: string[] }[];
}

/** Questions as native disclosures: they work without scripts. */
export function FaqList({ name, items }: FaqListProps) {
  return (
    <div className="border-b border-border-strong">
      {items.map((item) => (
        <details key={item.question} name={name} className="group border-t border-border-strong py-1.5">
          <summary className="flex min-h-14 items-center justify-between gap-4 text-lg leading-snug font-semibold hover:text-signal">
            <h3>{item.question}</h3>
            <PlusIcon className="size-[1.125rem] shrink-0 text-signal transition-transform duration-200 group-open:rotate-45" />
          </summary>
          <div className="space-y-2.5 pr-8 pb-4 text-base leading-[1.6] text-muted-foreground">
            {item.answer.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {item.list ? (
              <ul className="space-y-1.5 pt-1 text-foreground">
                {item.list.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <CheckIcon className="mt-1.5 size-4 shrink-0 text-signal" />
                    {line}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}

export function Faq() {
  const t = uk.faq;
  return (
    <section id="faq" className="band border-t border-border bg-card">
      <div className="shell grid gap-x-16 gap-y-7 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="h2">{t.title}</h2>
          <p className="mt-3.5 text-muted-foreground">
            {t.lead}{" "}
            <LeadButton className="font-semibold text-signal underline underline-offset-4 hover:text-foreground">
              {t.leadCta}
            </LeadButton>
          </p>
        </div>
        <FaqList name="faq" items={t.items} />
      </div>
    </section>
  );
}
