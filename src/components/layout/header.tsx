"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { mainNav, siteConfig } from "@/config/site";
import { QuoteButton } from "@/components/quote/quote-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export function Header() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Demo indicator: always visible, deliberately understated. */}
      <div className="bg-navy text-paper">
        <p className="container-page flex h-8 items-center justify-center gap-2 text-center text-[0.7rem] tracking-wide sm:text-xs">
          <span className="rounded-full bg-teal px-2 py-px text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white">
            Demo website
          </span>
          <span className="truncate text-paper/75">
            <span className="hidden sm:inline">Concept site for a proposed business · </span>No enquiries are sent or stored
          </span>
        </p>
      </div>

      <div
        className={cn(
          "border-b transition-all duration-500",
          scrolled ? "border-line/80 bg-paper/85 shadow-[0_8px_30px_-12px_rgb(20_38_56/0.15)] backdrop-blur-xl" : "border-transparent bg-transparent",
        )}
      >
        <div className={cn("container-page flex items-center justify-between gap-6 transition-all duration-500", scrolled ? "h-16" : "h-20")}>
          <Logo />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                      isActive(item.href) ? "text-navy" : "text-charcoal/70 hover:text-navy",
                    )}
                  >
                    {isActive(item.href) && (
                      <motion.span
                        layoutId={reduce ? undefined : "nav-pill"}
                        className="absolute inset-0 -z-10 rounded-full bg-mist"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <QuoteButton size="sm" className="hidden sm:inline-flex">
              Get a Quote
            </QuoteButton>

            <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
              <Dialog.Trigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="!size-6" aria-hidden />
                </Button>
              </Dialog.Trigger>
              <AnimatePresence>
                {menuOpen && (
                  <Dialog.Portal forceMount>
                    <Dialog.Overlay asChild forceMount>
                      <motion.div
                        className="fixed inset-0 z-[55] bg-navy-900/50 backdrop-blur-sm lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    </Dialog.Overlay>
                    <Dialog.Content asChild forceMount aria-describedby={undefined}>
                      <motion.div
                        className="fixed inset-y-0 right-0 z-[56] flex w-full max-w-sm flex-col bg-paper p-6 shadow-2xl outline-none lg:hidden"
                        initial={reduce ? { opacity: 0 } : { x: "100%" }}
                        animate={reduce ? { opacity: 1 } : { x: 0 }}
                        exit={reduce ? { opacity: 0 } : { x: "100%" }}
                        transition={{ type: "spring", stiffness: 320, damping: 34 }}
                      >
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="sr-only">Menu</Dialog.Title>
                          <Logo />
                          <Dialog.Close asChild>
                            <Button variant="ghost" size="icon" aria-label="Close menu">
                              <X className="!size-6" aria-hidden />
                            </Button>
                          </Dialog.Close>
                        </div>
                        <nav aria-label="Mobile" className="mt-10">
                          <ul className="flex flex-col">
                            {mainNav.map((item, i) => (
                              <motion.li
                                key={item.href}
                                initial={reduce ? false : { opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 + i * 0.04 }}
                              >
                                <Link
                                  href={item.href}
                                  onClick={() => setMenuOpen(false)}
                                  aria-current={isActive(item.href) ? "page" : undefined}
                                  className={cn(
                                    "flex min-h-14 items-center justify-between border-b border-line font-display text-xl font-semibold transition-colors",
                                    isActive(item.href) ? "text-teal" : "text-navy hover:text-teal",
                                  )}
                                >
                                  {item.label}
                                  <ArrowUpRight className="size-5 opacity-40" aria-hidden />
                                </Link>
                              </motion.li>
                            ))}
                          </ul>
                        </nav>
                        <div className="mt-auto flex flex-col gap-3 pt-8">
                          <QuoteButton size="lg" variant="accent" onClick={() => setMenuOpen(false)}>
                            Get a Free Quote
                          </QuoteButton>
                          <p className="text-center text-xs text-muted">
                            {siteConfig.contact.phone} · <span className="uppercase tracking-wider">demo details</span>
                          </p>
                        </div>
                      </motion.div>
                    </Dialog.Content>
                  </Dialog.Portal>
                )}
              </AnimatePresence>
            </Dialog.Root>
          </div>
        </div>
      </div>
    </header>
  );
}
