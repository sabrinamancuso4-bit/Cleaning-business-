"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, Check, Clock } from "lucide-react";
import { industries } from "@/data/content";
import { QuoteButton } from "@/components/quote/quote-button";
import { SiteImage } from "@/components/ui/site-image";
import { cn } from "@/lib/utils";

/** Interactive industry cards: choose a sector to see how the approach changes. */
export function IndustryExplorer() {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = React.useState(industries[0].id);
  const active = industries.find((i) => i.id === activeId)!;
  const panelRef = React.useRef<HTMLDivElement>(null);

  const choose = (id: string) => {
    setActiveId(id);
    // On small screens, bring the detail panel into view.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
    }
  };

  return (
    <section className="pb-24 lg:pb-32">
      <div className="container-page">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" aria-label="Choose an industry">
          {industries.map((ind) => {
            const isActive = ind.id === activeId;
            return (
              <li key={ind.id}>
                <button
                  type="button"
                  onClick={() => choose(ind.id)}
                  aria-pressed={isActive}
                  aria-controls="industry-panel"
                  className={cn(
                    "group relative flex aspect-[4/5] w-full flex-col justify-end overflow-hidden rounded-2xl p-4 text-left transition-all duration-500",
                    isActive ? "ring-2 ring-teal ring-offset-4 ring-offset-paper" : "hover:-translate-y-1",
                  )}
                >
                  <SiteImage src={ind.image.src} alt="" fill sizes="(min-width: 1024px) 20vw, 50vw" className="transition-transform duration-700 group-hover:scale-105" />
                  <span className={cn("absolute inset-0 bg-gradient-to-t transition-opacity duration-500", isActive ? "from-navy via-navy/60 to-navy/10" : "from-navy/90 via-navy/30 to-transparent")} />
                  <span className="relative font-display text-base font-semibold leading-tight text-paper sm:text-lg">{ind.title}</span>
                  <span className={cn("relative mt-1 text-xs text-paper/75 transition-opacity", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                    {isActive ? "Selected" : "View approach"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div ref={panelRef} id="industry-panel" aria-live="polite" className="mt-8 scroll-mt-32 overflow-hidden rounded-[1.75rem] border border-line bg-white">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-12"
            >
              <div className="relative aspect-[16/10] lg:col-span-5 lg:aspect-auto">
                <SiteImage src={active.image.src} alt={active.image.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
              <div className="p-7 sm:p-10 lg:col-span-7 lg:p-12">
                <h2 className="text-3xl font-semibold">{active.title}</h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">The challenge</h3>
                    <p className="mt-2 leading-relaxed text-charcoal">{active.challenge}</p>
                  </div>
                  <div>
                    <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">Typical timing</h3>
                    <p className="mt-2 flex items-center gap-2 text-charcoal">
                      <Clock className="size-4 text-teal" aria-hidden /> {active.timing}
                    </p>
                  </div>
                </div>
                <h3 className="mt-8 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">How our approach differs</h3>
                <ul className="mt-3 space-y-3">
                  {active.approach.map((a) => (
                    <li key={a} className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-teal-100 text-teal">
                        <Check className="size-3.5" aria-hidden />
                      </span>
                      {a}
                    </li>
                  ))}
                </ul>
                {active.note && (
                  <p className="mt-8 flex items-start gap-3 rounded-2xl border border-sand/40 bg-sand/10 p-4 text-sm leading-relaxed text-charcoal">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#8a6d48]" aria-hidden />
                    <span>
                      <strong className="font-semibold text-navy">Future capability: </strong>
                      {active.note}
                    </span>
                  </p>
                )}
                <QuoteButton className="mt-8" propertyType={active.quoteType}>
                  Get an estimate for this sector
                </QuoteButton>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
