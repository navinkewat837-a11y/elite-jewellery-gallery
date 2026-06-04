import bridalImage from "@/assets/bridal-lehenga.jpg.asset.json";
import bridalVideo from "@/assets/bridal-inspiration.mp4.asset.json";

export function BridalInspiration() {
  return (
    <section id="bridal-inspiration" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] tracking-luxe text-[var(--gold-dark)]">BRIDAL ATELIER</span>
          <h2 className="mt-4 font-serif text-4xl font-light md:text-6xl">
            Bridal <span className="italic text-gradient-gold">Inspiration</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Couture lehengas and wedding-day looks — curated to pair with our heirloom jewellery.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <figure className="group overflow-hidden rounded-2xl bg-cream shadow-soft transition-all hover:-translate-y-1 hover:shadow-luxe">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={bridalImage.url}
                alt="Peacock embroidered tiered bridal lehenga in pink, magenta and purple ombré with butterfly-motif blouse"
                loading="lazy"
                width={900}
                height={1200}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[10px] tracking-luxe text-[var(--gold-dark)] backdrop-blur">
                SIGNATURE LEHENGA
              </span>
            </div>
            <figcaption className="p-6 md:p-8">
              <h3 className="font-serif text-2xl font-medium md:text-3xl">Peacock Ombré Couture Lehenga</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Hand-embroidered peacock and floral motifs cascade across tiered pink-to-purple net, finished with a sculpted butterfly blouse and lilac dupatta — pair with our bridal payal.
              </p>
            </figcaption>
          </figure>

          <figure className="group overflow-hidden rounded-2xl bg-cream shadow-soft transition-all hover:-translate-y-1 hover:shadow-luxe">
            <div className="relative aspect-[3/4] overflow-hidden bg-charcoal">
              <video
                src={bridalVideo.url}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
                aria-label="Modern wedding hairstyle inspiration video"
              />
              <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[10px] tracking-luxe text-[var(--gold-dark)] backdrop-blur">
                WEDDING HAIR LOOKS
              </span>
            </div>
            <figcaption className="p-6 md:p-8">
              <h3 className="font-serif text-2xl font-medium md:text-3xl">Modern Wedding Hair Inspiration</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Polished bridal hairstyles styled to showcase maang-tikka, jhumkas and statement chandbalis from our atelier.
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}