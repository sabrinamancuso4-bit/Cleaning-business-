import type { Metadata } from "next";
import { images } from "@/config/images";
import { siteConfig } from "@/config/site";
import { values, commitments } from "@/data/content";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteImage } from "@/components/ui/site-image";

export const metadata: Metadata = {
  title: "About Us",
  description: "The proposed mission, values and service philosophy behind a new commercial cleaning business in Manchester.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A new standard for everyday commercial cleaning"
        intro={`${siteConfig.name} is a proposed Manchester business, currently at the planning stage. This page sets out what it aims to stand for.`}
        image={images.about}
      />

      <section className="py-20 lg:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Our mission</p>
          </div>
          <Reveal className="lg:col-span-8">
            <p className="font-display text-2xl font-medium leading-snug text-navy sm:text-3xl lg:text-[2.1rem]">
              To give businesses one less thing to think about — by delivering commercial cleaning that is reliable,
              transparent and genuinely tailored to how each space is used.
            </p>
            <div className="mt-10 grid gap-8 text-lg leading-relaxed text-muted sm:grid-cols-2">
              <p>
                Most businesses don’t want to manage their cleaning. They want to walk into a space that feels cared for,
                every time, without chasing anyone. The proposed service is designed around that simple expectation.
              </p>
              <p>
                That means clear written scopes, sensible schedules, honest pricing and a single point of contact. We
                won’t claim experience or credentials we don’t have yet — we’d rather earn trust one premises at a time.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-mist py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Values" title="What we intend to stand for" />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 0.06} className="rounded-[var(--radius-card)] bg-white p-7">
                <span className="font-display text-sm font-semibold text-teal">0{i + 1}</span>
                <h3 className="mt-6 text-xl font-semibold">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{v.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-mist">
            <SiteImage src={images.deepClean.src} alt={images.deepClean.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" />
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Service philosophy"
              title="Systems that make consistency the default"
              intro="Great cleaning isn’t a one-off effort. It comes from a repeatable process applied carefully, visit after visit."
            />
            <ol className="mt-10 space-y-5">
              {commitments.map((c, i) => (
                <Reveal as="li" key={c.title} delay={i * 0.05} className="flex gap-5 border-b border-line pb-5">
                  <span className="font-display text-sm font-semibold text-teal">0{i + 1}</span>
                  <div>
                    <h3 className="font-semibold">{c.title}</h3>
                    <p className="mt-1 text-muted">{c.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container-page">
          <p className="rounded-2xl border border-dashed border-line p-6 text-sm leading-relaxed text-muted">
            <strong className="font-semibold text-navy">An honest note:</strong> this is a demonstration website for a
            business that has not yet launched. There is no trading history, team or client list to show, so you won’t
            find testimonials, ratings or accreditations here. Those would only be added once they genuinely exist.
          </p>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
