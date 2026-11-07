import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { IndustryExplorer } from "@/components/sections/industry-explorer";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = {
  title: "Industries",
  description: "How the proposed cleaning approach adapts for offices, salons, retail, property managers and clinics.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Every sector cleans differently"
        intro="A salon after closing has different needs from a dental reception or an apartment stairwell. Choose a sector to see how the approach would adapt."
      />
      <IndustryExplorer />
      <CtaBanner title="Not sure which category you fit?" body="Choose “Other” in the estimator and describe your premises. Every quote would be tailored after a premises assessment." />
    </>
  );
}
