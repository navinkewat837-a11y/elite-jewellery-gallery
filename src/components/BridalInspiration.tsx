import bridalImage from "@/assets/bridal-lehenga.jpg.asset.json";
import { BlurImage } from "./BlurImage";
import bridalVideo from "@/assets/bridal-inspiration.mp4.asset.json";
import { useRef } from "react";
import { useInView } from "@/hooks/useInView";

export function BridalInspiration() {
  const lehengaRef = useRef<HTMLElement>(null);
  const hairRef = useRef<HTMLElement>(null);
  const { ref: videoWrapRef, inView: videoInView } =
    useInView<HTMLDivElement>();

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLElement>,
    ref: React.RefObject<HTMLElement | null>
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      ref.current?.click();
    }
  };

  return (
    <section
      id="bridal-inspiration"
      className="bg-background py-16 md:py-32"
      aria-labelledby="bridal-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
        <div className="mx-auto max-w-2xl px-2 text-center sm:px-0">
          <span className="text-[11px] tracking-luxe text-[var(--gold-dark)]">
            BRIDAL ATELIER
          </span>
          <h2
            id="bridal-heading"
            className="mt-4 font-serif text-3xl font-light md:text-6xl"
          >
            Bridal{" "}
            <span className="italic text-gradient-gold">Inspiration</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:mt-4 md:text-base">
            Couture lehengas and wedding-day looks — curated to pair with our
            heirloom jewellery.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:gap-8 lg:grid-cols-2">
          {/* Lehenga Card */}
          <figure
            ref={lehengaRef}
            tabIndex={0}
            role="button"
            aria-label="View Peacock Ombré Couture Lehenga details. Hand-embroidered peacock and floral motifs on tiered pink-to-purple net with butterfly blouse and lilac dupatta. Category: Signature Lehenga."
            aria-labelledby="lehenga-title"
            aria-describedby="lehenga-desc"
            onKeyDown={(e) => handleKeyDown(e, lehengaRef)}
            className="group cursor-pointer overflow-hidden rounded-2xl bg-cream shadow-soft ring-1 ring-transparent transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-luxe hover:ring-[var(--gold-light)]/40 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.985] active:shadow-soft active:transition-transform active:duration-75"
          >
            <div className="relative aspect-[16/10] overflow-hidden md:aspect-[3/4]">
              <BlurImage
                src={bridalImage.url}
                alt="Peacock embroidered tiered bridal lehenga in pink, magenta and purple ombré with butterfly-motif blouse"
                loading="lazy"
                decoding="async"
                sizes="(min-width: 768px) 50vw, 100vw"
                width={900}
                height={1200}
                wrapperClassName="h-full w-full"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-active:scale-[1.02]"
              />
              <span
                aria-hidden="true"
                className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] tracking-luxe text-[var(--gold-dark)] shadow-sm backdrop-blur transition-transform duration-300 group-hover:scale-105 md:left-4 md:top-4"
              >
                SIGNATURE LEHENGA
              </span>
            </div>
            <figcaption className="p-5 transition-colors duration-300 group-hover:bg-[var(--cream)]/80 md:p-8">
              <h3
                id="lehenga-title"
                className="font-serif text-xl font-medium transition-colors duration-300 group-hover:text-[var(--gold-dark)] md:text-3xl"
              >
                Peacock Ombré Couture Lehenga
              </h3>
              <p
                id="lehenga-desc"
                className="mt-2 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80"
              >
                Hand-embroidered peacock and floral motifs cascade across tiered
                pink-to-purple net, finished with a sculpted butterfly blouse and
                lilac dupatta — pair with our bridal payal.
              </p>
            </figcaption>
          </figure>

          {/* Wedding Hair Card */}
          <figure
            ref={hairRef}
            tabIndex={0}
            role="button"
            aria-label="View Modern Wedding Hair Inspiration details. Polished bridal hairstyles styled to showcase maang-tikka, jhumkas and statement chandbalis. Category: Wedding Hair Looks."
            aria-labelledby="hair-title"
            aria-describedby="hair-desc"
            onKeyDown={(e) => handleKeyDown(e, hairRef)}
            className="group cursor-pointer overflow-hidden rounded-2xl bg-cream shadow-soft ring-1 ring-transparent transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-luxe hover:ring-[var(--gold-light)]/40 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.985] active:shadow-soft active:transition-transform active:duration-75"
          >
            <div
              ref={videoWrapRef}
              className="relative aspect-[16/10] overflow-hidden bg-charcoal md:aspect-[3/4]"
            >
              {videoInView && (
                <video
                  src={bridalVideo.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-active:scale-[1.02]"
                  aria-label="Modern wedding hairstyle inspiration video showing polished bridal looks"
                />
              )}
              <span
                aria-hidden="true"
                className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] tracking-luxe text-[var(--gold-dark)] shadow-sm backdrop-blur transition-transform duration-300 group-hover:scale-105 md:left-4 md:top-4"
              >
                WEDDING HAIR LOOKS
              </span>
            </div>
            <figcaption className="p-5 transition-colors duration-300 group-hover:bg-[var(--cream)]/80 md:p-8">
              <h3
                id="hair-title"
                className="font-serif text-xl font-medium transition-colors duration-300 group-hover:text-[var(--gold-dark)] md:text-3xl"
              >
                Modern Wedding Hair Inspiration
              </h3>
              <p
                id="hair-desc"
                className="mt-2 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80"
              >
                Polished bridal hairstyles styled to showcase maang-tikka,
                jhumkas and statement chandbalis from our atelier.
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
