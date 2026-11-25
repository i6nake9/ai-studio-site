import { SectionHead } from "@/components/section-head";
import { uk } from "@/content/uk";

export function Pains() {
  const t = uk.pains;
  return (
    <section className="border-t border-border py-20 sm:py-28">
      <div className="shell">
        <SectionHead index="01" eyebrow={t.eyebrow} title={t.title} />
        <ul className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((item, i) => (
            <li key={item.title} className="bg-background p-6 sm:p-7">
              <p className="label-mono text-amber">
                <span aria-hidden="true">× </span>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-5 text-lg leading-snug font-semibold">{item.title}</h3>
              <p className="mt-3 text-[0.95rem] text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
