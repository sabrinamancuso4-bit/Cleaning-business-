"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDownRight, CalendarClock, ClipboardCheck, FileText } from "lucide-react";
import { useRef } from "react";
import { images } from "@/config/images";
import { SiteImage } from "@/components/ui/site-image";
import { QuoteButton } from "@/components/quote/quote-button";
import { Button } from "@/components/ui/button";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);

  const fadeUp = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <section ref={ref} className="relative overflow-hidden pt-32 pb-16 sm:pt-40 lg:pb-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 xl:col-span-5">
          <motion.p {...fadeUp(0.05)} className="eyebrow inline-flex items-center gap-3">
            <span className="h-px w-8 bg-teal" aria-hidden />
            Commercial cleaning · Manchester
          </motion.p>
          <motion.h1
            {...fadeUp(0.12)}
            className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.035em] text-navy sm:text-6xl lg:text-[4.25rem]"
          >
            Exceptional Spaces.{" "}
            <span className="relative whitespace-nowrap text-teal">
              Effortlessly
            </span>{" "}
            Maintained.
          </motion.h1>
          <motion.p {...fadeUp(0.22)} className="mt-6 max-w-lg text-lg leading-relaxed text-muted sm:text-xl">
            Professional commercial cleaning tailored to the way your business operates. Reliable, flexible and designed
            around your workspace.
          </motion.p>
          <motion.div {...fadeUp(0.32)} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <QuoteButton size="lg">Get a Free Quote</QuoteButton>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">
                Explore Our Services
                <ArrowDownRight className="transition-transform duration-300 group-hover/btn:rotate-[-45deg]" aria-hidden />
              </Link>
            </Button>
          </motion.div>
          <motion.ul {...fadeUp(0.42)} className="mt-12 grid grid-cols-1 gap-4 border-t border-line pt-8 text-sm sm:grid-cols-3">
            {[
              { icon: CalendarClock, label: "Schedules around your hours" },
              { icon: FileText, label: "Transparent, itemised quotes" },
              { icon: ClipboardCheck, label: "Planned quality checks" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-charcoal sm:flex-col sm:items-start sm:gap-2">
                <Icon className="size-5 shrink-0 text-teal" aria-hidden />
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96, clipPath: "inset(8% 8% 8% 8% round 28px)" }}
          animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 28px)" }}
          transition={{ duration: 1.3, delay: 0.15, ease }}
          className="relative lg:col-span-6 xl:col-span-7"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-mist shadow-lift sm:aspect-[16/11]">
            <motion.div style={{ y: imgY }} className="absolute -inset-y-[8%] inset-x-0">
              <SiteImage
                src={images.hero.src}
                alt={images.hero.alt}
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
            </motion.div>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/25 via-transparent to-transparent" />
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease }}
            className="absolute -bottom-6 left-4 right-4 rounded-2xl border border-white/60 bg-paper/90 p-4 shadow-lift backdrop-blur-xl sm:left-auto sm:right-8 sm:w-80 sm:p-5"
          >
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Example plan</p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-lg font-semibold text-navy">Office · 101–250 m²</p>
                <p className="text-sm text-muted">Three visits a week, early morning</p>
              </div>
              <div className="flex gap-1" aria-hidden>
                {["M", "T", "W", "T", "F"].map((d, i) => (
                  <span key={i} className={`grid h-8 w-5 place-items-center rounded-md text-[0.6rem] font-semibold ${i % 2 === 0 ? "bg-teal text-white" : "bg-mist text-muted"}`}>
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
