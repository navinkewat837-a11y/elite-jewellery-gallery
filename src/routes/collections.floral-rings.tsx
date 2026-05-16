import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { PRODUCTS } from "@/components/products";
import { generalWhatsAppUrl } from "@/components/contact";
import butterflyBloomRing from "@/assets/butterfly-bloom-ring.jpg";
import sapphireHaloRing from "@/assets/sapphire-halo-ring.jpg";
import iridescentFeatherRing from "@/assets/iridescent-feather-ring.jpg";

const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const URL = "https://elite-jewellery-gallery.lovable.app/collections/floral-rings";

export const Route = createFileRoute("/collections/floral-rings")({
  head: () => ({
    meta: [
      { title: "Floral Ring Collection — Ruby & Amethyst Couture | Elite Jewellery Gallery" },
      { name: "description", content: "Hand-sculpted 18kt gold floral rings set with pigeon-blood rubies, royal amethysts and pavé diamonds. Romantic, regal, hand-finished in our Shahdol atelier." },
      { property: "og:title", content: "Floral Ring Collection — Where Gold Blossoms into Legend" },
      { property: "og:description", content: "Couture floral rings in 18kt gold with ruby, amethyst and diamond." },
      { property: "og:type", content: "product.group" },
      { property: "og:url", content: URL },
      { property: "og:image", content: butterflyBloomRing },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProductGroup",
          name: "Floral Ring Collection",
          description:
            "Hand-sculpted 18kt gold floral rings featuring rubies, amethysts and pavé diamonds.",
          url: URL,
          brand: { "@type": "Brand", name: "Elite Jewellery Gallery" },
        }),
      },
    ],
  }),
  component: FloralRingsPage,
});

