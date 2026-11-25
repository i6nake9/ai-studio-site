import { Comparison } from "@/components/sections/comparison";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Pains } from "@/components/sections/pains";
import { Process } from "@/components/sections/process";
import { RoiCalculator } from "@/components/sections/roi-calculator";
import { Scenarios } from "@/components/sections/scenarios";
import { Solutions } from "@/components/sections/solutions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <Hero />
        <Pains />
        <Solutions />
        <RoiCalculator />
        <Scenarios />
        <Comparison />
        <Process />
        <Faq />
        <div id="lead" />
      </main>
      <SiteFooter />
    </>
  );
}
