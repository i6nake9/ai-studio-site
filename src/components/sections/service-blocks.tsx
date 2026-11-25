import Link from "next/link";

import { linkAccent } from "@/components/cta";
import { CheckIcon } from "@/components/icons";
import { FaqList } from "@/components/sections/faq";
import { PriceCards } from "@/components/sections/process";
import { uk } from "@/content/uk";

/** "What is included" next to "who it suits". */
export function IncludesAndFits({ includes, fits }: { includes: string[]; fits: string[] }) {
  const t = uk.servicePage;
  return (
    <section className="band border-y border-border bg-card">
      <div className="shell grid gap-x-16 gap-y-10 lg:grid-cols-2">
        <div>
          <h2 className="h2">{t.includesTitle}</h2>
          <ul className="mt-6 space-y-3.5">
            {includes.map((line) => (
              <li key={line} className="flex gap-3">
                <CheckIcon className="mt-1.5 size-4 shrink-0 text-signal" />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="h2">{t.fitsTitle}</h2>
          <ul className="mt-6">
            {fits.map((line) => (
              <li key={line} className="border-t border-border-strong py-3.5 last:border-b">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** The four price cards; the hero's "how much" link scrolls here. */
export function PricesBand({ plain = false }: { plain?: boolean }) {
  const t = uk.servicePage;
  return (
    <section id="prices" className={plain ? "band" : "band border-y border-border bg-card"}>
      <div className="shell">
        <h2 className="h2">{t.pricesTitle}</h2>
        <p className="mt-2.5 text-muted-foreground">{t.pricesLead}</p>
        <div className="mt-8">
          <PriceCards />
        </div>
        <Link href="/ciny/" className={`${linkAccent} mt-4`}>
          {t.pricesMore} →
        </Link>
      </div>
    </section>
  );
}

interface FaqBandProps {
  title: string;
  name: string;
  items: { question: string; answer: string[] }[];
}

export function FaqBand({ title, name, items }: FaqBandProps) {
  return (
    <section className="band">
      <div className="shell grid gap-x-16 gap-y-7 lg:grid-cols-[0.8fr_1.2fr]">
        <h2 className="h2">{title}</h2>
        <FaqList name={name} items={items} />
      </div>
    </section>
  );
}
