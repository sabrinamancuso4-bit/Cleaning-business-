export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pt-36 pb-24 sm:pt-44">
      <div className="container-page max-w-3xl">
        <p className="eyebrow">Legal · placeholder</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mt-6 rounded-2xl border border-sand/40 bg-sand/10 p-4 text-sm text-charcoal">
          This is placeholder text for a demonstration website. It is not legal advice and must be replaced with
          professionally drafted wording before any real business launches.
        </p>
        <div className="mt-10 space-y-6 leading-relaxed text-charcoal [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold">
          {children}
        </div>
      </div>
    </section>
  );
}
