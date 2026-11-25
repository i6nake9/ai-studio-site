import { uk } from "@/content/uk";

export function Pains() {
  const t = uk.pains;
  return (
    <section className="band border-y border-border bg-card">
      <div className="shell">
        <h2 className="h2">{t.title}</h2>
        <ul className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((item) => (
            <li key={item.title} className="border-t-2 border-foreground pt-[1.125rem]">
              <h3 className="text-[1.1875rem] leading-tight font-bold">{item.title}</h3>
              <p className="mt-2.5 text-[0.96875rem] leading-[1.55] text-muted-foreground">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
