import { CalendarClock, ClipboardCheck, FileText, Layers, MessageSquare } from "lucide-react";
import { commitments } from "@/data/content";
import { images } from "@/config/images";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteImage } from "@/components/ui/site-image";

const icons = { CalendarClock, ClipboardCheck, FileText, Layers, MessageSquare };

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-navy py-24 text-paper lg:py-32">
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgb(63_129_125/0.25),transparent_60%)]" />
      <div className="container-page relative grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeading
            tone="light"
            eyebrow="Why choose us"
            title="Built on commitments, not claims"
            intro="We’re a new, proposed business, so instead of borrowed reviews, here is exactly how we intend to work with every client."
          />
          <Reveal delay={0.1} className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] lg:block">
            <SiteImage src={images.outOfHours.src} alt={images.outOfHours.alt} fill sizes="40vw" />
          </Reveal>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-white/10 sm:grid-cols-2 lg:col-span-7">
          {commitments.map((c, i) => {
            const Icon = icons[c.icon];
            return (
              <Reveal
                as="li"
                key={c.title}
                delay={i * 0.06}
                className={`group relative bg-navy p-7 transition-colors duration-500 hover:bg-navy-700 sm:p-8 ${i === commitments.length - 1 ? "sm:col-span-2" : ""}`}
              >
                <span className="grid size-12 place-items-center rounded-xl border border-white/15 text-teal-100 transition-all duration-500 group-hover:border-teal group-hover:bg-teal group-hover:text-white">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-paper">{c.title}</h3>
                <p className="mt-2 leading-relaxed text-paper/70">{c.body}</p>
                <span aria-hidden className="absolute right-7 top-7 font-display text-sm text-paper/30">0{i + 1}</span>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
