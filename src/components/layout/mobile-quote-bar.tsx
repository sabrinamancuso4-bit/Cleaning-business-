"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Phone } from "lucide-react";
import { QuoteButton } from "@/components/quote/quote-button";
import { useQuote } from "@/components/quote/quote-context";
import { siteConfig } from "@/config/site";

/** Sticky bottom call-to-action on small screens, shown after the hero. */
export function MobileQuoteBar() {
  const reduce = useReducedMotion();
  const { open } = useQuote();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && !open && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { y: "110%" }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "110%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
        >
          <div className="flex gap-2">
            <a
              href={siteConfig.contact.phoneHref}
              aria-label={`Call ${siteConfig.contact.phone} (demo number)`}
              className="grid size-12 shrink-0 place-items-center rounded-full border border-line bg-white text-navy"
            >
              <Phone className="size-5" aria-hidden />
            </a>
            <QuoteButton variant="accent" className="h-12 flex-1">
              Get a Free Quote
            </QuoteButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
