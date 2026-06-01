import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { PHONE_INTL } from "@/components/contact";
import yellowEmerald from "@/assets/lehenga-yellow-emerald.jpg";
import pinkLeaf from "@/assets/lehenga-pink-leaf.jpg";
import peachLotus from "@/assets/lehenga-peach-lotus.jpg";
import blushFloral from "@/assets/lehenga-blush-floral.jpg";
import pinkTeal from "@/assets/lehenga-pink-teal.jpg";
import redGreenPeacock from "@/assets/lehenga-red-green-peacock.jpg";
import royalBluePeacock from "@/assets/lehenga-royal-blue-peacock.jpg";
import rainbowSparkle from "@/assets/lehenga-rainbow-sparkle.jpg";
import rainbowHoli from "@/assets/lehenga-rainbow-holi.jpg";
import whiteRedRose from "@/assets/lehenga-white-red-rose.jpg";

const URL = "https://elite-jewellery-gallery.lovable.app/lookbook";

type Look = {
  id: string;
  image: string;
  outfit: string;
  vibe: string;
  palette: string;
  pairings: { name: string; note: string }[];
  hero?: string;
  heroLink?: string;
  tags: LookTag[];
};

const TAGS = ["Bridal", "Wedding", "Party", "Festive"] as const;
type LookTag = (typeof TAGS)[number];

