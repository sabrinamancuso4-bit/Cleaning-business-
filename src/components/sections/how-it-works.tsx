"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { processSteps } from "@/data/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { QuoteButton } from "@/components/quote/quote-button";
import { cn } from "@/lib/utils";

/** Interactive four-step process: a tablist on desktop, stacked on mobile. */
export function HowItWorks({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState(0);
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const step = processSteps[active];

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const n = processSteps.length;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next !== null) {
      e.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  };

  return (
    <section id="how-it-works" className="py-24 lg:py-32">
      <div className="container-page">
        <SectionHeading
          as={headingAs}
          align="center"
          eyebrow="How it works"
          title="From first enquiry to a consistently maintained workspace"
          intro="Four straightforward steps, designed to make arranging commercial cleaning simple, even if you’ve never done it before."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-12 lg:gap-10">
          <div role="tablist" aria-label="Process steps" aria-orientation="vertical" className="relative flex flex-col gap-2 self-start lg:col-span-5">
            <div aria-hidden className="absolute bottom-8 left-[1.6rem] top-8 w-px bg-line" />
            <motion.div
              aria-hidden
              className="absolute left-[1.6rem] top-8 w-px origin-top bg-teal"
              animate={{ height: `calc((100% - 4rem) * ${active / (processSteps.length - 1)})` }}
              transition={{ duration: reduce ? 0 : 0.5, ease: "easeOut" }}
            />
            {processSteps.map((s, i) => {
              const selected = i === active;
              return (
                <button
                  key={s.title}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`step-tab-${i}`}
                  aria-selected={selected}
                  aria-controls={`step-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cn(
                    "relative flex min-h-16 items-center gap-5 rounded-2xl p-3 pr-5 text-left transition-colors duration-300",
                    selected ? "bg-white shadow-soft" : "hover:bg-white/60",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 grid size-10 shrink-0 place-items-center rounded-full border font-display text-sm font-semibold transition-all duration-300",
                      selected ? "border-teal bg-teal text-white" : i < active ? "border-teal bg-paper text-teal" : "border-line bg-paper text-muted",
                    )}
                  >
                    {i < active ? <Check className="size-4" aria-hidden /> : i + 1}
                  </span>
                  <span className={cn("font-display text-lg font-semibold transition-colors", selected ? "text-navy" : "text-charcoal/70")}>
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="step-panel"
            aria-labelledby={`step-tab-${active}`}
            className="relative overflow-hidden rounded-[1.75rem] bg-mist p-8 sm:p-12 lg:col-span-7"
          >
            <span aria-hidden className="pointer-events-none absolute -right-4 -top-10 font-display text-[12rem] font-bold leading-none text-white/70 sm:text-[16rem]">
              {active + 1}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <p className="eyebrow">Step {active + 1} of {processSteps.length}</p>
                <h3 className="mt-4 text-3xl font-semibold sm:text-4xl">{step.title}</h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">{step.body}</p>
                <ul className="mt-8 grid gap-3">
                  {step.detail.map((d) => (
                    <li key={d} className="flex items-center gap-3 rounded-xl bg-white/80 px-4 py-3 text-charcoal">
                      <span className="grid size-6 place-items-center rounded-full bg-teal-100 text-teal">
                        <Check className="size-3.5" aria-hidden />
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
                {active === 0 && (
                  <QuoteButton className="mt-8" variant="accent">
                    Start with the estimator
                  </QuoteButton>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
