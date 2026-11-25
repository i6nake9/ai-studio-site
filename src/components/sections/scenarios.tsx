import { SectionHead } from "@/components/section-head";
import { uk } from "@/content/uk";

export function Scenarios() {
  const t = uk.scenarios;
  const own = uk.ownProjects;
  return (
    <section id="scenarios" className="border-t border-border py-20 sm:py-28">
      <div className="shell">
        <SectionHead index="04" eyebrow={t.eyebrow} title={t.title} lead={t.note} />

        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {t.items.map((item) => (
            <li key={item.niche} className="flex flex-col border border-border bg-card/50">
              <h3 className="border-b border-border px-6 py-5 font-display text-lg leading-tight font-medium">
                {item.niche}
              </h3>
              <dl className="flex flex-1 flex-col gap-6 p-6 text-[0.95rem]">
                <div>
                  <dt className="label-mono text-amber">{t.nowLabel}</dt>
                  <dd className="mt-2.5 text-muted-foreground">{item.now}</dd>
                </div>
                <div>
                  <dt className="label-mono text-muted-foreground">{t.whatLabel}</dt>
                  <dd className="mt-2.5">{item.what}</dd>
                </div>
                <div className="mt-auto border-t border-border pt-5">
                  <dt className="label-mono text-signal">{t.givesLabel}</dt>
                  <dd className="mt-2.5">{item.gives}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>

        {t.videos.length > 0 ? (
          <ul className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {t.videos.map((video) => (
              <li key={video.src} className="border border-border bg-card/50">
                <video
                  controls
                  preload="none"
                  playsInline
                  className="aspect-video w-full bg-background"
                  src={video.src}
                  aria-label={video.title}
                />
                <p className="px-4 py-3 text-sm">{video.title}</p>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-14 border border-border">
          <div className="border-b border-border px-6 py-6 sm:px-8">
            <h3 className="font-display text-xl leading-tight font-medium">{own.title}</h3>
            <p className="mt-2 text-muted-foreground">{own.lead}</p>
          </div>
          <ul className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {own.items.map((item) => (
              <li key={item.title} className="bg-background p-6 sm:px-8">
                <p className="flex items-center gap-2.5 label-mono text-signal">
                  <span aria-hidden="true" className="size-1.5 bg-signal" />
                  {own.status}
                </p>
                <h4 className="mt-4 leading-snug font-semibold">{item.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
