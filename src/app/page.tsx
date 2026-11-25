import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { uk } from "@/content/uk";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <h1 className="shell py-20 font-display text-3xl">{uk.hero.title}</h1>
      </main>
      <SiteFooter />
    </>
  );
}
