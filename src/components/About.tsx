export function About() {
  return (
    <section id="about" className="bg-background py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:grid-cols-2 md:px-10">
        <div>
          <span className="text-[11px] tracking-luxe text-[var(--gold-dark)]">OUR STORY</span>
          <h2 className="mt-4 font-serif text-4xl font-light md:text-5xl">
            Three generations of <span className="italic text-gradient-gold">artistry</span>
          </h2>
          <p className="mt-6 text-muted-foreground">
            Born in the heart of Madhya Pradesh, Elite Jewellery Gallery has spent decades
            shaping precious metals into heirlooms. Every piece carries the patience of our
            craftsmen and the trust of the families who wear them.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { n: "30+", l: "Years" },
              { n: "10K+", l: "Happy Clients" },
              { n: "100%", l: "BIS Hallmark" },
            ].map((s) => (
              <div key={s.l} className="border-l-2 border-[var(--gold)] pl-4">
                <p className="font-serif text-3xl text-gradient-gold">{s.n}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {["Hand-Forged", "Ethically Sourced", "Custom Design", "Lifetime Care"].map((t, i) => (
            <div
              key={t}
              className={`rounded-xl border border-border p-6 ${i % 2 ? "bg-cream" : "bg-background shadow-soft"}`}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-gold text-white">✦</div>
              <h3 className="font-serif text-xl">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                A promise of integrity in every piece we create and deliver to your hands.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