function FloralRingsPage() {
  const floralRings = PRODUCTS.filter((p) => ["new4", "new5", "new6"].includes(p.id));
  const rubyPick = PRODUCTS.find((p) => p.id === "new6")!;
  const amethystPick = PRODUCTS.find((p) => p.id === "new5")!;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-cream">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:px-10 md:py-24">
            <div>
              <span className="text-[10px] tracking-luxe text-[var(--gold-dark)]">
                COUTURE COLLECTION
              </span>
              <h1 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">
                Floral Ring Collection
              </h1>
              <p className="mt-2 font-serif text-xl italic text-[var(--gold-dark)] md:text-2xl">
                Where Gold Blossoms into Legend
              </p>
              <p className="mt-6 text-base text-muted-foreground md:text-lg">
                Step into a garden cast in eighteen-karat gold, where every petal
                is hand-sculpted and every gemstone breathes light. An ode to the
                eternal rose — reimagined by master artisans for those who wear
                beauty as a birthright.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={generalWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gradient-gold px-7 py-3 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.02]"
                >
                  Enquire on WhatsApp
                </a>
                <Link
                  to="/"
                  className="rounded-full border border-border px-7 py-3 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Back to Home
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={butterflyBloomRing}
                alt="Hand-enamelled butterfly and bloom 18kt gold ring with diamond accents"
                className="aspect-square w-full rounded-2xl object-cover shadow-luxe"
              />
            </div>
          </div>
        </section>

        {/* The Craftsmanship */}
        <section className="mx-auto max-w-5xl px-5 py-16 md:px-10 md:py-24">
          <h2 className="font-serif text-3xl md:text-5xl">The Craftsmanship</h2>
          <p className="mt-6 text-base text-foreground/80 md:text-lg">
            Each ring begins as a whisper of molten gold, drawn and chased by
            hand into living blooms. Filigree vines coil around the band like
            couture lace; leaves are individually engraved with veining so fine
            it catches candlelight; rose petals unfurl in layered relief, their
            edges softened to the touch yet sharp enough to cast tiny shadows.
            Pavé-set diamonds are nestled grain-by-grain into the metalwork,
            illuminating every curve with a quiet, continuous shimmer.
          </p>
        </section>

        {/* The Gemstones — Ruby & Amethyst spotlight */}
        <section className="bg-cream">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
            <span className="text-[10px] tracking-luxe text-[var(--gold-dark)]">
              THE GEMSTONES
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl">
              Ruby & Amethyst — A Sovereign Pairing
            </h2>
            <p className="mt-6 max-w-3xl text-base text-foreground/80 md:text-lg">
              At the heart of every piece, a single extraordinary stone holds
              court. Two reign above all — the crimson fire of the ruby and the
              regal violet of the amethyst.
            </p>

            <div className="mt-12 grid gap-10 md:grid-cols-2">
              {/* Ruby */}
              <article className="overflow-hidden rounded-2xl bg-background shadow-soft">
                <img
                  src={rubyPick.image}
                  alt="Ruby floral ring in 18kt gold"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-7 md:p-8">
                  <span className="text-[10px] tracking-luxe text-[var(--gold-dark)]">
                    PIGEON-BLOOD RUBY
                  </span>
                  <h3 className="mt-2 font-serif text-2xl md:text-3xl">
                    The Crimson Rose
                  </h3>
                  <p className="mt-4 text-muted-foreground">
                    Deep, velvety crimson — prong-set within sculpted gold roses
                    and framed by hand-enamelled petals. A stone reserved for
                    passion at its most regal.
                  </p>
                  <p className="mt-5 font-serif text-2xl text-gradient-gold">
                    From {fmt.format(rubyPick.price)}
                  </p>
                </div>
              </article>

              {/* Amethyst */}
              <article className="overflow-hidden rounded-2xl bg-background shadow-soft">
                <img
                  src={amethystPick.image}
                  alt="Amethyst floral halo ring in 18kt gold"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-7 md:p-8">
                  <span className="text-[10px] tracking-luxe text-[var(--gold-dark)]">
                    ROYAL AMETHYST
                  </span>
                  <h3 className="mt-2 font-serif text-2xl md:text-3xl">
                    The Violet Crown
                  </h3>
                  <p className="mt-4 text-muted-foreground">
                    Crowned by halos of brilliant diamonds and saffron-gold
                    petals — a sovereign violet reserved for the truly
                    discerning, blooming above intricate filigree shoulders.
                  </p>
                  <p className="mt-5 font-serif text-2xl text-gradient-gold">
                    From {fmt.format(amethystPick.price)}
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* The Spirit */}
        <section className="mx-auto max-w-5xl px-5 py-16 md:px-10 md:py-24">
          <h2 className="font-serif text-3xl md:text-5xl">The Spirit</h2>
          <p className="mt-6 text-base text-foreground/80 md:text-lg">
            This is not jewellery worn — it is jewellery <em>inhabited</em>.
            Romantic, opulent, unmistakably feminine, the Floral Ring Collection
            is conceived for the woman who treats every entrance as a coronation
            and every memory as an heirloom in the making.
          </p>
          <p className="mt-6 text-sm italic text-muted-foreground">
            Crafted in 18kt gold. BIS Hallmarked. Hand-finished in our Shahdol
            atelier — available by private appointment and bespoke commission.
          </p>
        </section>

        {/* The Collection grid */}
        <section className="bg-cream">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
            <h2 className="font-serif text-3xl md:text-5xl">The Collection</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {floralRings.map((p) => (
                <article key={p.id} className="overflow-hidden rounded-2xl bg-background shadow-soft">
                  <img src={p.image} alt={p.name} className="aspect-square w-full object-cover" />
                  <div className="p-6">
                    <h3 className="font-serif text-xl">{p.name}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
                    <p className="mt-4 font-serif text-lg text-gradient-gold">{fmt.format(p.price)}</p>
                  </div>
                </article>
              ))}
            </div>
            <img src={iridescentFeatherRing} alt="" aria-hidden="true" className="hidden" />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}