const LOOKS: Look[] = [
  {
    id: "yellow-emerald",
    image: yellowEmerald,
    outfit: "Haldi Sunshine Lehenga",
    vibe: "Haldi · Mehendi · Daytime",
    palette: "Marigold yellow with emerald-green motifs",
    pairings: [
      { name: "Uncut Polki Choker", note: "Heavy gold-set polki to echo the dense embroidery." },
      { name: "Emerald Drop Jhumkas", note: "Cabochon emerald drops mirror the green stones on the bust." },
      { name: "Matha Patti & Maang Tikka", note: "A delicate forehead piece to crown the daytime glow." },
    ],
    tags: ["Festive"],
  },
  {
    id: "pink-leaf",
    image: pinkLeaf,
    outfit: "Rosé Leaf Couture Lehenga",
    vibe: "Engagement · Reception",
    palette: "Ivory & crimson leaves on blush",
    pairings: [
      { name: "Rosé Blossom Tennis Bracelet", note: "From our own atelier — pink sapphires in rose gold." },
      { name: "Papillon Cascade Earrings", note: "Crystal butterflies with pink sapphire droplets." },
      { name: "Slim Rani Haar", note: "A single fine rose-gold rani haar — never overpower the leaves." },
    ],
    hero: "Floral Ring Collection",
    heroLink: "/collections/floral-rings",
    tags: ["Wedding", "Party"],
  },
  {
    id: "peach-lotus",
    image: peachLotus,
    outfit: "Pastel Lotus Bridal Lehenga",
    vibe: "Bride · Sangeet · Cocktail",
    palette: "Champagne, blush & lotus pink",
    pairings: [
      { name: "Pearl & Polki Layered Choker", note: "Soft luminance to match the pastel palette." },
      { name: "Floral Jhumkas with Pearl Drops", note: "Petal motifs that mirror the lotus border." },
      { name: "Haath Phool", note: "A hand harness to complete the romantic, hand-crafted feel." },
    ],
    tags: ["Bridal", "Party"],
  },
  {
    id: "blush-floral",
    image: blushFloral,
    outfit: "Blush Pink Floral Lehenga",
    vibe: "Roka · Mehendi · Engagement",
    palette: "Blush, coral & soft rose",
    pairings: [
      { name: "Pink Floral Luxe Set", note: "Our blush-pink halo necklace + earrings — made for this look." },
      { name: "Butterfly Bloom Statement Ring", note: "Hand-enamelled blooms to echo the dupatta scallops." },
      { name: "Delicate Diamond Studs", note: "Keep the ear simple — the dupatta is the drama." },
    ],
    tags: ["Wedding", "Festive"],
  },
  {
    id: "pink-teal",
    image: pinkTeal,
    outfit: "Pink & Teal Half-Saree",
    vibe: "South-Indian Wedding · Reception",
    palette: "Hot pink, teal & antique gold",
    pairings: [
      { name: "Kundan-Emerald Choker Set", note: "Antique gold finish with green stones for a temple-style feel." },
      { name: "Jhumkas with Green Beads", note: "Long jhumkas to balance the heavy pallu." },
      { name: "Gold Kamarbandh", note: "Define the waist over the teal pleats." },
    ],
    tags: ["Wedding"],
  },
  {
    id: "red-green-peacock",
    image: redGreenPeacock,
    outfit: "Red & Green Peacock Lehenga",
    vibe: "Bride · Wedding Day",
    palette: "Ruby red, forest green & 24kt gold",
    pairings: [
      { name: "Temple-Style Long Haar", note: "Layered with a short choker for the full bridal stack." },
      { name: "Peacock Jhumkas", note: "Meenakari peacocks to echo the skirt motifs." },
      { name: "Royal Sapphire Halo Ring", note: "An elegant accent against the deep red palette." },
      { name: "Statement Nath", note: "Hand-strung pearls and ruby — the heirloom finish." },
    ],
    tags: ["Bridal", "Wedding"],
  },
  {
    id: "royal-blue-peacock",
    image: royalBluePeacock,
    outfit: "Royal Blue Peacock Lehenga",
    vibe: "Reception · Cocktail Night",
    palette: "Sapphire blue, teal & antique gold",
    pairings: [
      { name: "Sapphire & Polki Choker", note: "Blue sapphires set in pavé diamonds to mirror the skirt." },
      { name: "Chandelier Diamond Earrings", note: "Pear-cut diamonds suspended in gold lattice." },
      { name: "Iridescent Feather Solitaire", note: "Our couture solitaire — a single, unforgettable accent." },
      { name: "Diamond Bangles Stack", note: "Slim bangles, never thick — let the lehenga breathe." },
    ],
    hero: "Iridescent Feather Solitaire",
    tags: ["Party", "Wedding"],
  },
  {
    id: "rainbow-sparkle",
    image: rainbowSparkle,
    outfit: "Sunset Sparkle Lehenga",
    vibe: "Sangeet · Cocktail · Reception",
    palette: "Magenta, saffron & ember",
    pairings: [
      { name: "Uncut Diamond Choker", note: "Clean and bright — let the lehenga be the colour." },
      { name: "Diamond Studs", note: "Minimal ear, since the ombré already sings." },
      { name: "Stacked Diamond Bangles", note: "Light catches them like the lehenga's crystals." },
    ],
    tags: ["Party"],
  },
  {
    id: "rainbow-holi",
    image: rainbowHoli,
    outfit: "Rainbow Holi Lehenga",
    vibe: "Holi · Mehendi · Festive",
    palette: "All-spectrum rainbow with white base",
    pairings: [
      { name: "Multicolour Meenakari Choker", note: "Hand-painted enamel to match every panel." },
      { name: "Colourful Beaded Jhumkas", note: "Playful, light — perfect for dancing." },
      { name: "Gold Kamarbandh", note: "Anchor the waist and add structure." },
    ],
    tags: ["Festive"],
  },
  {
    id: "white-red-rose",
    image: whiteRedRose,
    outfit: "White & Red Rose Bridal Lehenga",
    vibe: "Bride · Wedding Day · Reception",
    palette: "Ivory, ruby red & forest green",
    pairings: [
      { name: "Ruby-Gold Bridal Choker Set", note: "Pigeon-blood rubies in 22kt gold — the soul of the look." },
      { name: "Ruby Jhumkas with Pearl Drops", note: "Long jhumkas to frame the face." },
      { name: "Floral Ring Collection — The Crimson Rose", note: "Our hand-sculpted ruby rose ring is made for this lehenga." },
      { name: "Maang Tikka & Nath", note: "Traditional ruby-set pieces to crown the bridal moment." },
    ],
    hero: "Floral Ring Collection",
    heroLink: "/collections/floral-rings",
    tags: ["Bridal", "Wedding"],
  },
];

function waUrl(message: string) {
  return `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(message)}`;
}

