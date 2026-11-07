import type { Metadata } from "next";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FrequencyComparison } from "@/components/sections/frequency-comparison";
import { Faq } from "@/components/sections/faq";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Four simple steps from enquiry to a consistently maintained workspace, plus frequency comparison and FAQs.",
};

export default function HowItWorksPage() {
  return (
    <>
      <div className="pt-24 sm:pt-28">
        <HowItWorks headingAs="h1" />
      </div>
      <FrequencyComparison />
      <Faq />
      <CtaBanner />
    </>
  );
}
