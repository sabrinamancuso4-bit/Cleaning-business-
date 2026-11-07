import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { SiteImage } from "@/components/ui/site-image";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export function ServicesGrid() {
  return (
    <section id="services" className="py-24 lg:py-32">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Our services"
            title="Cleaning programmes for every kind of workspace"
            intro="Recurring weekly and monthly contracts, each built around a clear written scope for your premises."
          />
          <Reveal>
            <Button asChild variant="outline">
              <Link href="/services">
                View all service details <ArrowUpRight aria-hidden />
              </Link>
            </Button>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {services.map((service, i) => (
            <Reveal as="li" key={service.slug} delay={(i % 3) * 0.08} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-all duration-500 hover:-translate-y-1 hover:border-transparent hover:shadow-lift">
                  <div className="relative aspect-[3/2] overflow-hidden bg-mist">
                    <SiteImage
                      src={service.image.src}
                      alt={service.image.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-medium text-navy backdrop-blur">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                    <p className="mt-2 flex-1 leading-relaxed text-muted">{service.summary}</p>
                    <Link
                      href={`/services#${service.slug}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy after:absolute after:inset-0 after:content-[''] group-hover:text-teal"
                    >
                      Learn more<span className="sr-only"> about {service.title.toLowerCase()}</span>
                      <span className="grid size-7 place-items-center rounded-full bg-mist transition-all duration-300 group-hover:rotate-45 group-hover:bg-teal group-hover:text-white">
                        <ArrowUpRight className="size-3.5" aria-hidden />
                      </span>
                    </Link>
                  </div>
                </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
