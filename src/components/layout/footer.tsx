import Link from "next/link";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { legalNav, mainNav, siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-900 pb-28 text-paper md:pb-0">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-0 size-[32rem] rounded-full bg-teal/10 blur-3xl" />
      <div className="container-page relative grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-6 max-w-sm leading-relaxed text-paper/65">
            Proposed recurring commercial cleaning for workplaces across {siteConfig.city} and the surrounding area.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs text-paper/70">
            <MapPin className="size-3.5 text-teal" aria-hidden />
            Proposed service area: {siteConfig.city} &amp; {siteConfig.region}
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
          <div>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-paper/50">Company</h2>
            <ul className="mt-4 space-y-1">
              {mainNav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-1.5 text-sm text-paper/80 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-paper/50">Services</h2>
            <ul className="mt-4 space-y-1">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`} className="inline-block py-1.5 text-sm text-paper/80 transition-colors hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-paper/50">Follow</h2>
            <ul className="mt-4 space-y-1">
              {siteConfig.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="inline-block py-1.5 text-sm text-paper/80 hover:text-white" aria-label={`${s.label} (placeholder link)`}>
                    {s.label} <span className="text-paper/40">· placeholder</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-paper/50">
            Contact <span className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-[0.6rem] tracking-wider text-paper/70">Demo details</span>
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-paper/80">
            <li className="flex items-center gap-3">
              <Phone className="size-4 text-teal" aria-hidden />
              <a href={siteConfig.contact.phoneHref} className="hover:text-white">{siteConfig.contact.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 text-teal" aria-hidden />
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white">{siteConfig.contact.email}</a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-4 text-teal" aria-hidden /> {siteConfig.contact.address}
            </li>
            <li className="flex items-center gap-3">
              <Clock className="size-4 text-teal" aria-hidden /> {siteConfig.contact.hours}
            </li>
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-paper/45">
            Placeholder contact details for demonstration. They do not belong to a real business.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {siteConfig.copyrightYear} {siteConfig.name} (placeholder name). Demonstration website only.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