function lookWhatsAppUrl(look: Look, index: number) {
  const lookNo = String(index + 1).padStart(2, "0");
  const pieces = look.pairings.map((p) => `• ${p.name}`).join("\n");
  const msg =
    `Hi Elite Gallery, I'm interested in customising this specific jewellery look from your Style with Lehenga lookbook:\n\n` +
    `Look ${lookNo} — ${look.outfit}\n` +
    `Occasion: ${look.vibe}\n` +
    `Palette: ${look.palette}\n\n` +
    `Suggested pairing:\n${pieces}\n\n` +
    `Please share more details, pricing and how we can customise this set for me.`;
  return waUrl(msg);
}

const HERO_WA_MSG =
  `Hi Elite Gallery, I'm browsing your Style with Lehenga lookbook and would like a custom jewellery pairing designed for my outfit. ` +
  `Please guide me on the available options and customisation process.`;

const BOTTOM_WA_MSG =
  `Hi Elite Gallery, my lehenga isn't in the Style with Lehenga lookbook. ` +
  `I'd like to share a photo of my outfit and get a bespoke jewellery set — choker, jhumkas, ring and bangles — designed for my colour palette, neckline and occasion.`;

function shareLookOnWhatsApp(look: Look, index: number) {
  const lookNo = String(index + 1).padStart(2, "0");
  const lookUrl = `${URL}#look-${index + 1}`;
  const text =
    `Check out this jewellery pairing I'm considering from Elite Jewellery Gallery —\n\n` +
    `Look ${lookNo}: ${look.outfit}\n` +
    `${look.vibe} · ${look.palette}\n\n` +
    `See the full look here: ${lookUrl}\n\n` +
    `What do you think?`;

  if (typeof navigator !== "undefined" && navigator.share) {
    navigator
      .share({ title: `${look.outfit} — Elite Jewellery Gallery`, text, url: lookUrl })
      .catch(() => {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
      });
    return;
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
}

function inquireLookWhatsAppUrl(look: Look, index: number) {
  const lookNo = String(index + 1).padStart(2, "0");
  const lookUrl = `${URL}#look-${index + 1}`;
  const tagsLine = look.tags.join(", ");
  const msg =
    `Hi Elite Jewellery Gallery, I am interested in this design:\n\n` +
    `Look ${lookNo} — ${look.outfit}\n` +
    `Tags: ${tagsLine}\n` +
    `Occasion: ${look.vibe}\n` +
    `Palette: ${look.palette}\n\n` +
    `Reference: ${lookUrl}\n\n` +
    `Please share more details and pricing.`;
  return waUrl(msg);
}

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: [
      { title: "Style with Lehenga — Jewellery Pairing Lookbook | Elite Jewellery Gallery" },
      {
        name: "description",
        content:
          "A curated lookbook pairing ten signature lehenga styles with matching Elite Jewellery — chokers, jhumkas, rings and bridal sets. Hand-styled by our atelier.",
      },
      { property: "og:title", content: "Style with Lehenga — Jewellery Pairing Lookbook" },
      {
        property: "og:description",
        content: "Ten lehenga looks, ten signature jewellery pairings — from bridal rubies to pastel pearls.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { property: "og:image", content: whiteRedRose },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Style with Lehenga — Jewellery Pairing Lookbook",
          description:
            "Curated lookbook pairing ten lehenga styles with matching Elite Jewellery pieces.",
          url: URL,
          author: { "@type": "Organization", name: "Elite Jewellery Gallery" },
          publisher: { "@type": "Organization", name: "Elite Jewellery Gallery" },
          image: whiteRedRose,
        }),
      },
    ],
  }),
  component: LookbookPage,
});

