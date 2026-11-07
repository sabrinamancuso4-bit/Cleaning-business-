"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Info, MapPin } from "lucide-react";
import { serviceAreas } from "@/data/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

/** Illustrative (not geographic) diagram of the proposed service area. */
export function ServiceArea() {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = React.useState<string>(serviceAreas[0].id);
  const active = serviceAreas.find((a) => a.id === activeId)!;

  return (
    <section id="service-area" className="overflow-hidden bg-paper py-24 lg:py-32">
      <div className="container-page grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Service area"
            title="Starting in Manchester, growing outwards"
            intro="The proposed focus is central Manchester, with surrounding boroughs considered as the business grows. Select an area to see its status."
          />
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Areas">
            {serviceAreas.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  aria-pressed={activeId === a.id}
                  onClick={() => setActiveId(a.id)}
                  className={cn(
                    "h-10 rounded-full border px-4 text-sm font-medium transition-all",
                    activeId === a.id ? "border-navy bg-navy text-paper" : "border-line bg-white text-charcoal hover:border-navy/30",
                  )}
                >
                  {a.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 min-h-28 rounded-2xl border border-line bg-white p-5" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active.id} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="flex items-center gap-2 font-display font-semibold text-navy">
                  <MapPin className="size-4 text-teal" aria-hidden />
                  {active.name}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{active.note}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            Illustrative diagram only, not to scale. Coverage of specific postcodes is not promised and would be confirmed
            when quoting.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="relative mx-auto aspect-square w-full max-w-[38rem] rounded-[2rem] bg-mist">
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
              <defs>
                <radialGradient id="area-core" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#3F817D" stopOpacity="0.28" />
                  <stop offset="1" stopColor="#3F817D" stopOpacity="0" />
                </radialGradient>
                <pattern id="area-grid" width="5" height="5" patternUnits="userSpaceOnUse">
                  <path d="M5 0H0V5" fill="none" stroke="#142638" strokeOpacity="0.06" strokeWidth="0.2" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#area-grid)" rx="6" />
              {[44, 32, 20].map((r) => (
                <circle key={r} cx="50" cy="52" r={r} fill="none" stroke="#142638" strokeOpacity="0.1" strokeWidth="0.25" strokeDasharray="0.8 1.2" />
              ))}
              <circle cx="50" cy="52" r="22" fill="url(#area-core)" />
              {/* abstract waterways */}
              <path d="M2 60 C 20 55, 30 52, 42 50 S 60 46, 70 40 S 90 30, 98 28" fill="none" stroke="#3F817D" strokeOpacity="0.25" strokeWidth="0.6" />
              <path d="M20 90 C 30 80, 38 70, 46 58" fill="none" stroke="#3F817D" strokeOpacity="0.18" strokeWidth="0.5" />
              {serviceAreas.map((a) =>
                a.id === "manchester" ? null : (
                  <line key={a.id} x1="50" y1="52" x2={a.x} y2={a.y} stroke="#142638" strokeOpacity={activeId === a.id ? 0.45 : 0.08} strokeWidth="0.3" />
                ),
              )}
            </svg>
            {serviceAreas.map((a) => {
              const isActive = activeId === a.id;
              const isPrimary = "primary" in a && a.primary;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setActiveId(a.id)}
                  aria-label={`${a.name}: show details`}
                  tabIndex={-1}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${a.x}%`, top: `${a.y}%` }}
                >
                  <span className="relative flex flex-col items-center">
                    {isPrimary && !reduce && <span className="absolute top-0 size-5 animate-ping rounded-full bg-teal/40" />}
                    <span
                      className={cn(
                        "relative block rounded-full border-2 border-white shadow transition-all duration-300",
                        isPrimary ? "size-5 bg-teal" : "size-3.5 bg-navy/50 group-hover:bg-navy",
                        isActive && !isPrimary && "scale-125 bg-navy",
                        isActive && "ring-4 ring-teal/30",
                      )}
                    />
                    <span
                      className={cn(
                        "mt-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[0.65rem] font-medium transition-all sm:text-xs",
                        isActive ? "bg-navy text-paper" : "bg-white/80 text-charcoal",
                      )}
                    >
                      {a.name.replace(" city centre", "")}
                    </span>
                  </span>
                </button>
              );
            })}
            <div className="absolute bottom-4 left-4 flex items-center gap-4 rounded-full bg-white/90 px-4 py-2 text-[0.7rem] text-muted backdrop-blur">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-teal" /> Proposed focus</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-navy/50" /> Under consideration</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
