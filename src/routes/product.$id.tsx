import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { BlurImage } from "@/components/BlurImage";
import { PRODUCTS, type Category, type Product } from "@/components/products";
import { quoteUrl } from "@/components/contact";
import { useDbProducts } from "@/hooks/useDbProducts";
import { usePreviewMode } from "@/hooks/usePreviewMode";

const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const SITE = "https://elite-jewellery-gallery.lovable.app";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = PRODUCTS.find((x) => x.id === params.id);
    const title = p
      ? `${p.name} — ${p.category} | Elite Jewellery Gallery`
      : "Product Details | Elite Jewellery Gallery";
    const description = p
      ? p.description.slice(0, 155)
      : "Explore hand-finished fine jewellery with full details, gallery and instant WhatsApp quotes.";
    const url = `${SITE}/product/${params.id}`;
    const image = p && /^https?:\/\//.test(p.image) ? p.image : undefined;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ProductDetailsPage,
});

function ProductDetailsPage() {
  const { id } = Route.useParams();
  const { enabled: previewEnabled } = usePreviewMode();
  const { products: dbProducts, loading } = useDbProducts({ preview: previewEnabled });
  const [activeIdx, setActiveIdx] = useState(0);
  const [metalChoice, setMetalChoice] = useState("");
  const [sizeChoice, setSizeChoice] = useState("");
  const [note, setNote] = useState("");

  const product: Product | null = useMemo(() => {
    const stat = PRODUCTS.find((p) => p.id === id);
    if (stat) return stat;
    const db = dbProducts.find((p) => `db-${p.id}` === id || p.id === id);
    if (!db) return null;
    return {
      id: `db-${db.id}`,
      name: db.name,
      category: db.category as Category,
      price: Number(db.price),
      image: db.image,
      gallery: db.gallery?.length ? db.gallery : undefined,
      description: db.description,
      isNew: db.is_new,
      weight: db.weight ?? undefined,
      metal: db.metal ?? undefined,
      createdAt: db.created_at,
    };
  }, [id, dbProducts]);

  useEffect(() => {
    setActiveIdx(0);
    setMetalChoice("");
    setSizeChoice("");
    setNote("");
  }, [id]);

  const images = product ? (product.gallery?.length ? product.gallery : [product.image]) : [];

  const related = useMemo(
    () => (product ? PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3) : []),
    [product],
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
          <h1 className="font-serif text-4xl">{loading ? "Loading piece…" : "Piece not found"}</h1>
          {!loading && (
            <>
              <p className="mt-3 text-muted-foreground">
                This design may have been retired or moved. Browse the full collection instead.
              </p>
              <Link
                to="/"
                hash="collection"
                className="mt-8 rounded-full bg-gradient-gold px-7 py-3 text-sm font-medium text-white"
              >
                View Collection
              </Link>
            </>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  const quote = quoteUrl(product.name, product.price, {
    category: product.category,
    weight: product.weight,
    metal: metalChoice || undefined,
    size: sizeChoice.trim() || undefined,
    note: note.trim() || undefined,
    link: `${SITE}/product/${product.id}`,
  });
  const hasCustomisation = !!(metalChoice || sizeChoice.trim() || note.trim());

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-5 pb-32 pt-28 md:px-10 md:pb-24 md:pt-32">
        <nav aria-label="Breadcrumb" className="text-xs tracking-luxe text-muted-foreground">
          <Link to="/" className="hover:text-[var(--gold-dark)]">HOME</Link>
          <span className="mx-2">/</span>
          <Link to="/" hash="collection" className="hover:text-[var(--gold-dark)]">
            {product.category.toUpperCase()}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground/70">{product.name.toUpperCase()}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-cream shadow-luxe">
              <BlurImage
                key={images[activeIdx]}
                src={images[activeIdx]}
                alt={`${product.name} — view ${activeIdx + 1}`}
                width={1600}
                height={1600}
                fetchPriority="high"
                decoding="async"
                sizes="(min-width: 1024px) 50vw, 100vw"
                wrapperClassName="aspect-square w-full"
                className="h-full w-full object-cover"
              />
              {product.isNew && (
                <span className="absolute left-5 top-5 rounded-full bg-gradient-gold px-3 py-1 text-[10px] tracking-luxe text-white shadow-soft">
                  NEW ARRIVAL
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    aria-label={`Show image ${i + 1} of ${images.length}`}
                    aria-current={i === activeIdx}
                    className={`overflow-hidden rounded-xl border-2 transition-all ${
                      i === activeIdx
                        ? "border-[var(--gold)] shadow-soft"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="aspect-square h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-[11px] tracking-luxe text-[var(--gold-dark)]">
                {product.category.toUpperCase()}
              </span>
              <h1 className="mt-3 font-serif text-4xl font-light md:text-5xl">{product.name}</h1>
              <p className="mt-4 font-serif text-3xl text-gradient-gold md:text-4xl">
                {fmt.format(product.price)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Inclusive of making charges · Final price confirmed on enquiry
              </p>
            </div>

            <p className="text-base leading-relaxed text-muted-foreground">{product.description}</p>

            <ul className="text-sm text-foreground/80">
              <li className="flex justify-between border-b border-border py-3">
                <span className="text-muted-foreground">Metal</span>
                <span>{product.metal ?? "18kt Yellow Gold"}</span>
              </li>
              {product.weight && (
                <li className="flex justify-between border-b border-border py-3">
                  <span className="text-muted-foreground">Weight</span>
                  <span>{product.weight}</span>
                </li>
              )}
              <li className="flex justify-between border-b border-border py-3">
                <span className="text-muted-foreground">Certification</span>
                <span>BIS Hallmarked</span>
              </li>
              <li className="flex justify-between border-b border-border py-3">
                <span className="text-muted-foreground">Make</span>
                <span>Hand-finished in our atelier</span>
              </li>
              <li className="flex justify-between border-b border-border py-3">
                <span className="text-muted-foreground">Customisation</span>
                <span>Size, metal &amp; stones on request</span>
              </li>
            </ul>

            {/* Always-available quote button (inline, desktop) */}
            <div className="rounded-2xl border border-border bg-cream/60 p-5">
              <h2 className="font-serif text-lg">Customise this piece <span className="text-xs tracking-luxe text-muted-foreground">(OPTIONAL)</span></h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Anything you select here is added to your WhatsApp message automatically.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-xs tracking-luxe text-muted-foreground">
                  METAL / FINISH
                  <select
                    value={metalChoice}
                    onChange={(e) => setMetalChoice(e.target.value)}
                    className="rounded-full border border-border bg-background px-4 py-2.5 text-sm tracking-normal text-foreground outline-none focus:border-[var(--gold)]"
                  >
                    <option value="">As listed</option>
                    <option value="18kt Yellow Gold">18kt Yellow Gold</option>
                    <option value="18kt Rose Gold">18kt Rose Gold</option>
                    <option value="18kt White Gold">18kt White Gold</option>
                    <option value="925 Sterling Silver">925 Sterling Silver</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-xs tracking-luxe text-muted-foreground">
                  SIZE / LENGTH
                  <input
                    value={sizeChoice}
                    onChange={(e) => setSizeChoice(e.target.value)}
                    placeholder="e.g. Ring size 14 / 16 inch"
                    className="rounded-full border border-border bg-background px-4 py-2.5 text-sm tracking-normal text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-[var(--gold)]"
                  />
                </label>
              </div>
              <label className="mt-3 flex flex-col gap-1.5 text-xs tracking-luxe text-muted-foreground">
                SPECIAL REQUESTS
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Stone colour, engraving, delivery timeline…"
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm tracking-normal text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-[var(--gold)]"
                />
              </label>
              {hasCustomisation && (
                <p className="mt-3 text-xs text-[var(--gold-dark)]">
                  Your customisation details will be included in the quote message.
                </p>
              )}
            </div>

            <a
              href={quote}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.02] md:inline-flex"
            >
              <WhatsAppIcon /> Request Quote on WhatsApp
            </a>
            <p className="hidden text-center text-xs text-muted-foreground md:block">
              Typically replies within a few minutes during store hours.
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif text-3xl font-light">
              More in <span className="italic text-gradient-gold">{product.category}</span>
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to="/product/$id"
                  params={{ id: p.id }}
                  className="group overflow-hidden rounded-xl bg-cream shadow-soft transition-all hover:-translate-y-1 hover:shadow-luxe"
                >
                  <div className="aspect-square overflow-hidden">
                    <BlurImage
                      src={p.image}
                      alt={p.name}
                      width={800}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      wrapperClassName="h-full w-full"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl">{p.name}</h3>
                    <p className="mt-1 font-serif text-lg text-gradient-gold">{fmt.format(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Sticky mobile quote bar — always available */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-sm">{product.name}</p>
            <p className="font-serif text-lg text-gradient-gold">{fmt.format(product.price)}</p>
          </div>
          <a
            href={quote}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-medium text-white shadow-soft"
          >
            <WhatsAppIcon /> Request Quote
          </a>
        </div>
      </div>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M16.003 3C9.374 3 4 8.373 4 15c0 2.387.701 4.611 1.905 6.477L4 29l7.7-1.857A11.94 11.94 0 0 0 16.003 27C22.628 27 28 21.627 28 15S22.628 3 16.003 3zm0 21.6c-1.86 0-3.6-.52-5.08-1.42l-.36-.22-4.57 1.1 1.12-4.45-.24-.37A9.55 9.55 0 0 1 6.4 15c0-5.29 4.31-9.6 9.603-9.6 5.29 0 9.597 4.31 9.597 9.6s-4.307 9.6-9.597 9.6z" />
    </svg>
  );
}
