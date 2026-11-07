import Link from "next/link";
import { faqs } from "@/data/content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function Faq() {
  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered"
            intro={
              <>
                These answers describe how the proposed service is intended to work. Can’t find what you need?{" "}
                <Link href="/contact" className="font-medium text-navy underline underline-offset-4 hover:text-teal">
                  Get in touch
                </Link>
                .
              </>
            }
          />
        </div>
        <Reveal className="lg:col-span-8">
          <Accordion type="single" collapsible defaultValue="item-0" className="border-t border-line">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