function LookbookPage() {
  const [activeTag, setActiveTag] = useState<LookTag | "All">("All");
  const [zoomedLook, setZoomedLook] = useState<{ look: Look; index: number } | null>(null);

  useEffect(() => {
    if (!zoomedLook) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoomedLook(null);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [zoomedLook]);

  const visibleLooks = useMemo(
    () =>
      LOOKS.map((look, index) => ({ look, index })).filter(({ look }) =>
        activeTag === "All" ? true : look.tags.includes(activeTag),
      ),
    [activeTag],
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-cream">
          <div className="mx-auto max-w-7xl px-5 py-16 text-center md:px-10 md:py-24">
            <span className="text-[10px] tracking-luxe text-[var(--gold-dark)]">
              STYLING LOOKBOOK
            </span>
            <h1 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">
              Style with Lehenga
            </h1>
            <p className="mx-auto mt-5 max-w-2xl font-serif text-lg italic text-[var(--gold-dark)] md:text-2xl">
              Ten outfits. Ten signature pairings. One unforgettable you.
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
              From haldi mornings to bridal evenings, our atelier has hand-styled each
              lehenga with the Elite Jewellery pieces that bring it to life — and every
              piece can be custom-crafted to your exact outfit.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={waUrl(HERO_WA_MSG)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gradient-gold px-7 py-3 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.02]"
              >
                Request a Custom Pairing
              </a>
              <Link
                to="/"
                className="rounded-full border border-border px-7 py-3 text-sm font-medium text-foreground hover:bg-secondary"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mx-auto max-w-5xl px-5 pt-12 md:px-10">
          <p className="rounded-2xl border border-border bg-secondary/40 px-5 py-4 text-center text-xs text-muted-foreground md:text-sm">
            The lehengas shown below are styling references only. Elite Jewellery
            Gallery specialises in premium jewellery customised to match your dream outfit.
          </p>
        </section>

        {/* Filter tabs */}
        <section className="mx-auto max-w-5xl px-5 pt-8 md:px-10">
          <div
            role="tablist"
            aria-label="Filter looks by occasion"
            className="sticky top-16 z-20 -mx-5 flex gap-2 overflow-x-auto bg-background/85 px-5 py-3 backdrop-blur md:mx-0 md:justify-center md:rounded-full md:px-4"
          >
            {(["All", ...TAGS] as const).map((tag) => {
              const isActive = activeTag === tag;
              const count =
                tag === "All"
                  ? LOOKS.length
                  : LOOKS.filter((l) => l.tags.includes(tag)).length;
              return (
                <button
                  key={tag}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTag(tag)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition-colors md:text-sm ${
                    isActive
                      ? "border-transparent bg-gradient-gold text-white shadow-soft"
                      : "border-border bg-background text-foreground hover:bg-secondary"
                  }`}
                >
                  {tag}
                  <span
                    className={`ml-2 text-[10px] ${
                      isActive ? "text-white/80" : "text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Looks */}
        <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
          <div className="flex flex-col gap-20 md:gap-28">
            {visibleLooks.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                No looks in this category yet — try another filter.
              </p>
            )}
            {visibleLooks.map(({ look, index: i }) => (
              <article
                key={look.id}
                id={`look-${i + 1}`}
                className={`grid gap-8 md:grid-cols-2 md:items-center md:gap-14 ${
                  i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setZoomedLook({ look, index: i })}
                    aria-label={`Zoom Look ${String(i + 1).padStart(2, "0")} — ${look.outfit}`}
                    className="group block w-full overflow-hidden rounded-2xl shadow-luxe focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-dark)]"
                  >
                    <img
                      src={look.image}
                      alt={`${look.outfit} — styling reference for matching Elite Jewellery pairings`}
                      loading="lazy"
                      className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </button>
                  <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[10px] tracking-luxe text-[var(--gold-dark)] backdrop-blur">
                    LOOK {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[10px] tracking-luxe text-foreground/70 backdrop-blur">
                    TAP TO ZOOM
                  </span>
                </div>
                <div>
                  <span className="text-[10px] tracking-luxe text-[var(--gold-dark)]">
                    {look.vibe.toUpperCase()}
                  </span>
                  <h2 className="mt-3 font-serif text-3xl md:text-4xl">{look.outfit}</h2>
                  <p className="mt-2 text-sm italic text-muted-foreground">{look.palette}</p>

                  <h3 className="mt-7 font-serif text-lg text-foreground/90">
                    The Jewellery Pairing
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {look.pairings.map((p) => (
                      <li key={p.name} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold-dark)]"
                        />
                        <div>
                          <p className="font-medium text-foreground">{p.name}</p>
                          <p className="text-sm text-muted-foreground">{p.note}</p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href={lookWhatsAppUrl(look, i)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-gradient-gold px-6 py-2.5 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.02]"
                    >
                      Customise this pairing
                    </a>
                    {look.heroLink && (
                      <Link
                        to={look.heroLink}
                        className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                      >
                        View {look.hero}
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => shareLookOnWhatsApp(look, i)}
                      aria-label={`Share Look ${String(i + 1).padStart(2, "0")} — ${look.outfit} with friends on WhatsApp`}
                      title="Share with friends"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                      Share
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-cream">
          <div className="mx-auto max-w-4xl px-5 py-16 text-center md:px-10 md:py-24">
            <h2 className="font-serif text-3xl md:text-5xl">
              Don't see your lehenga?
            </h2>
            <p className="mt-5 text-base text-muted-foreground md:text-lg">
              Send us a photo of your outfit on WhatsApp and our designers will sketch
              a bespoke jewellery set — choker, jhumkas, ring and bangles — crafted to
              your colour palette, neckline and occasion.
            </p>
            <a
              href={waUrl(BOTTOM_WA_MSG)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.02]"
            >
              Start Your Custom Pairing on WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFAB />
      {zoomedLook && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${zoomedLook.look.outfit} — zoom view`}
        >
          <div
            className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
            onClick={() => setZoomedLook(null)}
          />
          <div className="relative grid max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-background shadow-luxe md:grid-cols-[1.2fr_1fr]">
            <button
              type="button"
              onClick={() => setZoomedLook(null)}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 rounded-full bg-background/90 p-2 text-foreground shadow-soft hover:bg-secondary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="relative max-h-[60vh] overflow-auto bg-charcoal md:max-h-none">
              <img
                src={zoomedLook.look.image}
                alt={`${zoomedLook.look.outfit} — zoomed view`}
                className="h-auto w-full object-contain md:h-full md:object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[10px] tracking-luxe text-[var(--gold-dark)] backdrop-blur">
                LOOK {String(zoomedLook.index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="flex flex-col gap-5 overflow-y-auto p-6 md:p-8">
              <span className="text-[10px] tracking-luxe text-[var(--gold-dark)]">
                {zoomedLook.look.vibe.toUpperCase()}
              </span>
              <h3 className="font-serif text-3xl md:text-4xl">{zoomedLook.look.outfit}</h3>
              <p className="text-sm italic text-muted-foreground">{zoomedLook.look.palette}</p>
              <div className="flex flex-wrap gap-2">
                {zoomedLook.look.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-[11px] font-medium tracking-wide text-foreground/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <a
                href={inquireLookWhatsAppUrl(zoomedLook.look, zoomedLook.index)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-center text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.02] hover:bg-[#1ebe5d]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .15 5.34.15 11.9c0 2.1.55 4.14 1.6 5.95L0 24l6.31-1.66a11.86 11.86 0 0 0 5.74 1.46h.01c6.56 0 11.91-5.34 11.91-11.9 0-3.18-1.24-6.17-3.45-8.42ZM12.06 21.5h-.01a9.6 9.6 0 0 1-4.89-1.34l-.35-.21-3.74.98 1-3.65-.23-.37a9.55 9.55 0 0 1-1.47-5.12c0-5.29 4.31-9.6 9.61-9.6 2.57 0 4.98 1 6.79 2.81a9.52 9.52 0 0 1 2.82 6.8c0 5.29-4.31 9.6-9.53 9.7Zm5.27-7.18c-.29-.14-1.71-.84-1.97-.94-.27-.1-.46-.14-.65.14-.19.29-.74.94-.91 1.13-.17.19-.34.22-.62.07-.29-.14-1.22-.45-2.32-1.44a8.76 8.76 0 0 1-1.61-2c-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.65-1.57-.89-2.15-.23-.56-.47-.48-.65-.49h-.55c-.19 0-.51.07-.77.36-.27.29-1.02 1-1.02 2.43s1.04 2.82 1.19 3.02c.14.19 2.05 3.13 4.97 4.39.69.3 1.24.48 1.66.61.7.22 1.33.19 1.83.12.56-.08 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.27-.19-.55-.34Z"/>
                </svg>
                Inquire on WhatsApp
              </a>
              <p className="text-xs text-muted-foreground">
                Opens WhatsApp with your details pre-filled so we know exactly which look you mean.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}