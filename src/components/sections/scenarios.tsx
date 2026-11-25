import { uk } from "@/content/uk";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function Scenarios() {
  const t = uk.scenarios;
  return (
    <section id="scenarios" className="band">
      <div className="shell">
        <div className="max-w-[47.5rem]">
          <h2 className="h2">{t.title}</h2>
          <p className="mt-2.5 text-muted-foreground">{t.note}</p>
        </div>

        <ul className="mt-8 grid gap-4 lg:grid-cols-3">
          {t.items.map((item) => (
            <li
              key={item.niche}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
            >
              <h3 className="text-[1.3125rem] leading-tight font-bold">{item.niche}</h3>
              <div>
                <p className="label">{t.nowLabel}</p>
                <p className="mt-1 text-[0.96875rem] leading-normal text-muted-foreground">
                  {item.now}
                </p>
              </div>
              <div>
                <p className="label">{t.whatLabel}</p>
                <p className="mt-1 text-[0.96875rem] leading-normal">{item.what}</p>
              </div>
              <div className="mt-auto rounded-[0.625rem] bg-signal-soft px-4 py-3.5">
                <p className="label !text-signal">{t.givesLabel}</p>
                <p className="mt-1 text-[0.96875rem] leading-normal">{item.gives}</p>
              </div>
            </li>
          ))}
        </ul>

        {t.videos.length > 0 ? (
          <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {t.videos.map((video) => (
              <li key={video.src} className="overflow-hidden rounded-xl border border-border bg-card">
                <video
                  controls
                  preload="none"
                  playsInline
                  className="aspect-video w-full bg-foreground"
                  src={`${basePath}${video.src}`}
                  aria-label={video.title}
                />
                <p className="px-4 py-3 text-sm">{video.title}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
