import type { SiteImage as SiteImageType } from "@/config/images";
import { SiteImage } from "@/components/ui/site-image";
import { Reveal } from "@/components/ui/reveal";

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: React.ReactNode;
  image?: SiteImageType;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative pt-36 pb-16 sm:pt-44 lg:pb-20">
      <div className="container-page">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow inline-flex items-center gap-3">
              <span className="h-px w-8 bg-teal" aria-hidden />
              {eyebrow}
            </p>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-5xl lg:text-6xl">{title}</h1>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-muted">{intro}</p>
            {children && <div className="mt-8">{children}</div>}
          </Reveal>
        </div>
        {image && (
          <Reveal delay={0.15} className="relative mt-14 aspect-[16/9] overflow-hidden rounded-[1.75rem] bg-mist sm:aspect-[21/9]">
            <SiteImage src={image.src} alt={image.alt} fill priority sizes="100vw" />
          </Reveal>
        )}
      </div>
    </section>
  );
}
