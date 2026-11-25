import { uk } from "@/content/uk";

import { siteConfig } from "../../site.config";

/** The logo as text: the first syllable in the accent colour. */
export function BrandMark() {
  const { accent, rest } = uk.wordmark;
  return (
    <span className="inline-flex items-baseline font-display text-xl leading-none font-semibold tracking-[-0.02em]">
      <span className="sr-only">{siteConfig.brand}</span>
      <span aria-hidden="true" className="text-signal">
        {accent}
      </span>
      <span aria-hidden="true">{rest}</span>
    </span>
  );
}
