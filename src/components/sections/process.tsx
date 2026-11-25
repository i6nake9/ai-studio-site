import { SectionHead } from "@/components/section-head";
import { uk } from "@/content/uk";

export function Process() {
  const t = uk.process;
  return (
    <section id="process" className="border-t border-border py-20 sm:py-28">
      <div className="shell">
        <SectionHead index="06" eyebrow={t.eyebrow} title={t.title} />

        <ol className="mt-12 grid gap-y-8 lg:grid-cols-5 lg:gap-x-6">
          {t.steps.map((step, i) => (
            <li
              key={step.title}
              className="relative border-l border-input pl-6 lg:border-t lg:border-l-0 lg:pt-7 lg:pl-0"
            >
              <span
                aria-hidden="true"
                className="absolute top-1 -left-[0.3125rem] size-2.5 bg-signal lg:-top-[0.3125rem] lg:left-0"
              />
              <p className="label-mono text-signal" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 leading-snug font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
