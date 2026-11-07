import Link from "next/link";
import { images } from "@/config/images";
import { QuoteButton } from "@/components/quote/quote-button";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SiteImage } from "@/components/ui/site-image";

export function CtaBanner({
  title = "Let’s make your workspace work better.",
  body = "Build an illustrative estimate in under two minutes, then request a formal quote with your selections already filled in.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-page">
        <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-navy px-6 py-16 sm:px-12 lg:px-16 lg:py-20">
          <div className="absolute inset-0 -z-10 opacity-25">
            <SiteImage src={images.meetingRoom.src} alt="" fill sizes="100vw" />
          </div>
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/95 to-navy/60" />
          <div className="max-w-2xl">
            <p className="eyebrow text-teal-100">Get started</p>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.05] text-paper sm:text-5xl lg:text-6xl">{title}</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/75">{body}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <QuoteButton size="lg" variant="light">
                Get a Free Quote
              </QuoteButton>
              <Button asChild size="lg" variant="outline-light">
                <Link href="/contact">Contact us</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
