import { siteConfig } from "../../site.config";

/** Wordmark: a small "signal" square and the brand name. */
export function BrandMark() {
  return (
    <span className="inline-flex items-center gap-2.5 font-display text-base font-bold tracking-tight">
      <span aria-hidden="true" className="size-2.5 bg-signal" />
      {siteConfig.brand}
    </span>
  );
}
