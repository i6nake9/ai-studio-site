import { ctaCompact, ctaSecondary } from "@/components/cta";
import { LeadButton } from "@/components/lead/lead-button";
import { uk } from "@/content/uk";
import { telegramUrl } from "@/lib/contacts";
import { cn } from "@/lib/utils";

import { siteConfig } from "../../../site.config";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Proof from our own systems, and the person the client will talk to. */
export function OwnProjects() {
  const t = uk.ownProjects;
  const f = uk.founder;
  const { name, photo } = siteConfig.founder;
  const button = cn(ctaSecondary, ctaCompact, "mt-1 min-h-12 w-full");

  return (
    <section className="band border-y border-border bg-card">
      <div className="shell">
        <div className="max-w-[47.5rem]">
          <h2 className="h2">{t.title}</h2>
          <p className="mt-2.5 text-muted-foreground">{t.lead}</p>
        </div>

        <div className="mt-8 grid gap-x-8 gap-y-6 lg:grid-cols-[2fr_1fr]">
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {t.items.map((item) => (
              <li key={item.title} className="border-t border-border-strong py-5">
                <p className="flex items-center gap-2 font-mono text-xs text-signal">
                  <span aria-hidden="true" className="size-2 rounded-full bg-[#1fbf6f]" />
                  {t.status}
                </p>
                <h3 className="mt-2 text-lg leading-snug font-bold">{item.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-[1.55] text-muted-foreground">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>

          <aside className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6 lg:self-start">
            {name ? (
              <div className="flex items-center gap-4">
                {photo ? (
                  // A plain <img>: the site is a static export without the image optimizer.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`${basePath}/${photo}`}
                    alt={f.photoAlt}
                    width={84}
                    height={84}
                    loading="lazy"
                    className="size-[5.25rem] shrink-0 rounded-full object-cover"
                  />
                ) : null}
                <div>
                  <p className="text-[1.1875rem] leading-tight font-bold">{name}</p>
                  <p className="mt-0.5 text-[0.90625rem] text-muted-foreground">{f.role}</p>
                </div>
              </div>
            ) : (
              <p className="label">{f.label}</p>
            )}
            <p className="text-[0.96875rem] leading-[1.55]">{f.text}</p>
            {telegramUrl ? (
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className={button}>
                {f.telegramCta}
              </a>
            ) : (
              <LeadButton className={button}>{f.auditCta}</LeadButton>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
