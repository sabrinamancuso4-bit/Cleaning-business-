/** Quiet marquee of the sectors served — deliberately not client logos. */
const sectors = [
  "Corporate offices",
  "Co-working spaces",
  "Beauty salons",
  "Barbershops",
  "Retail boutiques",
  "Apartment communal areas",
  "Property managers",
  "Private clinics",
  "Dental practices",
];

export function SectorStrip() {
  return (
    <section aria-label="Sectors we propose to serve" className="border-y border-line bg-white/60 py-6">
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <ul className="flex w-max animate-marquee gap-12 pr-12 motion-reduce:animate-none">
          {[...sectors, ...sectors].map((s, i) => (
            <li key={i} aria-hidden={i >= sectors.length} className="flex items-center gap-12 whitespace-nowrap font-display text-lg font-medium text-navy/60">
              {s}
              <span className="size-1.5 rounded-full bg-teal/60" aria-hidden />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
