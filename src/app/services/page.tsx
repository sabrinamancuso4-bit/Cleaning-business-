import type { Metadata } from "next";
import { Building2, CalendarDays, Check, ListChecks, Send } from "lucide-react";
import { services } from "@/data/services";
import { PageHero } from "@/components/sections/page-hero";
import { FrequencyComparison } from "@/components/sections/frequency-comparison";
import { CtaBanner } from "@/components/sections/cta-banner";
import { QuoteButton } from "@/components/quote/quote-button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";
import { SiteImage } from "@/components/ui/site-image";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Office, retail, salon, communal area, clinic and deep cleaning services, proposed for Manchester businesses.",
};

function List({ items }: { items: readonly string[] }) {
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {items.map((i) => (
        <li key={i} className="flex items-start gap-2.5">
          <Check className="mt-1 size-4 shrink-0 text-teal" aria-hidden />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Cleaning built around how your premises work"
        intro="Six proposed service programmes, each delivered on a recurring contract with a written scope. Expand any section to see exactly what’s involved."
      />

      <nav aria-label="Services on this page" className="sticky top-24 z-30 border-y border-line bg-paper/90 backdrop-blur-xl">
        <ul className="container-page flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          {services.map((s) => (
            <li key={s.slug} className="shrink-0">
              <a href={`#${s.slug}`} className="inline-flex h-10 items-center rounded-full border border-line bg-white px-4 text-sm font-medium text-charcoal transition-colors hover:border-navy hover:text-navy">
                {s.shortTitle}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-page flex flex-col gap-24 py-20 lg:gap-32 lg:py-28">
        {services.map((s, i) => (
          <section key={s.slug} id={s.slug} aria-labelledby={`${s.slug}-title`} className="scroll-mt-48 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className={cn("lg:col-span-5", i % 2 === 1 && "lg:order-2")}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-mist lg:sticky lg:top-48">
                <SiteImage src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" />
                <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-medium text-navy">
                  0{i + 1} / 0{services.length}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-7">
              <h2 id={`${s.slug}-title`} className="text-3xl font-semibold sm:text-4xl">{s.title}</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">{s.intro}</p>

              <Accordion type="multiple" defaultValue={["included"]} className="mt-8 border-t border-line">
                <AccordionItem value="included">
                  <AccordionTrigger>
                    <span className="flex items-center gap-3"><ListChecks className="size-5 text-teal" aria-hidden /> What’s included</span>
                  </AccordionTrigger>
                  <AccordionContent><List items={s.included} /></AccordionContent>
                </AccordionItem>
                <AccordionItem value="suitable">
                  <AccordionTrigger>
                    <span className="flex items-center gap-3"><Building2 className="size-5 text-teal" aria-hidden /> Suitable business types</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="flex flex-wrap gap-2">
                      {s.suitableFor.map((b) => (
                        <li key={b} className="rounded-full bg-mist px-3 py-1.5 text-sm text-charcoal">{b}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="frequency">
                  <AccordionTrigger>
                    <span className="flex items-center gap-3"><CalendarDays className="size-5 text-teal" aria-hidden /> Available cleaning frequencies</span>
                  </AccordionTrigger>
                  <AccordionContent><List items={s.frequencies} /></AccordionContent>
                </AccordionItem>
                <AccordionItem value="tasks">
                  <AccordionTrigger>
                    <span className="flex items-center gap-3"><Check className="size-5 text-teal" aria-hidden /> Example cleaning tasks</span>
                  </AccordionTrigger>
                  <AccordionContent><List items={s.exampleTasks} /></AccordionContent>
                </AccordionItem>
                <AccordionItem value="quote">
                  <AccordionTrigger>
                    <span className="flex items-center gap-3"><Send className="size-5 text-teal" aria-hidden /> How to request a tailored quote</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal space-y-2 pl-5">
                      <li>Open the quote estimator — {s.shortTitle.toLowerCase()} details are preselected for you.</li>
                      <li>Choose your space size, cleaning frequency and any extras.</li>
                      <li>Review the illustrative estimate, then request a formal quote with your selections prefilled.</li>
                      <li>A premises assessment would follow before any final price is agreed.</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <QuoteButton propertyType={s.quoteType}>Get a quote for {s.title.toLowerCase()}</QuoteButton>
                <p className="text-sm text-muted">Takes about two minutes.</p>
              </div>
            </Reveal>
          </section>
        ))}
      </div>

      <FrequencyComparison />
      <CtaBanner />
    </>
  );
}
