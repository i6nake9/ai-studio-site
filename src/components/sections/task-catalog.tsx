import Link from "next/link";

import { linkAccent } from "@/components/cta";
import { catalogText } from "@/content/catalog";
import { industries } from "@/content/industries";
import { tasks } from "@/content/tasks";

/** Home page: every task page and every industry page, as two compact lists. */
export function TaskCatalog() {
  const t = catalogText.home;
  return (
    <section id="tasks" className="band border-y border-border bg-card">
      <div className="shell">
        <div className="max-w-[47.5rem]">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mt-2.5">{t.title}</h2>
          <p className="mt-2.5 text-muted-foreground">{t.lead}</p>
        </div>

        <ul className="mt-8 grid gap-x-10 border-b border-border-strong sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <li key={task.slug} className="border-t border-border-strong">
              <Link href={`/poslugy/${task.slug}/`} className="group block py-4">
                <span className="leading-snug font-bold group-hover:text-signal">
                  {task.short} <span aria-hidden="true" className="text-signal">→</span>
                </span>
                <span className="mt-1 block text-[0.90625rem] leading-normal text-muted-foreground">
                  {task.card}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/poslugy/" className={`${linkAccent} mt-3`}>
          {t.all} →
        </Link>

        <h3 className="mt-10 text-[1.4375rem] leading-tight font-bold tracking-[-0.015em]">
          {t.industriesTitle}
        </h3>
        <p className="mt-2 max-w-[47.5rem] text-muted-foreground">{t.industriesLead}</p>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {industries.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/galuzi/${item.slug}/`}
                className="inline-flex min-h-11 items-center rounded-lg border border-border-strong bg-background px-4 font-semibold hover:border-signal hover:text-signal"
              >
                {item.short}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
