import heroImg from "@/assets/hero.jpg";

export function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden">
      <img
        src={heroImg}
        alt="Elite Jewellery Gallery — luxury gold and diamond collection"
        width={1920}
        height={1280}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[var(--gradient-hero)]" />
      <div className="mx-auto flex min-h-[88vh] max-w-7xl flex-col items-start justify-center px-5 py-24 md:px-10">
        <span className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/15 px-4 py-1.5 text-[11px] tracking-luxe text-white backdrop-blur-md">
          <span className="h-1 w-1 rounded-full bg-[var(--gold-light)]" />
          ELITE JEWELLERY GALLERY
        </span>
        <h1 className="max-w-3xl font-serif text-5xl font-light leading-[1.05] text-white md:text-7xl lg:text-8xl">
          Timeless <span className="italic text-gradient-gold">Elegance</span>,
          <br /> Crafted for You
        </h1>
        <p className="mt-6 max-w-xl text-base text-white/85 md:text-lg">
          Discover handcrafted rings, necklaces, earrings, bracelets and bangles —
          designed to celebrate every precious moment of your life.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#collection"
            className="rounded-full bg-gradient-gold px-8 py-4 text-sm font-medium tracking-wide text-white shadow-luxe transition-transform hover:scale-[1.03]"
          >
            View Collection
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/40 bg-white/10 px-8 py-4 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            Book Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
