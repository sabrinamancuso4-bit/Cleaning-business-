"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Minus } from "lucide-react";
import { calculateQuote, formatGBP, sizes, type FrequencyId, type SizeId } from "@/config/pricing";
import { SectionHeading } from "@/components/ui/section-heading";
import { QuoteButton } from "@/components/quote/quote-button";
import { cn } from "@/lib/utils";

const plans: {
  id: FrequencyId;
  name: string;
  cadence: string;
  bestFor: string;
  days: number[];
  features: [string, boolean][];
}[] = [
  {
    id: "1",
    name: "Weekly",
    cadence: "1 visit per week",
    bestFor: "Small offices, studios and communal areas with light footfall.",
    days: [0],
    features: [
      ["Full routine clean of agreed areas", true],
      ["Washrooms and kitchens refreshed weekly", true],
      ["Bins emptied mid-week", false],
      ["Consistently presentable every morning", false],
    ],
  },
  {
    id: "3",
    name: "Three times weekly",
    cadence: "3 visits per week",
    bestFor: "Busy offices, salons and retail units that see steady daily use.",
    days: [0, 2, 4],
    features: [
      ["Full routine clean of agreed areas", true],
      ["Washrooms and kitchens refreshed every other day", true],
      ["Bins emptied mid-week", true],
      ["Consistently presentable every morning", false],
    ],
  },
  {
    id: "5",
    name: "Daily",
    cadence: "5 visits per week (Mon–Fri)",
    bestFor: "High-traffic workplaces, client-facing premises and clinics.",
    days: [0, 1, 2, 3, 4],
    features: [
      ["Full routine clean of agreed areas", true],
      ["Washrooms and kitchens refreshed daily", true],
      ["Bins emptied every day", true],
      ["Consistently presentable every morning", true],
    ],
  },
];

export function FrequencyComparison() {
  const reduce = useReducedMotion();
  const [size, setSize] = React.useState<SizeId>("m");

  const results = plans.map((p) => calculateQuote({ propertyType: "office", size, frequency: p.id, extras: [] }));
  const max = Math.max(...results.map((r) => r.monthlyEstimate));

  return (
    <section id="frequency" className="bg-mist py-24 lg:py-32">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Compare frequencies"
            title="How often should your premises be cleaned?"
            intro="Choose an office size to compare illustrative monthly costs and what each schedule typically covers."
          />
          <fieldset className="shrink-0">
            <legend className="mb-3 text-sm font-medium text-navy">Office size</legend>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <label key={s.id}>
                  <input type="radio" name="freq-size" value={s.id} checked={size === s.id} onChange={() => setSize(s.id)} className="peer sr-only" />
                  <span className="inline-flex h-11 cursor-pointer items-center rounded-full border border-line bg-white px-4 text-sm font-medium text-charcoal transition-all hover:border-navy/30 peer-checked:border-navy peer-checked:bg-navy peer-checked:text-paper peer-focus-visible:ring-4 peer-focus-visible:ring-teal/30">
                    {s.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const r = results[i];
            const isSel = plan.id === "3";
            return (
              <article
                key={plan.id}
                className={cn(
                  "relative flex flex-col rounded-[var(--radius-card)] border bg-white p-7 transition-all duration-300",
                  isSel ? "border-teal shadow-lift" : "border-transparent hover:-translate-y-1 hover:shadow-soft",
                )}
              >
                {plan.id === "3" && (
                  <span className="absolute -top-3 left-7 rounded-full bg-teal px-3 py-1 text-xs font-semibold text-white">Most balanced</span>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-muted">{plan.cadence}</p>
                  </div>
                  <div className="flex gap-0.5" aria-label={`Visit days: ${plan.cadence}`} role="img">
                    {["M", "T", "W", "T", "F"].map((d, j) => (
                      <span key={j} className={cn("grid h-8 w-5 place-items-center rounded-md text-[0.6rem] font-semibold", plan.days.includes(j) ? "bg-navy text-paper" : "bg-mist text-muted")}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8" aria-live="polite">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted">Illustrative monthly estimate</p>
                  <p className="mt-1 font-display text-4xl font-semibold tracking-tight text-navy">
                    {formatGBP(r.monthlyEstimate)}
                    <span className="text-base font-normal text-muted"> /month</span>
                  </p>
                  <p className="mt-1 text-sm text-muted">≈ {r.monthlyHours} cleaning hours per month</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-mist" aria-hidden>
                    <motion.div
                      className="h-full rounded-full bg-teal"
                      initial={false}
                      animate={{ width: `${(r.monthlyEstimate / max) * 100}%` }}
                      transition={{ duration: reduce ? 0 : 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <p className="mt-6 text-sm leading-relaxed text-charcoal">
                  <span className="font-semibold text-navy">Best for: </span>
                  {plan.bestFor}
                </p>
                <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6 text-sm">
                  {plan.features.map(([f, on]) => (
                    <li key={f} className={cn("flex items-start gap-3", !on && "text-muted/70")}>
                      {on ? <Check className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden /> : <Minus className="mt-0.5 size-4 shrink-0" aria-hidden />}
                      <span>
                        {f}
                        <span className="sr-only">{on ? " (included)" : " (not included)"}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-2">
                  <QuoteButton
                    preset={{ propertyType: "office", size, frequency: plan.id }}
                    variant={isSel ? "accent" : "outline"}
                  >
                    Estimate this plan
                  </QuoteButton>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[var(--radius-card)] border border-line bg-white p-6 sm:flex-row sm:items-center">
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            Figures are illustrative, based on an office with no extras, assumed cleaning times and an example hourly rate.
            They are not quotations. Personalise your estimate with property type, frequency and extras.
          </p>
          <QuoteButton variant="primary" className="shrink-0">
            Personalise my estimate
          </QuoteButton>
        </div>
      </div>
    </section>
  );
}
