import { uk } from "@/content/uk";

/** Four short facts that answer the first doubts: price of the first step, time, risk. */
export function Trust() {
  const t = uk.trust;
  return (
    <section aria-label={t.label} className="pb-10 sm:pb-16">
      <div className="shell">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6 lg:grid-cols-4 lg:gap-x-8">
          {t.items.map((item) => (
            <li key={item.title}>
              <p className="leading-snug font-bold">{item.title}</p>
              <p className="mt-1 text-[0.9375rem] leading-snug text-muted-foreground">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
