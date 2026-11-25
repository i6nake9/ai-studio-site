import { llmsText } from "@/lib/llms";

import { siteConfig } from "../../../site.config";

export const dynamic = "force-static";

/** /llms.txt: a plain-text map of the site for AI assistants. */
export function GET() {
  return new Response(llmsText(siteConfig.siteUrl), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
