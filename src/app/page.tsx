import { Hero } from "@/components/sections/hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FrequencyComparison } from "@/components/sections/frequency-comparison";
import { ServiceArea } from "@/components/sections/service-area";
import { Faq } from "@/components/sections/faq";
import { CtaBanner } from "@/components/sections/cta-banner";
import { SectorStrip } from "@/components/sections/sector-strip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SectorStrip />
      <ServicesGrid />
      <WhyChooseUs />
      <HowItWorks />
      <FrequencyComparison />
      <ServiceArea />
      <Faq />
      <CtaBanner />
    </>
  );
}
