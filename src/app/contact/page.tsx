import type { Metadata } from "next";
import { Calculator, Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { QuoteButton } from "@/components/quote/quote-button";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Enquire about regular commercial cleaning in Manchester. Demo form — nothing is sent or stored.",
};

export default function ContactPage() {
  const details = [
    { icon: Phone, label: "Phone", value: siteConfig.contact.phone, href: siteConfig.contact.phoneHref },
    { icon: Mail, label: "Email", value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
    { icon: MapPin, label: "Area", value: `${siteConfig.city} & ${siteConfig.region}` },
    { icon: Clock, label: "Hours", value: siteConfig.contact.hours },
  ];

  return (
    <section className="pt-36 pb-24 sm:pt-44 lg:pb-32">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow inline-flex items-center gap-3">
              <span className="h-px w-8 bg-teal" aria-hidden />
              Contact
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] sm:text-5xl">Let’s talk about your premises</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Tell us a little about your space and how you’d like it cleaned. In a live version, we’d reply within one
              working day to arrange a premises assessment.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 rounded-[var(--radius-card)] bg-navy p-7 text-paper">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-paper/60">Contact details</h2>
              <span className="rounded bg-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-paper/70">Demo only</span>
            </div>
            <dl className="mt-6 space-y-5">
              {details.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-teal-100">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div>
                    <dt className="text-xs text-paper/55">{label}</dt>
                    <dd className="mt-0.5 font-medium">
                      {href ? <a href={href} className="hover:text-teal-100">{value}</a> : value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
            <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-relaxed text-paper/55">
              These are placeholder details and do not connect to a real business.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-6 flex items-start gap-4 rounded-[var(--radius-card)] border border-line bg-white p-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal">
              <Calculator className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Prefer a quick estimate first?</h2>
              <p className="mt-1 text-sm text-muted">Use the estimator to see an illustrative monthly cost, then send your selections.</p>
              <QuoteButton variant="link" className="mt-3 h-auto">
                Open the quote estimator
              </QuoteButton>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="rounded-[1.75rem] border border-line bg-white p-6 shadow-soft sm:p-10">
            <h2 className="text-2xl font-semibold">Send an enquiry</h2>
            <p className="mt-2 mb-8 text-sm text-muted">Fields marked * are required.</p>
            <EnquiryForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
